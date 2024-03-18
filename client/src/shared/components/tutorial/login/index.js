// Library Imports
import React from "react";

// Relative Imports
import { Container, Background, List, Item, Image } from "./styles";
import logo from "../../../../assets/logo/icon.png";

const LoginTutorial = ({ step }) => {
  return (
    <Container>
      {step === 0 && (
        <Background>
          <Image src={logo} />
          <List>Welcome to Zephyr</List>
          <Item></Item>
        </Background>
      )}
    </Container>
  );
};

export default LoginTutorial;
