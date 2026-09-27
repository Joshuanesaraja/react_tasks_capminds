import styled, { ThemeProvider } from "styled-components";

const theme = {
    colors: {
        primary: "blue",
        secondary: "green",
        danger: "red",
        background: "#f5f5f5",
        text: "#333",
    },

    spacing: {
        small: "8px",
        medium: "16px",
        large: "24px",
    },
};

const Container = styled.div`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.large};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.medium};
`;

export default function Theming() {
    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Title>Hello Theme</Title>
                <Button>Click Me</Button>
            </Container>
        </ThemeProvider>
    );
}