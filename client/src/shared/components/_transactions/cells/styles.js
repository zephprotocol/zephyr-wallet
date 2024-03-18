import styled from "styled-components";

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
