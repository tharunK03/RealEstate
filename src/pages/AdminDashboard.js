import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css"; // Import CSS file

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/properties/pending", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.length === 0) {
          setError("No pending properties found.");
        } else {
          setProperties(res.data);
        }
      } catch (err) {
        setError("Failed to load properties.");
        console.error("❌ Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const approveProperty = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/api/properties/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Property approved and moved to agent verification.");
      setProperties(properties.filter((property) => property._id !== id));
    } catch (err) {
      alert("❌ Approval failed.");
      console.error("Approval error:", err);
    }
  };

  const rejectProperty = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/properties/reject/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("🚫 Property rejected.");
      setProperties(properties.filter((property) => property._id !== id));
    } catch (err) {
      alert("❌ Rejection failed.");
      console.error("Rejection error:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard - Pending Properties</h2>

      {loading && <p className="loading">Loading properties...</p>}

      {error && <p className="error">{error}</p>}

      {properties.length === 0 && !loading ? (
        <div className="no-properties">
          <h3>No properties available for approval.</h3>
          <p>All properties have been reviewed.</p>
        </div>
      ) : (
        <div className="property-list">
          {properties.map((property) => (
            <div key={property._id} className="property-card">
              <h3>{property.title}</h3>
              <p><strong>Price:</strong> ₹{property.price}</p>
              <p><strong>Location:</strong> {property.location?.address}</p>
              <p><strong>Type:</strong> {property.propertyType}</p>
              <p><strong>Size:</strong> {property.areaSize} sqft</p>

              {/* Display property images */}
              <div className="property-images">
                {property.images && property.images.length > 0 ? (
                  property.images.map((img, index) => (
                    <img 
                      key={index} 
                      src={`http://localhost:8080/${img}`} 
                      alt="Property" 
                      className="property-image"
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>

              <div className="property-actions">
                <button className="approve-btn" onClick={() => approveProperty(property._id)}>Approve</button>
                <button className="reject-btn" onClick={() => rejectProperty(property._id)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
