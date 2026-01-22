const form = document.getElementById("routeForm");
const resultDiv = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");
const btnText = submitBtn.querySelector(".btn-text");
const loader = submitBtn.querySelector(".loader");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const departureTime = document.getElementById("departureTime").value;
  const distanceKm = Number(document.getElementById("distanceKm").value);
  const averageSpeedKmH = Number(
    document.getElementById("averageSpeedKmH").value,
  );

  resultDiv.classList.remove("show");
  resultDiv.classList.add("hidden");
  resultDiv.innerHTML = "";

  submitBtn.classList.add("loading");
  btnText.textContent = "Calculando...";
  loader.classList.remove("hidden");

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

    setTimeout(() => {
      resultDiv.classList.add("show");
    }, 10);
  } catch (error) {
    resultDiv.innerHTML = `<span>${error.message}</span>`;
    resultDiv.classList.remove("hidden");
  } finally {
    submitBtn.classList.remove("loading");
    btnText.textContent = "Calcular rota";
    loader.classList.add("hidden");
  }
});

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light-theme");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-theme");

  const isLight = body.classList.contains("light-theme");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});
