import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup"; 
import Dashboard from "./pages/Dashboard";
import SellerDashboard from "./pages/SellerDashboard";
import SellerForm from "./pages/SellerForm";
import BuyerDashboard from "./pages/BuyerDashboard";
import PropertyForm from "./pages/PropertyForm";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard"; 
import ApproveProperty from "./pages/ApproveProperty"; // ✅ Import ApproveProperty Page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/property-form" element={<PropertyForm />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller-form" element={<SellerForm />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/agent-dashboard" element={<AgentDashboard />} /> 
        <Route path="/approve-property" element={<ApproveProperty />} /> {/* ✅ Added Route for ApproveProperty */}
      </Routes>
    </Router>
  );
};

export default App;
