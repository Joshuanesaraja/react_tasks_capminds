// import styled from "styled-components";

// // Create a styled component
// // *********************************
// const Button = styled.button`
//   background: blue;
//   color: white;
//   padding: 10px 18px;
//   border: none;
//   cursor: pointer;

// //   Pseudo-classes & States
//   &:hover {
//     background: darkblue;
//   }

//   &:active {
//     transform: scale(0.98);
//   }

//   &:disabled {
//     background: gray;
//     cursor: not-allowed;
//   }
// `;

// export default function BasicUsage() {
//   return (
//     <>
//       <Button>Click Me</Button>

//       <Button disabled>
//         Disabled
//       </Button>
//     </>
//   );
// }


// // Dynamic Styling with Props
// // *********************************

// import styled from "styled-components";

// const Button = styled.button`
//   background: ${props => {
//         if (props.primary) return "blue";
//         if (props.danger) return "red";
//         return "gray";
//     }};

//   color: white;

//   padding: ${props =>
//         props.large ? "15px 30px" : "10px 18px"};

//   font-size: ${props =>
//         props.large ? "18px" : "14px"};

//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
// `;

// export default function BasicUsage() {
//     return (
//         <>
//             <Button primary large>
//                 Large Primary
//             </Button>

//             <Button danger>
//                 Danger
//             </Button>

//             <Button>
//                 Default
//             </Button>
//         </>
//     );
// }

// //Styled Divs and Layout Components
// // *********************************

// import styled from "styled-components";

// const Container = styled.div`
//   width: 100%;
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 20px;
// `;

// const FlexContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   gap: 20px;
// `;

// const Card = styled.div`
//   background: white;
//   border-radius: 12px;
//   padding: 20px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

//   &:hover {
//     box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
//   }
// `;

// export default function BasicUsage() {
//     return (
//         <Container>
//             <FlexContainer>
//                 <Card>
//                     <h2>Patient Card</h2>
//                     <p>This is a styled card.</p>
//                 </Card>

//                 <Card>
//                     <h2>Doctor Card</h2>
//                     <p>This is another styled card.</p>
//                 </Card>
//             </FlexContainer>
//         </Container>
//     );
// }

