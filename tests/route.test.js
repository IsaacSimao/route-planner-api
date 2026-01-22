import { calculateRouteDetails } from "../src/services/routeService.js";

describe("Route Service - calculateRouteDetails", () => {
  test("should calculate arrival time correctly", () => {
    const result = calculateRouteDetails({
      departureTime: "08:00",
      distanceKm: 120,
      averageSpeedKmH: 80,
    });

    expect(result.travelTimeMinutes).toBe(90);
    expect(result.arrivalTime).toBe("09:30");
  });

  test("should throw error for invalid time format", () => {
    expect(() => {
      calculateRouteDetails({
        departureTime: "25:00",
        distanceKm: 100,
        averageSpeedKmH: 80,
      });
    }).toThrow("departureTime must be in HH:mm format");
  });

  test("should throw error for zero speed", () => {
    expect(() => {
      calculateRouteDetails({
        departureTime: "10:00",
        distanceKm: 100,
        averageSpeedKmH: 0,
      });
    }).toThrow("averageSpeedKmH must be greater than zero");
  });

  test("should throw error for negative distance", () => {
    expect(() => {
      calculateRouteDetails({
        departureTime: "10:00",
        distanceKm: -50,
        averageSpeedKmH: 80,
      });
    }).toThrow("distanceKm must be greater than zero");
  });
});
