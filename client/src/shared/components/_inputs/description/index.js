// Library Imports
import React from "react";

// Relative Imports
import { Container, Field, Labels, Error } from "./styles";
import { Label } from "../../../../assets/styles/type.js";

const Description = ({
  label,
  error = "",
  width = false,
  ref = null,
  type = 'text',
  ...rest
}) => {
  return (
    <Container useGridColumn={width}>
      <Labels>
        <Label>{label}</Label>
        <Error>{error}</Error>
      </Labels>
      <Field ref={ref} {...rest} />
    </Container>
  );
};

export default Description;
