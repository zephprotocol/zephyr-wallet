import styled from "styled-components";

export const Container = styled.div`
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.body.foreground};
  border: 1px solid ${(props) => props.theme.body.border};
  border-radius: 12px;
  padding: 16px;
`;

export const Title = styled.div`
  font-family: Inter-SemiBold;
  font-size: 16px;
  color: ${(props) => props.theme.type.primary};
  letter-spacing: 0;
  line-height: 28px;
`;

export const Description = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.type.secondary};
`;

export const Icon = styled.img`
  height: 30px;
  width: 30px;
  margin-bottom: 2px;
`;
