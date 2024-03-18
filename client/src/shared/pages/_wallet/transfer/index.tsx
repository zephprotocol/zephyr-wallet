// Library Imports
import React, { Component, Fragment } from "react";
import { Ticker } from "shared/reducers/types";
// Relative Imports
import Body from "../../../components/_layout/body";
import Header from "../../../components/_layout/header";
import { SendFunds } from "./send";
import { AddressEntry } from "shared/reducers/address";

interface TransferOwnProps {
  sendFunds: (address: string, amount: number, ticker: Ticker, sweepAll: boolean) => void;
  addresses: AddressEntry[];
  isProcessing: boolean;
  fromAsset?: Ticker;
}

interface TransferState {
  firstTabState: boolean;
  secondTabState: boolean;
}

type TransferProps = TransferOwnProps;

export class Transfer extends Component<TransferProps, TransferState> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Fragment>
        <Body>
          <Header title="Transfer" description="Send assets to and from your Zephyr Wallet" />
          <SendFunds
            sendFunds={this.props.sendFunds}
            isProcessing={this.props.isProcessing}
            fromAsset={this.props.fromAsset}
          />
        </Body>
      </Fragment>
    );
  }
}
