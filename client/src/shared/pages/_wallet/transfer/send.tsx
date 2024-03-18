// Library Imports
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { NET_TYPE_ID } from "constants/env";
import { NetworkType } from "../../../../typings";
import { Ticker } from "shared/reducers/types";
import { XBalances } from "shared/reducers/xBalance";
import { convertBalanceToMoney, iNum } from "utility/utility";
import Description from "../../../components/_inputs/description";
import Dropdown from "../../../components/_inputs/dropdown";
import Footer from "../../../components/_inputs/footer";
import Form from "../../../components/_inputs/form";
import Input from "../../../components/_inputs/input";
import InputButton from "../../../components/_inputs/input_button";
import { Container } from "./styles";
import TransferSummary from "shared/components/_summaries/transfer-summary";

const assetOptions: AssetOption[] = [
  { name: "Zephyr", ticker: Ticker.ZEPH },
  { name: "Zephyr Stable Dollar", ticker: Ticker.ZEPHUSD },
  { name: "Zephyr Reserve Share", ticker: Ticker.ZEPHRSV },
];

interface TransferOption {
  name: string;
  ticker: Ticker;
}
interface AssetOption {
  ticker: Ticker;
  name: string;
}
interface TransferOwnProps {
  sendFunds: (address: string, amount: number, ticker: Ticker, sweepAll: boolean) => void;
  isProcessing: boolean;
  fromAsset?: Ticker;
}

interface TransferReduxProps {
  xBalances: XBalances;
  options: Array<TransferOption>;
}

interface TransferState {
  selectedAsset: AssetOption | null;
  send_amount: string;
  recipient_address: string;
  amountError: string;
  reviewed: boolean;
  sweep_all: boolean;
}

type TransferProps = TransferOwnProps & TransferReduxProps;

class TransferContainer extends Component<TransferProps, TransferState> {
  state: TransferState = {
    selectedAsset: this.props.options.find((option) => option.ticker === this.props.fromAsset) ?? this.props.options[0],
    send_amount: "",
    recipient_address: "",
    amountError: "",
    reviewed: false,
    sweep_all: false,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleReviewSubmit = (event: any) => {
    const { checked } = event.target;
    this.setState({ reviewed: checked });
  };

  handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState<never>({
      [name]: value,
    });
  };

  handleSendAmountChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState<never>({
      [name]: value,
      sweep_all: false,
    });
  };

  setSendAsset = (asset: AssetOption) => {
    this.setState({
      selectedAsset: asset,
      sweep_all: false,
    });
  };

  handleSubmit = () => {
    const { send_amount, recipient_address, selectedAsset } = this.state;

    if (selectedAsset !== null) {
      this.props.sendFunds(recipient_address, Number(send_amount), selectedAsset.ticker, this.state.sweep_all);
    }
  };

  setMaxAmount = () => {
    const { selectedAsset } = this.state;
    if (!selectedAsset?.ticker) {
      this.setState({ amountError: "Select an asset" });
      return;
    }

    const availableBalance = convertBalanceToMoney(this.props.xBalances[selectedAsset.ticker].unlockedBalance, 2);

    this.setState({
      send_amount: availableBalance.toFixed(2),
      sweep_all: true,
    });
  };

  amountIsValid = (availableBalance: number): string | true => {
    const { send_amount } = this.state;

    const send_amount_num: number = parseFloat(send_amount);

    if (send_amount_num > availableBalance) {
      return "Not enough funds";
    }

    return true;
  };

  // @ts-ignore
  recipientIsValid = () => {
    let addressRegex: RegExp;
    if (NET_TYPE_ID === NetworkType.testnet) {
      addressRegex = new RegExp("^ZPH([Ttsii]+)[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{90,110}$");
    } else if (NET_TYPE_ID === NetworkType.stagenet) {
      addressRegex = new RegExp("^ZPH([Sssii]+)[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{90,110}$");
    } else {
      addressRegex = new RegExp("^ZEPH([YRist]+)[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{90,110}$");
    }

    const recipient = this.state.recipient_address;
    if (recipient === "" || addressRegex.test(recipient)) {
      return "";
    } else {
      return "Enter a valid address";
    }
  };

  render() {
    const { selectedAsset, send_amount, recipient_address } = this.state;

    const windowWidth = window.innerWidth;

    let availableBalance = 0;
    if (selectedAsset) {
      availableBalance = convertBalanceToMoney(this.props.xBalances[selectedAsset.ticker].unlockedBalance, 6);
    }

    const checkValidation =
      send_amount.length > 0 && recipient_address.length > 97 && this.amountIsValid(availableBalance) === true;

    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Dropdown
            label="Asset"
            placeholder="Select Asset"
            name="send_asset"
            ticker={selectedAsset ? selectedAsset.ticker : ""}
            value={selectedAsset ? selectedAsset.name : "Select Asset"}
            options={this.props.options}
            onClick={this.setSendAsset}
          />
          <InputButton
            // @ts-ignore
            label={availableBalance ? `Amount (Avail. ${iNum(availableBalance)})` : "Amount"}
            placeholder="Enter amount"
            type="number"
            // @ts-ignore
            error={this.amountIsValid(availableBalance)}
            name="send_amount"
            value={send_amount}
            onChange={this.handleSendAmountChange}
            button={"max"}
            onClick={this.setMaxAmount}
          />
          {windowWidth < 1380 ? (
            <Description
              label="Recipient"
              placeholder="Enter recipient's address"
              name="recipient_address"
              value={recipient_address}
              width={true}
              rows={windowWidth < 600 ? "3" : "2"}
              onChange={this.handleChange}
              error={this.recipientIsValid()}
            />
          ) : (
            <Fragment>
              <Input
                label="Recipient"
                placeholder="Enter recipient address"
                width={true}
                type={"text"}
                name="recipient_address"
                value={recipient_address}
                onChange={this.handleChange}
                error={this.recipientIsValid()}
              />
            </Fragment>
          )}
        </Form>
        <Container>
          <TransferSummary
            recipientAddress={recipient_address === "" ? "--" : recipient_address}
            transferAsset={selectedAsset === null ? "--" : selectedAsset.ticker}
            transferAmount={send_amount === "" ? "--" : send_amount}
            onChange={this.handleReviewSubmit}
          />
          <Footer
            onClick={() => this.handleSubmit()}
            loading={this.props.isProcessing}
            label={"Preview"}
            disabled={!checkValidation}
          />
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: any, ownProps: TransferOwnProps): TransferReduxProps => ({
  xBalances: state.xBalance,
  options: assetOptions,
});

export const SendFunds = connect<TransferReduxProps, {}, TransferOwnProps>(mapStateToProps, {})(TransferContainer);
