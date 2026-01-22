import { geocodeAddress } from "../services/geocodingService.js";
import { calculateRouteOSRM } from "../services/routingService.js";

export async function calculateRoute(req, res) {
  try {
    const { origin, destination, transport } = req.body;

    if (!origin || !destination || !transport) {
      return res.status(400).json({
        error: "Origem, destino e transporte são obrigatórios",
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

    return res.json({
      origin: originData.displayName,
      destination: destinationData.displayName,
      transport,
      distanceKm: routeData.distanceKm,
      durationMin: routeData.durationMin,
      departureTime: now.toISOString(),
      estimatedArrival: arrivalTime.toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
