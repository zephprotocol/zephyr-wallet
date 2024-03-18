import styled from "styled-components";
import media from "../../../assets/styles/media";

export const Row = styled.div`
  display flex;
  grid-column: 1 / 3;

  justify-content: space-between;

  border: 1px solid ${(props) => props.theme.body.border};
  background: ${(props) => props.theme.body.foreground};
  padding: 20px;
  border-radius: 12px;

  ${media.tablet`
    grid-template-columns: 1fr;
    flex-direction: column;
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

export const DetailBox = styled.div`
  display: flex;
  padding: 0px 20px 0px 20px;
  gap: 20px;

  ${media.mobile`
    padding: 10px 20px 10px 20px;
  `}
`;

export const DetailSection = styled.div`
  // display: flex;
`;

export const Detail = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  color: ${(props) => props.theme.type.primary};
  padding: 2px 0;
`;
