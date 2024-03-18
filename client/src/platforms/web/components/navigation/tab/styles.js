import styled from "styled-components";

export const Container = styled.div`
  height: 32px;
  font-size: 13px;
  display: flex;
  margin: 8px;
`;

export const Tabs = styled.div`
  border: 1px solid ${(props) => props.theme.body.border};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 12px;
  overflow: clip;
`;

export const Item = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Inter-Regular;

  color: ${(props) => (props.active ? props.theme.button.primary_label : props.theme.type.secondary)};

  background: ${(props) => (props.active ? props.theme.button.primary : props.theme.body.foreground)};

  &:hover {
    cursor: pointer;
  }
`;
