// Library Imports
import React from "react";

// Relative Imports
import { Container, Field, Labels, Error } from "./styles";
import { Label } from "../../../../assets/styles/type.js";

const Seed = ({
  label,
  error,
  width,
  ref,
  type,
  actionEvent,
  action,
  ...rest
}) => {
  return (
    <Container width={width}>
      <Labels>
        <Label>{label}</Label>
        <Error>{error}</Error>
      </Labels>
      <Field ref={ref} {...rest} />
    </Container>
  );
};

export default Seed;
