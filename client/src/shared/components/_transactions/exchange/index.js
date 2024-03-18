// Library Imports
import React, { Fragment } from "react";
import { Ticker } from "shared/reducers/types.ts";
// Relative Imports
import { Container, Row, Key, Value, Tag, SubHeader, Information, Url, Strong } from "./styles";
import Confirm from "../../confirm/index.js";
import Cell from "../cells/index.js";
import { convertToNewTicker } from "utility/utility";

const Transaction = ({
  xRate,
  fromAmount,
  toAmount,
  fromTicker,
  toTicker,
  fee,
  externAddress,
  onChange,
  checked,
  priority,
  isOwnAddress,
  change,
}) => {
  const first = externAddress.substring(0, 4);
  const last = externAddress.substring(externAddress.length - 4);
  const truncatedAddress = first + "...." + last;

  // Adding for simplicity and clarity
  const from = `${fromAmount} ${convertToNewTicker(fromTicker)}`;
  const to = `${toAmount} ${convertToNewTicker(toTicker)}`;

  let unlock_time = "~20m";

  return (
    <Fragment>
      <Container>
        <SubHeader>Conversion Details</SubHeader>
        <Cell left="Convert From" right={from} />
        <Cell left="Convert To" right={to} />
        {!isOwnAddress && <Cell left="Recipient Address" right={truncatedAddress} />}
      </Container>
      <Container>
        <SubHeader>Transaction Details</SubHeader>
        <Cell left={`Change(${convertToNewTicker(fromTicker)})`} right={change} />
        <Cell left="Unlock Time" right={unlock_time} />
        <Row>
          <Key>Transaction Fee</Key>
          <Tag priority={priority}>
            <Value>
              {fee} {convertToNewTicker(fromTicker)}
            </Value>
          </Tag>
        </Row>
        <Confirm description={<span>Confirm transaction details.</span>} checked={checked} onChange={onChange} />
      </Container>
    </Fragment>
  );
};

export default Transaction;
