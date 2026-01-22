export async function geocodeAddress(address) {
  const encodedAddress = encodeURIComponent(address);

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "route-planner-api/1.0",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar endereço");
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error("Endereço não encontrado");
  }

  return {
    latitude: data[0].lat,
    longitude: data[0].lon,
    displayName: data[0].display_name,
  };
}
