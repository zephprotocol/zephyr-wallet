import styled from "styled-components";

export const Container = styled.div`
  height: auto;
  width: 100%;
  background: pink;
  border-radius: 12px;
  background: ${(props) => props.theme.body.foreground};
  border: 1px solid ${(props) => props.theme.body.border};
  margin-bottom: 12px;
`;

export const Url = styled.a`
  text-decoration: none;
  font-family: Inter-Regular;
  font-size: 13px;
  line-height: 22px;
  color: ${(props) => props.theme.type.secondary};
`;

export const Header = styled.div`
  height: auto;
  padding: 16px 12px;
  border-bottom: 1px solid ${(props) => props.theme.body.border};
`;
export const Footer = styled.div`
  height: auto;
  padding: 16px 12px;
  margin-top: 12px;
  border-radius: 12px;
  border-top: 1px solid ${(props) => props.theme.body.border};
  background: ${(props) => props.theme.body.foreground};
  border: 1px solid ${(props) => props.theme.body.border};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  height: auto;
  margin: 12px;
`;

export const Key = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.type.secondary};
`;

export const Value = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.type.primary};
`;

export const Tag = styled.div`
  width: auto;
  height: 22px;
  font-size: 10px;
  color: ${(props) => props.theme.type.primary};
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 2px;
  border: 1px solid ${(props) => props.theme.body.border};
  background: ${(props) => props.theme.body.background};
`;
