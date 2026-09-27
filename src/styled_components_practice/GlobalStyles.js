// // Global styles -> CSS that applies to the entire application.
// // *********************************

import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    background: #f5f5f5;
    color: #333;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default function App() {
    return (
        <>
            <GlobalStyles />
            <h1>Hello World</h1>
        </>
    );
}