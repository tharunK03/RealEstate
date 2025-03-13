import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components"; // ✅ Ensure correct import

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer"); // ✅ Default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        name, 
        email, 
        password, 
        role, // ✅ Role is now sent correctly
      });

      if (res.status === 201) {
        alert("✅ Registration Successful! Please login.");
        navigate("/");
      } else {
        setError("Signup failed. Try again.");
      }
    } catch (error) {
      setError("⚠️ Email already exists or server error.");
    }
  };

  return (
    <AuthContainer>
      <SignupBox>
        <h2>Signup</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSignup}>
          <Input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          
          {/* ✅ Role Dropdown with Agent Option */}
          <Select required value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="agent">Agent</option>  {/* ✅ Agent Added */}
            <option value="admin">Admin</option>
          </Select>

          <Button type="submit">Signup</Button>
        </Form>
        <p>Already have an account? <a href="/">Login</a></p>
      </SignupBox>
    </AuthContainer>
  );
};

export default Signup;

// 🎨 Styled Components
const AuthContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("/images/city-bg.png") no-repeat center center/cover;
  background-size: cover;
`;

const SignupBox = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  backdrop-filter: blur(10px);
  width: 350px;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  outline: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  outline: none;
  cursor: pointer;
`;

const Button = styled.button`
  background: #ff5722;
  color: white;
  font-size: 18px;
  padding: 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    background: #e64a19;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;
