// Library Imports
import { Component, Fragment } from "react";
import { connect } from "react-redux";
// Relative Imports
import Body from "../../../components/_layout/body";
import Header from "../../../components/_layout/header";
import Input from "../../../components/_inputs/input";
import Description from "../../../components/_inputs/description";
import AddressDropdown from "../../../components/_inputs/addresses_dropdown";
// import InputButton from "../../../components/_inputs/input_button";
import Form from "../../../components/_inputs/form";
import { useNavigate, useParams } from "react-router";
import Footer from "../../../components/_inputs/footer";
import Dropdown from "../../../components/_inputs/dropdown";
import {
  hasLatestXRate,
  priceDelta,
  selectXRate,
  BlockHeaderRate,
  selectLastExchangeRates,
} from "shared/reducers/blockHeaderExchangeRates";
import { DesktopAppState } from "platforms/desktop/reducers";
import { selectNodeHeight } from "shared/reducers/chain";
import { createExchange } from "platforms/desktop/actions";
import { Ticker } from "shared/reducers/types";
import {
  selectExchangeSucceed,
  selectFromTicker,
  selectIsProcessingExchange,
  selectToTicker,
} from "shared/reducers/exchangeProcess";
import { setFromTicker, setToTicker } from "shared/actions/exchange";
import { XBalances } from "shared/reducers/xBalance";
import { convertBalanceToMoney, iNum } from "utility/utility";
import { showModal } from "shared/actions/modal";
import { MODAL_TYPE } from "shared/reducers/modal";
import { ExchangeSummary } from "shared/components/_summaries/exchange-summary";
import { AddressEntry } from "../../../reducers/address";
import { WideContainer } from "./styles";
import InputButton from "shared/components/_inputs/input_button";
import bigInt from "big-integer";
import { walletProxy } from "shared/core/proxy";

enum ExchangeTab {
  Basic,
  Advanced,
}

interface ExchangeProps {
  nodeHeight: number;
  showModal: (modalTyoe: MODAL_TYPE) => void;
  createExchange: typeof createExchange;
  isProcessingExchange: boolean;
  hasLatestXRate: boolean;
  exchangeSucceed: boolean;
  priceDelta: number | null;
  lastExchangeRates: BlockHeaderRate | null;
  setFromTicker: (ticker: Ticker | null) => void;
  setToTicker: (ticker: Ticker | null) => void;
  xRate: number;
  fromTicker: Ticker | null;
  toTicker: Ticker | null;
  balances: XBalances;
  addresses: AddressEntry[];
  navigate: (path: string) => void;
  fromAsset?: Ticker;
}

enum TxType {
  MintStable,
  RedeemStable,
  MintReserve,
  RedeemReserve,
  None,
}

type ExchangeState = {
  fromAmount?: number;
  toAmount?: number;
  conversionFee?: number;
  selectedTab: ExchangeTab;
  externAddress: string;
  selectedPrio: ExchangePrioOption;
  hasEnough: boolean;
  fromOptions: AssetOption[];
  toOptions: AssetOption[];
  txType: TxType;
  selectedAddress: AddressEntry;
};

interface AssetOption {
  ticker: Ticker;
  name: string;
}

export interface ExchangePrioOption {
  ticker: string;
  name: string;
  prio: number;
}

const zephOption = { name: "Zephyr", ticker: Ticker.ZEPH };
const stableOption = { name: "Zephyr Stable Dollar", ticker: Ticker.ZEPHUSD };
const rsvOption = { name: "Zephyr Reserve Share", ticker: Ticker.ZEPHRSV };

const assetOptions: AssetOption[] = [zephOption, stableOption, rsvOption];

const exchangePrioOptions: ExchangePrioOption[] = [
  { name: "Default", ticker: "Unlocks ~21d", prio: 0 },
  { name: "Low", ticker: "Unlocks ~21d", prio: 1 },
  { name: "Medium", ticker: "Unlocks ~21d", prio: 2 },
  { name: "High", ticker: "Unlocks ~21d", prio: 3 },
];

