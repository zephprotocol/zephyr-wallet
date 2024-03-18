import styled from "styled-components";
import { NavLink } from "react-router-dom";
import media from "../../../../../../assets/styles/media.js";
import { background } from "../../../../../../assets/styles/colors.js";

export const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.body.background};

  ${media.mobile`
    padding-top: 70px;
  `}
`;

export const Image = styled.img`
  height: auto;
  width: auto;
  z-index: 500;
  position: absolute;
  margin-left: -500px;

  ${media.laptop`
    margin-left: -500px;
 `};

  ${media.tablet`
   margin-left: -200px;

 `};

  ${media.mobile`
   margin-left: -100px;
 `};
`;

export const Heading = styled.div`
  font-size: 48px;
  color: white;
  line-height: 58px;
  text-align: center;
  font-weight: 700;
`;

export const Description = styled.div`
  font-size: 16px;
  color: #8a8d90;
  letter-spacing: 0;
  line-height: 28px;
  margin-top: 12px;
  margin-bottom: 24px;
  text-align: center;
`;

export const Button = styled(NavLink)`
  background: #7289da;
  border-radius: 12px;
  font-size: 16px;
  line-height: 36px;
  height: 56px;
  width: 196px;
  color: white;
  border: none;
  margin: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  animation-duration: 5s;

  &:hover {
    background: #5b6eae;
    cursor: pointer;
    animation-duration: 4s;
  }
`;

export const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
