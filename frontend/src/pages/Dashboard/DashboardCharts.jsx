import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { PieChart } from "lucide-react"; // This import is no longer needed for the new logic

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const DashboardCharts = ({ stats, type = "pie" }) => {
  // const total = stats.totalLost + stats.totalFound + stats.foundInProcess + stats.foundResolved; // This total is specific to the old Doughnut chart

  if (type === "pie") {
    const data = {
      labels: ["Lost", "Found"],
      datasets: [
        {
          data: [stats.totalLost, stats.totalFound],
          backgroundColor: ["#ff5f6d", "#4facfe"],
          borderColor: "white",
          borderWidth: 2,
          hoverOffset: 10,
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
        datalabels: { display: false }
      },
      cutout: "60%"
    };

    return (
      <div style={{ height: "180px", width: "100%", display: "flex", justifyContent: "center" }}>
        <Doughnut data={data} options={options} />
      </div>
    );
  }

  if (type === "bar") {
    const data = {
      labels: ["Status"],
      datasets: [
        {
          label: "Active",
          data: [stats.lostActive + (stats.totalFound - stats.foundInProcess - stats.foundResolved)],
          backgroundColor: "#ffb347",
        },
        {
          label: "In Process",
          data: [stats.foundInProcess],
          backgroundColor: "#ffcc33",
        },
        {
          label: "Resolved",
          data: [stats.lostResolved + stats.foundResolved],
          backgroundColor: "#b2fefa",
        }
      ]
    };

    const options = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
        datalabels: { display: false }
      },
      scales: {
        x: { stacked: true, display: false },
        y: { stacked: true, display: false }
      },
      borderRadius: 10
    };

    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ height: "40px" }}>
          <Bar data={data} options={options} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {data.datasets.map(ds => (
            <div key={ds.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--gray-500)" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: ds.backgroundColor }}></div>
              <span>{ds.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Original Doughnut chart logic (if type is not specified or is 'default')
  // This part is removed as per the instruction to handle 'pie' and 'bar' types.
  // If the original chart is still needed, it should be wrapped in another 'else if' or 'default' case.
  // For now, if type is neither 'pie' nor 'bar', it returns null.

  return null;
};

export default DashboardCharts;