const ALL_ADDRESSES: AddressEntry = { index: -1, label: "All Addresses", address: "", used: false };

const INITIAL_STATE: ExchangeState = {
  fromAmount: undefined,
  toAmount: undefined,
  conversionFee: undefined,
  selectedTab: ExchangeTab.Advanced,
  externAddress: "",
  selectedPrio: exchangePrioOptions[0],
  hasEnough: false,
  fromOptions: [...assetOptions],
  toOptions: [...assetOptions],
  txType: TxType.MintStable,
  selectedAddress: ALL_ADDRESSES,
};

class Exchange extends Component<ExchangeProps, ExchangeState> {
  private sendTicker: Ticker = Ticker.ZEPH;

  state: ExchangeState = INITIAL_STATE;

  componentDidMount() {
    window.scrollTo(0, 0);
    const { fromAsset } = this.props;
    const defaultFromAsset = fromAsset ?? Ticker.ZEPH;
    const defaultFromOption = assetOptions.find((o) => o.ticker === defaultFromAsset);
    if (!defaultFromOption) {
      this.props.setFromTicker(Ticker.ZEPH);
      this.props.setToTicker(Ticker.ZEPHUSD);
    } else {
      this.setFromAsset(defaultFromOption);
    }
  }

  componentDidUpdate(prevProps: Readonly<ExchangeProps>, nextContext: any): void {
    if (!this.props.exchangeSucceed && prevProps.exchangeSucceed) {
      this.setState({
        fromAmount: undefined,
        toAmount: undefined,
        conversionFee: undefined,
        externAddress: "",
      });
      this.props.navigate("/wallet/assets/" + this.sendTicker);
    }

    if (this.props.toTicker !== prevProps.toTicker) {
      this.setConversionType(this.props.fromTicker, this.props.toTicker);
    }
    if (this.props.fromTicker !== prevProps.fromTicker) {
      this.setConversionType(this.props.fromTicker, this.props.toTicker);
      this.setToAssetOptions(this.props.fromTicker);
    }
  }

  setSweepAll = async () => {
    const fromTicker = this.props.fromTicker;
    if (!fromTicker) return;
    const unlockedBalance = convertBalanceToMoney(this.props.balances[fromTicker].unlockedBalance, 4);
    this.setState({ fromAmount: unlockedBalance }, () => {
      this.calcConversion(true);
    });
  };

  onEnterFromAmount = (event: any) => {
    const name = event.target.name;
    const value = parseFloat(event.target.value);

    this.setState({ ...this.state, [name]: value }, () => {
      this.calcConversion(true);
    });
  };

  onEnterToAmount = (event: any) => {
    const name = event.target.name;
    const value = parseFloat(event.target.value);

    this.setState({ ...this.state, [name]: value }, () => {
      this.calcConversion(false);
    });
  };

