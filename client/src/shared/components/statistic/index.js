// Library Imports
import React from "react";

// Relative Imports
import { Container, Title, Description, Icon } from "./styles";

const Statistic = ({ value, label, image = "" }) => {
  return (
    <Container>
      {!!image && <Icon src={image} />}
      <Title>{value}</Title>
      <Description>{label}</Description>
    </Container>
  );
};

export default Statistic;
