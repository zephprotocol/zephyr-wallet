import styled from "styled-components";

export const Container = styled.div`
  height: auto;
  width: 100%;
  border-radius: 4px;
  background: ${(props) => props.theme.body.foreground};
  border: 1px solid ${(props) => props.theme.body.border};
`;

export const Strong = styled.div`
  font-family: "Inter-SemiBold";
  color: red;
`;

export const Header = styled.div`
  height: auto;
  padding: 16px 12px;
  border-bottom: 1px solid ${(props) => props.theme.body.border};
`;

export const Footer = styled.div`
  height: auto;
  padding: 16px 12px;
  border: 1px solid ${(props) => props.theme.body.border};
  background: ${(props) => props.theme.body.foreground};
  margin-top: 12px;
  border-radius: 4px;
`;

export const Url = styled.a`
  font-family: Inter-Regular;
  font-size: 13px;
  line-height: 22px;
  color: ${(props) => props.theme.type.primary};
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

export const Information = styled.div`
  font-family: Inter-Regular;
  font-size: 13px;
  line-height: 22px;
  color: ${(props) => props.theme.type.primary};
`;

export const Highlight = styled.div`
  font-family: Inter-Regular;
  font-size: 13px;
  line-height: 22px;
  color: ${(props) => props.theme.type.primary};
`;

export const Link = styled.div`
  font-family: Inter-Regular;
  font-size: 13px;
  line-height: 22px;
  color: ${(props) => props.theme.type.primary};
`;

export const Value = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.type.primary};
`;

export const SubHeader = styled.div`
  display: flex;
  justify-content: center;
  font-family: Inter-Regular;
  margin: 12px;
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
  border: 1px solid ${(props) => (props.priority === 0 ? props.theme.body.border : "none")};

  background: ${(props) => {
    switch (props.priority) {
      case 0:
        return `${props.theme.body.background}`;
      case 1:
        return `${props.theme.button.primary_hover}`;
      case 2:
        return `${props.theme.states.warning}`;
      case 3:
        return `${props.theme.states.error}`;
      default:
    }
  }};
`;
