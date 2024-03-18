import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  height: auto;
  min-height: 550px;
  max-width: 624px;
  min-width: 420px;
  flex-direction: column;
  margin: 20px;
  border: 1px solid ${(props) => props.theme.body.border};
  border-radius: 12px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.05);
`;

export const Wrapper = styled.div`
  height: 100%;
`;

export const Main = styled.div`
  background: ${(props) => props.theme.body.foreground};
  min-height: 350px;
  padding: 10px;
`;

export const Body = styled.div`
  min-height: 266px;
  margin: 10px;
`;

export const Tabs = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
`;

export const Tab = styled.div`
  width: calc(100% / 2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.active ? props.theme.button.primary_label : props.theme.type.secondary)};
  background: ${(props) => (props.active ? props.theme.button.primary : props.theme.body.background)};
  border-top: none;
  transition: 500ms;

  &:hover {
    cursor: pointer;
    transition: 500ms;
    color: ${(props) => props.theme.type.primary};
  }
`;

export const Header = styled.div`
  padding: 20px;
  border-radius: 12px 12px 0px 0px;
  background: ${(props) => props.theme.body.foreground};
  border-bottom: 1px solid ${(props) => props.theme.body.border};
`;

export const Title = styled.div`
  font-family: Inter-SemiBold;
  font-size: 20px;
  color: ${(props) => props.theme.type.primary};
  letter-spacing: 0;
  line-height: 30px;
`;

export const Description = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.type.secondary};
  line-height: 24px;
`;

export const Step = styled.div`
  width: ${(props) =>
    (props.width === 1 ? "10%" : null) || (props.width === 2 ? "50%" : null) || (props.width === 3 ? "100%" : null)};
  background: #7289da;
  height: auto;
  border-radius: 12px;
`;

export const Button = styled(Link)`
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

export const Footer = styled.div`
  height: 60px;
  border-top: 1px solid ${(props) => props.theme.body.border};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: ${(props) => props.theme.body.foreground};
  border-radius: 0px 0px 12px 12px;
`;

export const Route = styled(Link)`
  font-family: Inter-SemiBold;
  font-size: 14px;
  color: ${(props) => props.theme.type.primary};
  text-decoration: none;
  margin-left: 8px;
`;

export const Label = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.type.secondary};
  text-decoration: none;
`;
