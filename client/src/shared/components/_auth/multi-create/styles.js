import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  height: auto;
  width: 624px;
  flex-direction: column;
  margin: 20px;
  border: 1px solid #3a4048;
  border-radius: 12px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.05);
`;

export const Main = styled.div`
  border-radius: 12px 12px 0px 0px;
  height: auto;
  padding: 10px;
`;

export const Progress = styled.div`
  display: grid;
  background: #2b2e34;
  height: 4px;
  width: 100%;
  margin-bottom: 16px;
`;

export const Body = styled.div`
  min-height: 266px;
  height: auto;
  width: auto;
  margin: 10px;
`;

export const Buttons = styled.div`
  height: auto;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Submit = styled.button`
  background: #7289da;
  border-radius: 12px;
  font-family: Inter-Regular;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  line-height: 24px;
  width: 106px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 500ms;
  border: none;
  outline: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    cursor: pointer;
    transition: 500ms;
    background: #5b6eae;
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
`;

export const Back = styled.div`
  background: #36393f;
  border-radius: 12px;
  font-family: Inter-Regular;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  line-height: 24px;
  width: 106px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #3a4048;
  text-decoration: none;
  transition: 500ms;

  &:hover {
    cursor: pointer;
    background: #27292;
    transition: 500ms;
  }
`;

export const Cancel = styled(Link)`
  background: #36393f;
  border-radius: 12px;
  font-family: Inter-Regular;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  line-height: 24px;
  width: 106px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #3a4048;
  text-decoration: none;
  transition: 500ms;

  &:hover {
    cursor: pointer;
    background: #27292;
    transition: 500ms;
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
  color: #fff;
  text-decoration: none;
  margin-left: 8px;
`;

export const Label = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: #8a8d90;
  text-decoration: none;
`;
