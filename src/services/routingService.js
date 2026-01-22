export async function calculateRouteOSRM({ origin, destination, transport }) {
  const profiles = {
    car: "driving",
    bike: "cycling",
    walk: "foot",
  };

  const profile = profiles[transport];

  if (!profile) {
    throw new Error("Transporte inválido");
  }

  const url = `https://router.project-osrm.org/route/v1/${profile}/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=false`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao calcular rota");
  }

  const data = await response.json();

  if (!data.routes || !data.routes.length) {
    throw new Error("Rota não encontrada");
  }

  const route = data.routes[0];

  return {
    distanceKm: (route.distance / 1000).toFixed(2),
    durationMin: Math.round(route.duration / 60),
  };
}
