import styled from "styled-components";
import { keyframes } from "styled-components";

const scale = keyframes`
  0% { -webkit-transform: scale(1); }
  50% { -webkit-transform: scale(.7); }
  100% { -webkit-transform: scale(1); }
`;

// Here we create a component that will rotate everything we pass in over two seconds
export const Rotate = styled.div`
  display: inline-block;
  animation: ${scale} 1s ease infinite;
  padding: 2rem 1rem;
  font-size: 0.1rem;
`;

const rotate360 = keyframes`
  0% { -webkit-transform: rotate(0deg); }
  25% { -webkit-transform: rotate(90deg); }
  50% { -webkit-transform: rotate(180deg); }
  75% { -webkit-transform: rotate(270deg); }
  100% { -webkit-transform: rotate(360deg); }
`;

export const Circle = styled.span`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid ${(props) => props.color};
  border-right: 2px solid ${(props) => props.color};
  border-bottom: 2px solid ${(props) => props.color};
  border-left: 2px solid transparent;
  background: transparent;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: ${(props) => props.theme.button.primary_label};
`;
