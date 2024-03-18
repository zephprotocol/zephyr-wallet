import styled from "styled-components";

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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
