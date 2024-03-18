// Library Imports
import React from "react";

// Relative Imports
import { Wrapper, Container, Row, Key, Value } from "./styles";
import { Error } from "../../../../assets/styles/type.js";
import { Ticker } from "shared/reducers/types";
import { iNum, convertToNewTicker } from "utility/utility";

export const ExchangeSummary = ({
  xRate,
  fromAmount,
  toAmount,
  conversionFee,
  fromTicker,
  toTicker,
  fee,
  selectedPrio,
  hasLatestXRate,
  usingSpot,
}) => {
  // use USD always as quote currency for better readability
  let xFromTicker = fromTicker;
  //let xToTicker = toTicker;
  let xToTicker = toTicker === null ? "" : toTicker;
  let rate = xRate;
  let conversion_info = "";

  if (toTicker === null || fromTicker === null) {
    rate = 1;
    xFromTicker = "-";
    xToTicker = "-";
  }

  if (fromTicker === Ticker.ZEPH || toTicker === Ticker.ZEPH) {
    if (usingSpot) {
      conversion_info = " (Spot Rate)";
    } else {
      conversion_info = " (Moving Average)";
    }
  }

  if (fromTicker === Ticker.ZEPHUSD) {
    xFromTicker = Ticker.ZEPH;
    xToTicker = Ticker.ZEPHUSD;
  } else if (fromTicker === Ticker.ZEPHRSV) {
    xFromTicker = Ticker.ZEPH;
    xToTicker = Ticker.ZEPHRSV;
  }


  //unlock times
  let unlock_time = "~20m";

  return (
    <Wrapper>
      <Container>
        <Row>
          <Key>Conversion Rate{conversion_info}</Key>
          <Value active={true}>
            {!hasLatestXRate ? (
              <Error>Fetching latest rates...</Error>
            ) : (
              `1 ${convertToNewTicker(xToTicker)} : ${iNum(rate)} ${convertToNewTicker(xFromTicker)}`
            )}
          </Value>
        </Row>
        <Row>
          <Key>Converting From</Key>
          <Value>
            {fromAmount}&#160;
            {fromTicker ? convertToNewTicker(fromTicker) : "--"}
          </Value>
        </Row>
        <Row>
          <Key>Converting To</Key>
          <Value>
            {toAmount}&#160;
            {toTicker ? convertToNewTicker(toTicker) : "--"}
          </Value>
        </Row>
        <Row>
          <Key>Conversion Fee</Key>
          <Value>
            {conversionFee}&#160;
            {toTicker ? convertToNewTicker(toTicker) : "--"}
          </Value>
        </Row>
        <Row>
          <Key>Unlock Time</Key>
          <Value>{unlock_time}</Value>
        </Row>
      </Container>
    </Wrapper>
  );
};
