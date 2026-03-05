import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import FAB from "./components/FAB/FAB";
import "./App.css"; // Ensure global styles are loaded

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <div className="main-content">
          <AppRoutes />
        </div>
        <FAB />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
