import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  grid-column: 1 / 3;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.body.border};
  background: ${(props) => props.theme.body.foreground};
`;

export const Item = styled.div`
  height: 100%;
  width: 50%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter-Regular;
  cursor: pointer;
  color: ${(props) => (props.active ? `${props.theme.button.primary_label}` : `${props.theme.type.secondary}`)};
  background: ${(props) => (props.active ? `${props.theme.button.primary}` : `${props.theme.body.foreground}`)};
  transition: 500ms;

  &:hover {
    background: ${(props) => (props.active ? `${props.theme.button.primary_hover}` : `${props.theme.body.foreground}`)};
  }
  transition: 500ms;
`;
