import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaLock, FaEnvelope } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Disable button while logging in
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true); // ✅ Disable button during login attempt

    if (!email || !password) {
      setError("Please enter email and password.");
      setLoading(false);
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      if (res.data.token && res.data.role) {
        localStorage.setItem("token", res.data.token); 
        localStorage.setItem("role", res.data.role);  

        // ✅ Redirect based on user role
        switch (res.data.role) {
          case "admin":
            navigate("/admin-dashboard");  
            break;
          case "agent":
            navigate("/agent-dashboard");  // ✅ Redirect agents
            break;
          default:
            navigate("/dashboard");  // ✅ Redirect regular users
        }
      } else {
        setError("Invalid credentials or server error.");
      }
    } catch (error) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false); // ✅ Re-enable button after login attempt
    }
  };

  return (
    <AuthContainer> 
      <Overlay />
      <Content>
        <Logo>H</Logo>
        <Title>Welcome to Hestia</Title>
        <Form onSubmit={handleLogin}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <InputWrapper>
            <FaEnvelope className="icon" />
            <Input 
              type="email" 
              placeholder="Email..." 
              required 
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <FaLock className="icon" />
            <Input 
              type="password" 
              placeholder="Password..." 
              required 
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Get Started"}
          </Button>
        </Form>
        <SwitchText>
          Don't have an account?
          <SwitchButton onClick={() => navigate("/signup")}>Sign Up</SwitchButton>
        </SwitchText>
      </Content>
    </AuthContainer>
  );
};

export default Login;

// 🎨 Styled Components for Modern UI
const AuthContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: url("/images/hestia-bg.jpg") no-repeat center center/cover;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const Content = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  backdrop-filter: blur(10px);
  width: 350px;
`;

const Logo = styled.div`
  font-size: 40px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: white;
  margin-bottom: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 5px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: white;
  font-size: 16px;
  padding-left: 10px;
  transition: 0.2s ease-in-out;
  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
  }
  &:focus {
    border-bottom: 2px solid #ff5722;
  }
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
  &:disabled {
    background: grey;
    cursor: not-allowed;
  }
`;

const SwitchText = styled.p`
  margin-top: 10px;
  color: white;
`;

const SwitchButton = styled.span`
  color: #ff5722;
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;
