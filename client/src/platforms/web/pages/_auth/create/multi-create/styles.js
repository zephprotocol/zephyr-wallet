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
    padding-top: 50px;
  `}
`;

export const SubContainer = styled.div`
  height: auto;
  width: 624px;
  flex-direction: column;
  margin: 20px;
  border: 1px solid ${(props) => props.theme.body.border};
  border-radius: 12px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.body.foreground};

  ${media.laptop`
    animation: none;
  `};
`;

export const Header = styled.div`
  height: auto;
  width: auto;
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.body.border};
`;

export const Tabs = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  font-family: Inter-Regular;
`;

export const Tab = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;

  color: ${(props) => (props.active ? props.theme.button.primary_label : props.theme.type.secondary)};
  background: ${(props) => (props.active ? props.theme.button.primary : props.theme.body.background)};

  &:hover {
    cursor: pointer;
    transition: 500ms;
    color: ${(props) => props.theme.type.primary};
  }
`;

export const Title = styled.div`
  font-family: Inter-SemiBold;
  font-size: 20px;
  color: #fff;
  letter-spacing: 0;
  line-height: 30px;
`;

export const SubDescription = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: #8a8d90;
  line-height: 24px;
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
