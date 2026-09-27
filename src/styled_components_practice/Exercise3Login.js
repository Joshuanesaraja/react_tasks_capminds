import styled from "styled-components";

const FormContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

export default function Exercise3Login() {
  return (
    <FormContainer>
      <Title>Login</Title>

      <Input type="email" placeholder="Email" />

      <Input type="password" placeholder="Password" />

      <SubmitButton>Sign In</SubmitButton>
    </FormContainer>
  );
}