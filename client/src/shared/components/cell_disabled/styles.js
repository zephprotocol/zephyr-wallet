import styled from "styled-components";
import media from "../../../assets/styles/media.js";
import { ReactComponent as ChevronIcon } from "../../../assets/icons/chevron.svg";

export const Container = styled.div`
  background: ${(props) => props.theme.body.foreground};
  border: 1px solid ${(props) => props.theme.body.border};
  padding: 20px;
  border-radius: 12px;
  text-decoration: none;
  transition: 500ms;
  grid-column: ${(props) => (props.fullwidth ? "1 / 3" : null)}
  display: flex;
  justify-content: space-between;


  ${media.laptop`
    grid-column: 1 / 3;
  `}

  ${media.mobile`
    grid-column: 1 / 3;
  `}

  &:hover {
    cursor: not-allowed;
    background: ${(props) => props.theme.body.foreground};
    border: 1px solid ${(props) => props.theme.body.border};
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    transition: 500ms;
`;

export const Arrow = styled(ChevronIcon)`
  margin-left: 8px;

  .bg {
    fill: ${(props) => props.theme.type.secondary};
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Balance = styled.div`
  font-family: Inter-Bold;
  font-size: 17px;
  color: ${(props) => props.theme.type.secondary};
  letter-spacing: 0;
  line-height: 30px;
`;

export const Ticker = styled.div`
  font-family: Inter-Regular;
  font-size: 17px;
  color: ${(props) => props.theme.type.secondary};
  letter-spacing: 0;
  line-height: 30px;
  padding-left: 8px;

  ${media.mobile`
    padding-left: 0px;
    font-family: Inter-Bold;
  `}
`;

export const Inner = styled.div`
  height: auto;
  width: 16px;
  display: flex;
  align-items: center;
  margin-left: 16px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Icon = styled.img`
  height: 16px;
  width: 16px;
`;

export const Wrapper = styled.div`
  display: flex;
`;

export const Title = styled.div`
  font-family: Inter-Bold;
  font-size: 17px;
  color: ${(props) => props.theme.type.secondary};
  letter-spacing: 0;
  line-height: 30px;
  text-align: ${(props) => (props.left ? "left" : "right")};
`;

export const Subtitle = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.type.secondary};
  letter-spacing: 0;
  line-height: 24px;
  text-align: ${(props) => (props.left ? "left" : "right")};
`;
