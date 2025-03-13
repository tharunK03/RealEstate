import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; // Import CSS styles

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if not logged in
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h2>Welcome to the Dashboard</h2>
      <p>Select your role to continue.</p>
      <div className="role-selection">
        {/* ✅ Ensure Seller button redirects to the Seller Form */}
        <button className="role-btn seller" onClick={() => navigate("/seller-form")}>Seller</button>
        <button className="role-btn buyer" onClick={() => navigate("/buyer")}>Buyer</button>
        <button className="role-btn renter" onClick={() => navigate("/renter")}>Renter</button>
      </div>
    </div>
  );
};

export default Dashboard;