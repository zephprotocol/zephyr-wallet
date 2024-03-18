// Library Imports
import React from "react";

// Relative Imports
import { Container, State, Status, Label, Value, Column, Row, Data, ShortRow, Strapline } from "./styles";
import { getNetworkByName, isMainnet } from "constants/env";
import { Conversion } from "shared/components/tx-history/container";
import Dots from "../../_animations/dots";
import { convertToNewTicker } from "utility/utility";

export interface TransactionProps {
  type: any;
  date: any;
  hash: string;
  amount: any;
  conversion: Conversion;
  block: any;
  currentValueInUSD: any;
  mempool: boolean;
  timeTillUnlocked: any;
  fee: any;
  failed: boolean;
}

export const Transaction = ({
  type,
  date,
  hash,
  amount,
  conversion,
  block,
  currentValueInUSD,
  mempool,
  timeTillUnlocked,
  fee,
  failed,
}: TransactionProps) => {
  const first = hash.substring(0, 4);
  const last = hash.substring(hash.length - 4);
  const truncated = first + "...." + last;

  const inUsd = isNaN(parseFloat(currentValueInUSD)) ? 0 : parseFloat(currentValueInUSD);

  let statusDetails = "Completed";
  let statusLabel = "Status";

  if (failed) {
    statusDetails = "Failed";
  } else if (mempool) {
    statusDetails = "Pending";
  } else if (timeTillUnlocked) {
    statusDetails = "~ " + timeTillUnlocked;
    statusLabel = "Unlocks in";
  }

  const txExplorerLink = `https://${isMainnet() ? "" : getNetworkByName() + "-"}explorer.zephyrprotocol.com/tx/${hash}`;

  /* -- this changes the type and shows the exchange style
  if(conversion.isConversion){
    type = "Exchange";
  }
  */

  return (
    <Container href={txExplorerLink} target="_blank">
      <State status={type}>
        <Status>{type}</Status>
      </State>
      <Column>
        <Row>
          <Data>
            <Value alignment="left">
              {amount}
              {conversion.isConversion && conversion.amountStr && (
                <Strapline>
                  {" "}
                  {conversion.prefixStr} {conversion.amountStr} {convertToNewTicker(conversion.assetId)}{" "}
                </Strapline>
              )}
            </Value>
            <Label alignment="left">Amount</Label>
          </Data>

          <Data>
            <Value alignment="center">
              {statusDetails === "Pending" ? (
                <ShortRow>
                  <>{statusDetails}</>
                  <Dots />
                </ShortRow>
              ) : (
                statusDetails
              )}
            </Value>
            <Label alignment="center">{statusLabel}</Label>
          </Data>

          <Data>
            <Value alignment="right">${inUsd}</Value>
            <Label alignment="right">Current Value</Label>
          </Data>
        </Row>
        <Row>
          {fee !== 0 ? (
            <Data>
              <Value alignment="left">{fee}</Value>
              <Label alignment="left">Fee</Label>
            </Data>
          ) : (
            <Data>
              <Value alignment="left">{block === undefined ? "N/A" : block}</Value>
              <Label alignment="left">Block</Label>
            </Data>
          )}

          <Data>
            <Value alignment="center">{date}</Value>
            <Label alignment="center">Date</Label>
          </Data>
          <Data>
            <Value alignment="right">{truncated}</Value>
            <Label alignment="right">Receipt</Label>
          </Data>
        </Row>
      </Column>
    </Container>
  );
};
