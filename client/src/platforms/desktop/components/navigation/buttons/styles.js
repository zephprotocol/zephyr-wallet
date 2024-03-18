import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  background: pink;
  width: auto;
  height: auto;
`;

export const Auth = styled(Link)`
  background: ${(props) => props.theme.button.primary};
  border: none;
  margin-right: 16px;
  color: #fff;
  font-size: 14px;
  border-radius: 12px;
  text-decoration: none;
  height: 42px;
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: 500ms;

  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.button.primary_hover};
    transition: 500ms;
  }
`;

export const Logout = styled.div`
  background: none;
  border: 1px solid ${(props) => props.theme.body.border};
  margin-right: 16px;
  color: ${(props) => props.theme.type.primary};
  font-size: 14px;
  border-radius: 12px;
  text-decoration: none;
  height: 42px;
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: 500ms;

  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.button.primary_hover};
    transition: 500ms;
  }
`;
