import { ThemeProvider } from "styled-components";
import { useState } from "react";
import styled from "styled-components";

const lightTheme = {
    background: "#ffffff",
    text: "#000000",
    primary: "blue",
};

const darkTheme = {
    background: "#1a1a1a",
    text: "#ffffff",
    primary: "lightblue",
};

const Container = styled.div`
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: 100vh;
  padding: 20px;
`;

const ToggleButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    return (
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
            <Container>
                <h1>Theme Toggle Example</h1>

                <ToggleButton onClick={() => setIsDark(!isDark)}>
                    Switch to {isDark ? "Light" : "Dark"} Mode
                </ToggleButton>
            </Container>
        </ThemeProvider>
    );
}