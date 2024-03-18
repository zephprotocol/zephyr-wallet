import styled from "styled-components";

export const Title = styled.div`
  text-align: center;
  font-family: Inter-SemiBold;
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.theme.type.primary};
  letter-spacing: 0;
  line-height: 36px;
`;

export const Description = styled.div`
  font-family: Inter-Regular;
  text-align: center;
  font-size: 14px;
  color: ${(props) => props.theme.type.secondary};
  line-height: 24px;
`;

export const Body = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.type.primary};
  line-height: 24px;
`;

export const Label = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.type.secondary};
`;

export const Timestamp = styled.div`
  font-family: Inter-Regular;
  font-size: 12px;
  color: ${(props) => props.theme.type.secondary};
`;

export const Error = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.input.input_error};
  text-align: right;
`;

export const Information = styled.div`
  font-family: Inter-Regular;
  font-size: 13px;
  line-height: 22px;
  color: ${(props) => props.theme.type.secondary};
`;

export const Header = styled.div`
  font-weight: 900;
  font-family: "Playfair Display", serif;
  font-size: 68px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 80px;
  margin-bottom: 40px;
`;
