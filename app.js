const apiKey = "0843TYFZIM2RUMPE";
const apiUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${apiKey}`;

let chart;
let chartData = [];
let updateInterval;

async function fetchData() {
  try {
    let response = await fetch(apiUrl);
    let data = await response.json();

    if (data["Realtime Currency Exchange Rate"]) {
      let price = parseFloat(
        data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
      );
      return price;
    } else {
      throw new Error("API error: " + JSON.stringify(data));
    }
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("current-price").innerText = "⚠️ Error loading data";
    return null;
  }
}

function updateChart(price) {
  const now = new Date().toLocaleTimeString();

  chartData.push({ time: now, price: price });

  chart.data.labels.push(now);
  chart.data.datasets[0].data.push(price);

  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
    chartData.shift();
  }

  chart.update();

  document.getElementById("data-points").innerText = chartData.length;
  document.getElementById("min-price").innerText = Math.min(
    ...chartData.map((d) => d.price)
  ).toFixed(2);
  document.getElementById("max-price").innerText = Math.max(
    ...chartData.map((d) => d.price)
  ).toFixed(2);
  document.getElementById("last-update").innerText = now;
  document.getElementById("current-price").innerText = `💰 BTC/USD: $${price.toFixed(2)}`;
}

async function startRealtime() {
  document.getElementById("current-price").innerText = "⏳ Loading...";

  const ctx = document.getElementById("realtime-chart").getContext("2d");
  if (!chart) {
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "BTC/USD",
            data: [],
            borderColor: "#00bfff",
            backgroundColor: "rgba(0,191,255,0.2)",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    });
  }

  let price = await fetchData();
  if (price) updateChart(price);

  updateInterval = setInterval(async () => {
    let price = await fetchData();
    if (price) updateChart(price);
  }, 20000);
}

function stopRealtime() {
  clearInterval(updateInterval);
}

function resetChart() {
  if (chart) {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();
  }
  chartData = [];
  document.getElementById("data-points").innerText = 0;
  document.getElementById("min-price").innerText = "-";
  document.getElementById("max-price").innerText = "-";
  document.getElementById("last-update").innerText = "-";
  document.getElementById("current-price").innerText = "Loading harga BTC...";
}

document.getElementById("start-btn").addEventListener("click", startRealtime);
document.getElementById("stop-btn").addEventListener("click", stopRealtime);
document.getElementById("reset-btn").addEventListener("click", resetChart);
