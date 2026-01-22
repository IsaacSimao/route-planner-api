import { calculateRouteDetails } from "../services/routeService.js";

export function calculateRoute(req, res) {
  try {
    const { departureTime, distanceKm, averageSpeedKmH } = req.body;

    if (!departureTime || !distanceKm || !averageSpeedKmH) {
      return res.status(400).json({
        error: "departureTime, distanceKm and averageSpeedKmH are required",
      });
    }

    const result = calculateRouteDetails({
      departureTime,
      distanceKm,
      averageSpeedKmH,
    });

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}