  onEnterExternAddress = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ ...this.state, [name]: value });
  };

  setToAssetOptions(fromTicker: Ticker | null): void {
    if (fromTicker === null) {
      return;
    }

    if (fromTicker === Ticker.ZEPH) {
      this.setState({ toOptions: [stableOption, rsvOption] });
      return;
    }

    if (fromTicker === Ticker.ZEPHUSD || fromTicker === Ticker.ZEPHRSV) {
      this.setState({ toOptions: [zephOption] });
      return;
    }
  }

  setFromAsset = (option: AssetOption) => {
    // Call back function from Dropdown
    this.props.setFromTicker(option.ticker);
    //on mismatch, just reset the other ticker
    if (option.ticker === Ticker.ZEPH) {
      this.props.setToTicker(Ticker.ZEPHUSD);
    } else if (option.ticker === Ticker.ZEPHUSD || option.ticker === Ticker.ZEPHRSV) {
      this.props.setToTicker(Ticker.ZEPH);
    } else if (this.isTickerMismatch(option.ticker, this.props.toTicker)) {
      this.props.setToTicker(null);
    }
  };

  setToAsset = (option: AssetOption) => {
    // Call back function from Dropdown
    this.props.setToTicker(option.ticker);
    //on mismatch, just reset the other ticker
    if (option.ticker === Ticker.ZEPHUSD || option.ticker === Ticker.ZEPHRSV) {
      this.props.setFromTicker(Ticker.ZEPH);
    } else if (this.isTickerMismatch(this.props.fromTicker, option.ticker)) {
      this.props.setFromTicker(null);
    }
  };

  isTickerMismatch(toTicker: Ticker | null, fromticker: Ticker | null): boolean {
    if (toTicker === null || fromticker === null) {
      return false;
    }

    // transfer not allowed in conversion tab
    if (toTicker === fromticker) {
      return true;
    }

    // Not allowed between Stable and Reserve
    if (fromticker !== Ticker.ZEPH && toTicker !== Ticker.ZEPH) {
      return true;
    }

    return false;
  }

  setConversionType(fromTicker: Ticker | null, toTicker: Ticker | null) {
    let txType: TxType;
    if (fromTicker === null || toTicker === null) {
      txType = TxType.None;
      this.setState({ fromAmount: 0, toAmount: 0 });
      return;
    } else if (fromTicker === Ticker.ZEPH && toTicker === Ticker.ZEPHUSD) {
      txType = TxType.MintStable;
    } else if (fromTicker === Ticker.ZEPHUSD && toTicker === Ticker.ZEPH) {
      txType = TxType.RedeemStable;
    } else if (fromTicker === Ticker.ZEPH && toTicker === Ticker.ZEPHRSV) {
      txType = TxType.MintReserve;
    } else if (fromTicker === Ticker.ZEPHRSV && toTicker === Ticker.ZEPH) {
      txType = TxType.RedeemReserve;
    } else {
      txType = TxType.None;
    }

    this.setState(
      {
        txType,
      },
      () => this.calcConversion(),
    );
  }

  calcConversion(setToAmount: boolean = true) {
    const { toAmount, fromAmount, txType } = this.state;
    const { xRate } = this.props;

    if (xRate === 0) {
      return;
    }

    let rate = xRate;
    if (txType === TxType.MintStable || txType === TxType.MintReserve) {
      rate = 1 / xRate;
    }

    const feeRate = txType === TxType.MintReserve ? 0 : 0.02;

    if (fromAmount !== undefined && setToAmount) {
      const amount = fromAmount * rate;
      const conversionFee = amount * feeRate;
      const toAmount = parseFloat(iNum(amount - conversionFee));

      this.setState({ toAmount, conversionFee });
      return;
    }

    if (toAmount !== undefined && !setToAmount) {
      const amount = toAmount / rate;
      const amountBeforeFee = amount / (1 - feeRate);
      const conversionFee = parseFloat(iNum((toAmount / (1 - feeRate)) * feeRate));

      const fromAmount = parseFloat(amountBeforeFee.toFixed(4));
      this.setState({ fromAmount, conversionFee });
    }
  }

  handleSubmit = () => {
    const { fromTicker, toTicker } = this.props;

    if (!this.state.fromAmount || !fromTicker || !toTicker || !this.state.toAmount) return;

    const { fromAmount, toAmount } = this.state;

    this.sendTicker = fromTicker;

    const selectedAddressIndex = this.state.selectedAddress.index !== -1 ? this.state.selectedAddress.index : undefined;

    const unlockedBalance = convertBalanceToMoney(this.props.balances[fromTicker].unlockedBalance, 4);
    const sweepAll = fromAmount === unlockedBalance;

    this.props.createExchange(
      fromTicker,
      toTicker,
      fromAmount,
      toAmount,
      this.state.selectedPrio.prio,
      this.state.externAddress,
      selectedAddressIndex,
      sweepAll,
    );
  };

  setExchangePriority = (selectedOption: ExchangePrioOption) => {
    this.setState({ selectedPrio: exchangePrioOptions[0] });
  };

  validateExchange = (availableBalance: any) => {
    const { fromAmount, toAmount } = this.state;
    const fromAmountValid = fromAmount !== undefined;
    const toAmountValid = toAmount !== undefined;
    const { hasLatestXRate } = this.props;
    const hasEnoughFunds = fromAmount !== undefined ? fromAmount <= availableBalance : false;

    if (fromAmountValid && toAmountValid && hasLatestXRate && hasEnoughFunds) {
      // If valid then make this 'false' so the footer is enabled
      return false;
    } else {
      // If invalid then make this 'true' so the footer is disabled
      return true;
    }
  };

  fromAmountIsValid = (availableBalance: any) => {
    const { fromAmount } = this.state;

    //@ts-ignore
    if (fromAmount > availableBalance) {
      return "Not enough funds";
    }
  };

  recipientIsValid = () => {
    const { externAddress } = this.state;
    if (externAddress.length > 97) {
      return "";
    } else if (externAddress === "") {
      return "";
    } else {
      return "Enter a valid address";
    }
  };

  calculateFeeEstimate = () => {
    const { selectedPrio, fromAmount } = this.state;
    const { prio } = selectedPrio;
    const amount = Number(fromAmount);
    if (prio === 0) {
      return amount * 0.002;
    } else if (prio === 1) {
      return amount * 0.05;
    } else if (prio === 2) {
      return amount * 0.1;
    } else if (prio === 3) {
      return amount * 0.2;
    } else {
      return null;
    }
  };

  selectAddress = (selected: AddressEntry) => {
    this.setState({ selectedAddress: selected });
  };

  render() {
    const {
      fromAmount,
      toAmount,
      conversionFee,
      selectedTab,
      selectedPrio,
      externAddress,
      fromOptions,
      toOptions,
      txType,
      selectedAddress,
    } = this.state;

    const { addresses, fromTicker, toTicker, lastExchangeRates } = this.props;
    const { hasLatestXRate } = this.props;

    let usingSpot = true;

    if (
      lastExchangeRates !== null &&
      lastExchangeRates !== undefined &&
      lastExchangeRates.hasOwnProperty("stable_ma") &&
      (fromTicker === Ticker.ZEPH || toTicker === Ticker.ZEPH)
    ) {
      if (fromTicker === Ticker.ZEPHUSD || toTicker === Ticker.ZEPHUSD) {
        // let stable_rate = latestBlockerHeader["stable"].toJSNumber() / Math.pow(10, 12);
        let stable_ma_rate = lastExchangeRates["stable_ma"].toJSNumber() / Math.pow(10, 12);
        if (this.props.xRate === stable_ma_rate) usingSpot = false;
      } else {
        // let reserve_rate = latestBlockerHeader["reserve"].toJSNumber() / Math.pow(10, 12);
        let reserve_ma_rate = lastExchangeRates["reserve_ma"].toJSNumber() / Math.pow(10, 12);
        if (this.props.xRate === reserve_ma_rate) usingSpot = false;
      }
    }

    const availBalance = fromTicker ? convertBalanceToMoney(this.props.balances[fromTicker].unlockedBalance, 6) : 0;

    const fromAsset = assetOptions.find((option) => option.ticker === fromTicker);

    const toAsset = assetOptions.find((option) => option.ticker === toTicker);

    const toBalance = toTicker ? convertBalanceToMoney(this.props.balances[toTicker].unlockedBalance, 6) : 0;

    const displayedFromAmount = fromAmount !== undefined ? fromAmount : "";

    let displayedToAmount = toAmount !== undefined ? toAmount : "";

    const handleLabel =
      selectedAddress!.label === undefined ? `Address ${selectedAddress!.index}` : selectedAddress!.label;

    let truncated: string;
    if (selectedAddress.index === -1) {
      truncated = "(Default)";
    } else {
      const first = selectedAddress!.address.substring(0, 4);
      const last = selectedAddress!.address.substring(selectedAddress!.address.length - 4);
      truncated = first + "...." + last;
    }
    return (
      <Fragment>
        <Body>
          <Header title="Swap" description="Swap between Zephyr and Stable Dollars or Reserve Shares" />

          <Fragment>
            <Form onSubmit={this.handleSubmit}>
              <Dropdown
                label="From Asset"
                placeholder="Select Asset"
                name="from_asset"
                ticker={fromTicker}
                value={fromAsset ? fromAsset.name : "Select Asset"}
                options={fromOptions}
                onClick={this.setFromAsset}
              />
              <InputButton
                // @ts-ignore
                label={"From Amount " + (availBalance !== 0 ? `(Avail: ${iNum(availBalance)})` : "")}
                placeholder="Enter amount"
                type="number"
                name="fromAmount"
                // @ts-ignore
                value={displayedFromAmount}
                onChange={this.onEnterFromAmount}
                error={this.fromAmountIsValid(availBalance)}
                readOnly={fromTicker === null}
                button={"max"}
                onClick={this.setSweepAll}
              />
              <Dropdown
                label={"To Asset"}
                placeholder="Select Asset"
                name="to_asset"
                value={toAsset ? toAsset.name : "Select Asset"}
                ticker={toTicker}
                options={toOptions}
                onClick={this.setToAsset}
              />
              <Input
                // @ts-ignore
                label="To Amount "
                placeholder="Enter amount"
                name="toAmount"
                type="number"
                value={displayedToAmount}
                onChange={this.onEnterToAmount}
                error={toTicker === null ? "Please select an asset first" : ""}
                readOnly={toTicker === null}
              />
            </Form>

            {selectedTab === ExchangeTab.Advanced && (
              <>
                <WideContainer>
                  <AddressDropdown
                    label="From Address (Optional)"
                    placeholder="Select from address"
                    name="from_address"
                    value={handleLabel}
                    address={truncated}
                    options={addresses}
                    onClick={this.selectAddress}
                    hideCreateAddress
                  />

                  <Description
                    label="Recipient Address (Optional)"
                    placeholder="Swap to another address"
                    name="externAddress"
                    type="text"
                    value={externAddress}
                    onChange={this.onEnterExternAddress}
                    error={this.recipientIsValid()}
                    rows="2"
                  />
                </WideContainer>
              </>
            )}
            <WideContainer>
              <ExchangeSummary
                xRate={this.props.xRate}
                fromAmount={iNum(fromAmount)}
                toAmount={iNum(toAmount)}
                conversionFee={iNum(conversionFee)}
                toTicker={toTicker}
                hasLatestXRate={hasLatestXRate}
                usingSpot={usingSpot}
                fee={this.calculateFeeEstimate()}
                fromTicker={fromTicker}
                selectedPrio={selectedPrio}
              />
              <Footer
                onClick={() => this.handleSubmit()}
                label="Preview"
                disabled={this.validateExchange(availBalance)}
                loading={this.props.isProcessingExchange}
              />
            </WideContainer>
          </Fragment>
        </Body>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: DesktopAppState) => ({
  xRate: selectXRate(state.blockHeaderExchangeRate, state.exchangeProcess.fromTicker, state.exchangeProcess.toTicker),
  nodeHeight: selectNodeHeight(state),
  isProcessingExchange: selectIsProcessingExchange(state.exchangeProcess),
  hasLatestXRate: hasLatestXRate(state),
  exchangeSucceed: selectExchangeSucceed(state.exchangeProcess),
  priceDelta: priceDelta(state),
  lastExchangeRates: selectLastExchangeRates(state),
  fromTicker: selectFromTicker(state.exchangeProcess),
  toTicker: selectToTicker(state.exchangeProcess),
  balances: state.xBalance,
  addresses: [ALL_ADDRESSES, ...state.address.entrys],
});

//@ts-ignore
const ConnectedExchangePage = connect(mapStateToProps, {
  createExchange,
  setToTicker,
  setFromTicker,
  showModal,
})(Exchange);

export const ExchangePage = () => {
  const navigate = useNavigate();
  const { asset } = useParams();
  return <ConnectedExchangePage navigate={navigate} fromAsset={asset as Ticker} />;
};
