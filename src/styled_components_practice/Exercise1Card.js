import styled from "styled-components";

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
`;

export default function Exercise1Card() {
  return (
    <Card>
      <h2>Patient Card</h2>
      <p>This is a styled card component.</p>
    </Card>
  );
}