import React from "react";
import { Container, Icon, Title } from "./styles";
import zephyr from "../../../assets/loading/rounded.svg";

const Loader = () => {
  return (
    <Container>
      <Icon src={zephyr} />
      <Title>Zephyr is loading...</Title>
    </Container>
  );
};

export default Loader;
