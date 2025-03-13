import { useState } from "react";
import styled from "styled-components"; // ✅ Correct import
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signing up:", { firstName, lastName, email, password });
    navigate("/dashboard"); // Redirect after signup
  };

  return (
    <AuthContainer>
      <Overlay />
      <Content>
        <Logo>H</Logo>
        <Title>Create Account</Title>
        <Form onSubmit={handleSignup}>
          <InputWrapper>
            <FaUser className="icon" />
            <Input type="text" placeholder="First Name..." required onChange={(e) => setFirstName(e.target.value)} />
          </InputWrapper>
          <InputWrapper>
            <FaUser className="icon" />
            <Input type="text" placeholder="Last Name..." required onChange={(e) => setLastName(e.target.value)} />
          </InputWrapper>
          <InputWrapper>
            <FaEnvelope className="icon" />
            <Input type="email" placeholder="Email..." required onChange={(e) => setEmail(e.target.value)} />
          </InputWrapper>
          <InputWrapper>
            <FaLock className="icon" />
            <Input type="password" placeholder="Password..." required onChange={(e) => setPassword(e.target.value)} />
          </InputWrapper>
          <Button type="submit">Sign Up</Button>
        </Form>
        <SwitchText>
          Already have an account?
          <SwitchButton onClick={() => navigate("/")}>Login</SwitchButton>
        </SwitchText>
      </Content>
    </AuthContainer>
  );
};

export default Signup;

// Styled Components
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
  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
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