import styled from "styled-components";
import media from "../../../assets/styles/media";

export const Row = styled.div`
  display flex;
  // width: 100%;
  // display: grid;
  // grid-gap: 20px;
  // grid-template-columns: 1fr 1fr 1fr;
  // height: auto;
  grid-column: 1 / 3;

  justify-content: space-between;
  align-items: center;

  border: 1px solid ${(props) => props.theme.body.border};
  background: ${(props) => props.theme.body.foreground};
  padding: 20px;
  border-radius: 12px;

  ${media.tablet`
    grid-template-columns: 1fr;
  `}
`;

export const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 50px 0px 20px;
`;

export const SubtitleGrey = styled.span`
  font-family: Inter-Regular;
  font-size: 14px;
  font-weight: 800;
  color: ${(props) => props.theme.type.secondary};
  letter-spacing: 0;
  line-height: 24px;
  white-space: break-spaces;
  width: 100%;
  text-align: center;
`;

export const Subtitle = styled.span`
  font-family: Inter-Regular;
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.type.primary};
  letter-spacing: 0;
  line-height: 24px;
  white-space: break-spaces;
  width: 100%;
  text-align: center;
`;
