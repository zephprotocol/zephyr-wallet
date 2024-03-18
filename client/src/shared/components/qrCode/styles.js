import styled from "styled-components";
import media from "../../../assets/styles/media.js";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20;
`;

export const Wrapper = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 12px;
`;

export const Inner = styled.div`
  margin-top: 20px;
  width: 100%;
  background: ${(props) => props.theme.body.foreground};
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.body.border};
`;

export const Value = styled.div`
  margin: 20px;
  font-size: 14px
  border-radius: 12px;
  color: ${(props) => props.theme.type.primary};
  overflow-wrap: break-word;
  text-align: center;
  font-family: Inter-Regular;

  ${media.mobile`
    font-size: 12px;
  `};
`;
