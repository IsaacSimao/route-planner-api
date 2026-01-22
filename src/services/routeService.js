import { addMinutesToTime, isValidTime } from "../utils/timeUtils.js";

export function calculateRouteDetails({
  departureTime,
  distanceKm,
  averageSpeedKmH,
}) {
  if (!isValidTime(departureTime)) {
    throw new Error("departureTime must be in HH:mm format");
  }

  if (distanceKm <= 0) {
    throw new Error("distanceKm must be greater than zero");
  }

  if (averageSpeedKmH <= 0) {
    throw new Error("averageSpeedKmH must be greater than zero");
  }

  const travelTimeHours = distanceKm / averageSpeedKmH;
  const travelTimeMinutes = Math.round(travelTimeHours * 60);

  const arrivalTime = addMinutesToTime(departureTime, travelTimeMinutes);

  return {
    departureTime,
    distanceKm,
    averageSpeedKmH,
    travelTimeMinutes,
    arrivalTime,
  };
}
