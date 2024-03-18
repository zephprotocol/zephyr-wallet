import styled from "styled-components";

// https://www.svgbackgrounds.com/#wavey-fingerprint
import light from "../../../../../assets/backgrounds/light.svg";
import dark from "../../../../../assets/backgrounds/dark.svg";
import sepia from "../../../../../assets/backgrounds/sepia.svg";

export const Page = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.body.background};
`;

export const Microcopy = styled.div`
  height: auto;
  width: auto;
`;
