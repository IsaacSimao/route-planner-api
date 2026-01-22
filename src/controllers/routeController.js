import { geocodeAddress } from "../services/geocodingService.js";
import { calculateRouteOSRM } from "../services/routingService.js";
import { getCachedRoute, setCachedRoute } from "../cache/routeCache.js";

export async function calculateRoute(req, res) {
  try {
    const { origin, destination, transport } = req.body;

    if (!origin || !destination || !transport) {
      return res.status(400).json({
        error: "Origem, destino e transporte são obrigatórios",
      });
    }

    const cacheKey = `${origin}|${destination}|${transport}`;

    const cached = getCachedRoute(cacheKey);

    if (cached) {
      return res.json({
        ...cached,
        cached: true,
      });
    }

    const originData = await geocodeAddress(origin);
    const destinationData = await geocodeAddress(destination);

    const routeData = await calculateRouteOSRM({
      origin: {
        lat: originData.latitude,
        lon: originData.longitude,
      },
      destination: {
        lat: destinationData.latitude,
        lon: destinationData.longitude,
      },
      transport,
    });

    const now = new Date();
    const arrivalTime = new Date(now.getTime() + routeData.durationMin * 60000);

    const result = {
      origin: originData.displayName,
      destination: destinationData.displayName,
      transport,
      distanceKm: routeData.distanceKm,
      durationMin: routeData.durationMin,
      departureTime: now.toISOString(),
      estimatedArrival: arrivalTime.toISOString(),
    };

    setCachedRoute(cacheKey, result);

    return res.json({
      ...result,
      cached: false,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
