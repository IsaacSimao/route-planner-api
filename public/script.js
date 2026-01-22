/* ==============================
   ELEMENTOS
============================== */
const form = document.getElementById("routeForm");
const resultDiv = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");
const loader = document.querySelector(".loader");
const btnText = document.querySelector(".btn-text");

const originInput = document.getElementById("origin");
const destinationInput = document.getElementById("destination");
const originSuggestions = document.getElementById("originSuggestions");
const destinationSuggestions = document.getElementById(
  "destinationSuggestions",
);

const body = document.body;
const themeToggle = document.getElementById("themeToggle");

/* ==============================
   THEME (DARK / LIGHT)
============================== */
const savedTheme = localStorage.getItem("theme") || "dark";
body.classList.toggle("light-theme", savedTheme === "light");
themeToggle.textContent = savedTheme === "light" ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  const isLight = body.classList.contains("light-theme");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

/* ==============================
   FORM SUBMIT
============================== */
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const origin = originInput.value.trim();
  const destination = destinationInput.value.trim();
  const transport = document.getElementById("transport").value;

  if (!origin || !destination) {
    showError("Preencha origem e destino.");
    return;
  }

  // UI: loading
  submitBtn.classList.add("loading");
  loader.classList.remove("hidden");
  btnText.textContent = "Calculando...";
  resultDiv.classList.add("hidden");
  resultDiv.classList.remove("show");
  resultDiv.innerHTML = "";

  try {
    const response = await fetch("/api/routes/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination, transport }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao calcular rota");
    }

    showResult(data);
  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.classList.remove("loading");
    loader.classList.add("hidden");
    btnText.textContent = "Calcular rota";
  }
});

/* ==============================
   AUTOCOMPLETE
============================== */
let debounceTimer;

async function searchAddress(query) {
  if (query.length < 3) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
  const response = await fetch(url, {
    headers: { "User-Agent": "route-planner-app" },
  });
  return response.json();
}

function renderSuggestions(list, container, input) {
  container.innerHTML = "";
  list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.display_name;
    li.addEventListener("click", () => {
      input.value = item.display_name;
      container.innerHTML = "";
    });
    container.appendChild(li);
  });
}

originInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const results = await searchAddress(originInput.value);
    renderSuggestions(results, originSuggestions, originInput);
  }, 400);
});

destinationInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const results = await searchAddress(destinationInput.value);
    renderSuggestions(results, destinationSuggestions, destinationInput);
  }, 400);
});

/* ==============================
   RESULT / ERROR HANDLING
============================== */
function showResult(data) {
  const departure = new Date(data.departureTime);
  const arrival = new Date(data.estimatedArrival);

  resultDiv.innerHTML = `
    <strong>🚀 Rota calculada</strong><br><br>
    <b>Origem:</b><br>${data.origin}<br><br>
    <b>Destino:</b><br>${data.destination}<br><br>
    <b>Transporte:</b> ${formatTransport(data.transport)}<br>
    <b>Distância:</b> ${data.distanceKm} km<br>
    <b>Duração:</b> ${data.durationMin} min<br>
    <b>Saída:</b> ${departure.toLocaleTimeString()}<br>
    <b>Chegada estimada:</b> ${arrival.toLocaleTimeString()}
  `;

  resultDiv.classList.remove("hidden");
  setTimeout(() => resultDiv.classList.add("show"), 10);
}

function showError(message) {
  resultDiv.innerHTML = `
    <strong>❌ Erro</strong><br><br>
    <span>${message}</span>
  `;
  resultDiv.classList.remove("hidden");
  setTimeout(() => resultDiv.classList.add("show"), 10);
}

function formatTransport(type) {
  const map = { car: "🚗 Carro", bike: "🚲 Bicicleta", walk: "🚶 A pé" };
  return map[type] || type;
}
