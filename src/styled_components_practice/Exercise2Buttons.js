import styled from "styled-components";

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  background: ${props => {
    if (props.primary) return "#007bff";
    if (props.secondary) return "#6c757d";
    return "#e0e0e0";
  }};

  color: ${props =>
    props.primary || props.secondary ? "white" : "#333"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

export default function Exercise2Buttons() {
  return (
    <div>
      <Button primary>Primary</Button>
      <Button secondary>Secondary</Button>
      <Button>Default</Button>
    </div>
  );
}