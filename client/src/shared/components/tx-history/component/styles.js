import styled from "styled-components";
import media from "../../../../assets/styles/media.js";

export const Container = styled.a`
  height: auto;
  display: grid;
  width: auto;
  grid-template-columns: 16px 1fr;
  margin-bottom: 20px;
  text-decoration: none;
  border-radius: 12px;
  background: ${(props) => props.theme.body.foreground};
  border: 1px solid ${(props) => props.theme.body.border};

  &:hover {
    cursor: pointer;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    transition: 500ms;
  }
`;

export const ShortRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const Row = styled.div`
  height: auto;
  padding: 12px 20px;
  display: flex;
  width: auto;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: ${(props) => (props.margin ? "-16px" : "0px")};
`;

export const Cell = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  background: ${(props) => props.theme.body.background};
  border: 1px solid ${(props) => props.theme.body.border};
  border-radius: 0px 4px 4px 0x;
  padding: 16px;
  border-right: none;
`;

export const State = styled.div`
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  color: #fff;
  justify-content: center;
  border-right: 1px solid ${(props) => props.theme.body.border};
  border-radius: 12px 0px 0px 4px;
  border-right: none;
  background: ${(props) => {
    switch (props.status) {
      case "Failed":
        return `${props.theme.states.error}`;
      case "Mined":
        return `${props.theme.states.error}`;
      case "Received":
        return `${props.theme.states.success}`;
      case "Sent":
        return `${props.theme.states.default}`;
      case "Exchange":
        return `${props.theme.states.alert}`;
      case "Pending":
        return `${props.theme.states.warning}`;
      default:
    }
  }};
`;

export const Status = styled.div`
  transform: rotate(-90deg);
  font-family: Inter-SemiBold;
  font-size: 10px;
  letter-spacing: 0;
  text-align: center;
  line-height: 16px;
  text-transform: uppercase;
`;

export const Data = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 12px;
`;

export const Value = styled.div`
  font-family: Inter-SemiBold;
  font-size: 14px;
  color: ${(props) => props.theme.type.primary};
  letter-spacing: 0;
  line-height: 24px;
  text-align: ${(props) => props.alignment};
  text-transform: capitalize;
`;

export const Label = styled.div`
  font-family: Inter-Regular;
  font-size: 12px;

  color: ${(props) => props.theme.type.secondary};
  line-height: 12px;
  text-align: ${(props) => props.alignment};
  text-transform: capitalize;
  flex-grow: column;
`;

export const Strapline = styled.span`
  color: ${(props) => props.theme.type.primary};
  font-size: 10px;
  text-transform: none;
  line-height: 1.3em;
  min-width: 10em;
  ${media.mobile`
    display: block;
  `};
`;
