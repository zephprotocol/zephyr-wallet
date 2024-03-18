import styled from "styled-components";
import { Link } from "react-router-dom";
import media from "../../../assets/styles/media.js";
import { ReactComponent as ChevronIcon } from "../../../assets/icons/chevron.svg";
import { ReactComponent as SendSVG } from "../../../assets/icons/send.svg";
import { ReactComponent as AddressBookSVG } from "../../../assets/icons/receipt.svg";
import { ReactComponent as SwapSVG } from "../../../assets/icons/swap.svg";

export const ShortRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 1 / 3;
  transition: 500ms;
  border-radius: 14px;
  // box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);

  // &:hover {
  //   cursor: pointer;
  //   box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.15);
  //   transition: 500ms;
  // }
`;

export const Arrow = styled(ChevronIcon)`
  .bg {
    fill: ${(props) => props.theme.type.primary};
  }
`;

export const Locked = styled(Link)`
  background: ${(props) => props.theme.body.foreground};
  border: 1px solid ${(props) => props.theme.body.border};
  border-bottom: none;
  border-radius: 12px 4px 0px 0px;
  text-decoration: none;
  flex-direction: row;

  height: auto;
  display: flex;
  justify-content: space-between;
`;

export const Unlocked = styled(Link)`
  background: ${(props) => props.theme.body.foreground};
  border: 1px solid ${(props) => props.theme.body.border};
  border-bottom: none;
  border-radius: 12px 12px 0px 0px;
  text-decoration: none;
  height: auto;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
`;

export const Route = styled.div`
  width: 20px;
  height: auto;
  display: flex;
  align-items: center;
  padding-right: 12px;
`;

export const Icon = styled.img`
  height: 60px;
  width: 60px;
  margin-right: 12px;
`;

export const Column = styled.div`
  height: auto;
  display: flex;
  padding: 20px 33px;
  // width: 100%;
  align-items: center;
  justify-content: space-between;

  gap: 2px;
`;

export const CoinName = styled.div`
font-size: 9px;
color: ${(props) => props.theme.type.contrast};
letter-spacing: 0;
line-height: 30px;
padding: 10px 33px;
border-bottom: 1px solid ${(props) => props.theme.body.border};

h1 {
    font-weight: 700;
    margin: 0;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  gap: 10px;
`;

export const PendingWrapper = styled.div`
  border-top: 1px solid ${(props) => props.theme.body.border};
  text-decoration: none;
`;

export const PendingSpacer = styled.div`
  height: 8px;
  background: ${(props) => props.theme.body.foreground};
  border-right: 1px solid ${(props) => props.theme.body.border};
  border-left: 1px solid ${(props) => props.theme.body.border};
`;

export const PendingBoxWrapper = styled.div`
  display: flex;
  border-right: 1px solid ${(props) => props.theme.body.border};
  border-left: 1px solid ${(props) => props.theme.body.border};
  background: ${(props) => props.theme.body.foreground};
  justify-content: space-between;
  padding: 0px 20px 0px 20px;

  ${media.mobile`
    flex-direction: column;
  `}
`;

export const PendingBox = styled.div`
  display: flex;
  padding: 0px 20px 0px 20px;
  gap: 20px;

  ${media.mobile`
    padding: 10px 20px 10px 20px;
  `}
`;

export const PendingSection = styled.div`
  // display: flex;
`;

export const Pending = styled.div`
  font-family: Inter-Regular;
  font-size: 14px;
  font-weight: 800;
  color: ${(props) => props.theme.type.contrast};
  padding: 2px 0;
`;

export const Balances = styled.div`
  display: flex;
  padding: 2px;
  flex-direction: row;
  justify-content: center;
  background: ${(props) => props.theme.body.foreground};
  border: 1px solid ${(props) => props.theme.body.border};
  border-radius: 0px 0px 12px 12px;

  &:hover {
    cursor: pointer;
  }
`;

export const Asset = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

export const Title = styled.div`
  font-family: Inter-SemiBold;
  font-size: 17px;
  color: ${(props) => props.theme.type.primary};
  letter-spacing: 0;
  line-height: 30px;
`;

export const MainBalance = styled.div`
  font-family: Inter-Bold;
  font-size: 28px;
  color: ${(props) => props.theme.type.primary};
  letter-spacing: 0;
  line-height: 32px;
  position: relative;
  padding-top: 6px;
`;

export const Balance = styled.div`
  font-family: Inter-Bold;
  font-size: 17px;
  color: ${(props) => props.theme.type.primary};
  letter-spacing: 0;
  line-height: 32px;
  position: relative;
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
    color: ${(props) => props.theme.type.primary};
    font-family: Inter-Bold;
  `}
`;

export const Subtitle = styled.span`
  font-family: Inter-Regular;
  font-size: 14px;
  font-weight: 800;
  color: ${(props) => props.theme.type.contrast};
  letter-spacing: 0;
  line-height: 20px;
  white-space: break-spaces;
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
`;

export const Button = styled(Link)`
  border-radius: 24px;
  font-family: Inter-SemiBold;
  font-size: 14px;
  font-weight: 800;
  color: ${(props) => props.theme.type.contrast};
  text-align: center;
  text-decoration: none;
  line-height: 24px;
  width: 120px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 500ms;
  border: 1px solid ${(props) => props.theme.input.input_border};

  outline: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    cursor: pointer;
    transition: 500ms;
    color: ${(props) => props.theme.button.primary_label};
    border: 1px solid ${(props) => props.theme.type.primary};
    background: ${(props) => props.theme.button.inverse};
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
`;

export const SendIcon = styled(SendSVG)`
  height: 16px;
  width: 16px;
  padding-right: 4px;
  .bg {
    fill: ${(props) => props.theme.type.secondary};
    &:hover {
      fill: ${(props) => props.theme.type.primary};
    }
  }
`;
export const AddressBookIcon = styled(AddressBookSVG)`
  height: 16px;
  width: 16px;
  padding-right: 4px;
  .bg {
    fill: ${(props) => props.theme.type.secondary};
    &:hover {
      fill: ${(props) => props.theme.type.primary};
    }
  }
`;
export const SwapIcon = styled(SwapSVG)`
  height: 16px;
  width: 16px;
  padding-right: 4px;
  .bg {
    fill: ${(props) => props.theme.type.secondary};
    &:hover {
      fill: ${(props) => props.theme.type.primary};
    }
  }
`;
