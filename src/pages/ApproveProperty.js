import { useEffect, useState } from "react";
import axios from "axios";

const ApproveProperty = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchPropertiesForApproval();
  }, []);

  const fetchPropertiesForApproval = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/agent/agent-verification");
      console.log("📢 Agent Pending Properties:", response.data); // ✅ Debugging Log
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  return (
    <div>
      <h1>Approve Properties</h1>
      {properties.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Property ID</th>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property._id}>
                <td>{property._id}</td>
                <td>{property.title}</td>
                <td>{property.location.address}</td>
                <td>${property.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No properties pending approval.</p>
      )}
    </div>
  );
};

export default ApproveProperty;