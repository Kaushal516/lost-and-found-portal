import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const DashboardCharts = ({ stats }) => {
  const data = {
    labels: ["Lost", "Found", "Active", "Claimed"],
    datasets: [
      {
        label: "Items Count",
        data: [
          stats.totalLost,
          stats.totalFound,
          stats.activeFound,
          stats.claimedFound
        ],
        backgroundColor: "#4f46e5"
      }
    ]
  };

  return <Bar data={data} />;
};

export default DashboardCharts;
