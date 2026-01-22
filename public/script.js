const form = document.getElementById("routeForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const departureTime = document.getElementById("departureTime").value;
  const distanceKm = Number(document.getElementById("distanceKm").value);
  const averageSpeedKmH = Number(
    document.getElementById("averageSpeedKmH").value,
  );

  resultDiv.classList.add("hidden");
  resultDiv.innerHTML = "";

  try {
    const response = await fetch("/api/routes/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        departureTime,
        distanceKm,
        averageSpeedKmH,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao calcular rota");
    }

    resultDiv.innerHTML = `
      <strong>Tempo de viagem:</strong> ${data.travelTimeMinutes} minutos<br>
      <strong>Horário de chegada:</strong> ${data.arrivalTime}
    `;
    resultDiv.classList.remove("hidden");
  } catch (error) {
    resultDiv.innerHTML = `<span style="color:red;">${error.message}</span>`;
    resultDiv.classList.remove("hidden");
  }
});
