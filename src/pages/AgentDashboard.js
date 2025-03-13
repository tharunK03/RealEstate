import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi"; // Icons for Approve/Reject
import styled from "styled-components";

const AgentDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "agent") {
      alert("Unauthorized access! Redirecting to login.");
      navigate("/");
    } else {
      fetchPendingProperties();
    }
  }, [navigate]);

  // ✅ Fetch pending properties for agent
  const fetchPendingProperties = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/agent/pending-properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      alert("Failed to fetch properties. Try again.");
    }
  };
  

  // ✅ Approve property
  const approveProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to approve this property?")) return;

    try {
      await axios.put(`http://localhost:8080/api/agent/approve/${propertyId}`);
      alert("✅ Property approved successfully!");
      fetchPendingProperties();
    } catch (error) {
      console.error("Error approving property:", error);
      alert("❌ Approval failed. Try again.");
    }
  };

  // ✅ Reject property
  const rejectProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to reject this property?")) return;

    try {
      await axios.put(`http://localhost:8080/api/agent/reject/${propertyId}`);
      alert("❌ Property rejected successfully!");
      fetchPendingProperties();
    } catch (error) {
      console.error("Error rejecting property:", error);
      alert("❌ Rejection failed. Try again.");
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <Container>
      <Header>
        <h1>Agent Dashboard</h1>
        <LogoutButton onClick={handleLogout}>🚪 Logout</LogoutButton>
      </Header>

      <SearchBar>
        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      <TableContainer>
        <table>
          <thead>
            <tr>
              <th>Property ID</th>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.length > 0 ? (
              properties
                .filter((property) =>
                  property.title.toLowerCase().includes(search.toLowerCase()) ||
                  property.location.toLowerCase().includes(search.toLowerCase())
                )
                .map((property) => (
                  <tr key={property._id}>
                    <td>{property._id}</td>
                    <td>{property.title}</td>
                    <td>{property.location}</td>
                    <td>${property.price.toLocaleString()}</td>
                    <td>
                      <ActionButton approve onClick={() => approveProperty(property._id)}>
                        <FiCheckCircle /> Approve
                      </ActionButton>
                      <ActionButton reject onClick={() => rejectProperty(property._id)}>
                        <FiXCircle /> Reject
                      </ActionButton>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5">No pending properties.</td>
              </tr>
            )}
          </tbody>
        </table>
      </TableContainer>
    </Container>
  );
};

export default AgentDashboard;

// ✅ Styled Components for Modern UI
const Container = styled.div`
  width: 90%;
  margin: auto;
  padding: 20px;
  background: #f8f9fa;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  h1 {
    font-size: 26px;
    font-weight: bold;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 15px;
  background: #ff4b5c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    background: #e63e4e;
  }
`;

const SearchBar = styled.div`
  width: 100%;
  padding: 10px 0;
  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
`;

const TableContainer = styled.div`
  margin-top: 20px;
  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }
  th, td {
    padding: 12px;
    text-align: left;
  }
  th {
    background: #007bff;
    color: white;
  }
  tr:nth-child(even) {
    background: #f2f2f2;
  }
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  ${(props) =>
    props.approve
      ? `
    background: #28a745;
    color: white;
    &:hover { background: #218838; }
  `
      : `
    background: #dc3545;
    color: white;
    &:hover { background: #c82333; }
  `}
`;
