import React, { Component } from "react";
import { connect } from "react-redux";
import { Details } from "shared/pages/_wallet/details";
import { Ticker } from "shared/reducers/types";
import { convertBalanceToMoney } from "utility/utility";
import { TxHistoryDesktop } from "shared/components/tx-history/container";
import { XBalances } from "shared/reducers/xBalance";
import { BlockHeaderRate, selectXRate } from "shared/reducers/blockHeaderExchangeRates";
import { ZephyrAppState } from "platforms/desktop/reducers";
import { useParams } from "react-router";

interface DetailsProps {
  balances: XBalances;
  rates: BlockHeaderRate[];
}

interface RouteProps {
  assetId: Ticker;
}

class DetailsContainer extends Component<DetailsProps & RouteProps, any> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const ticker = this.props.assetId;
    let xRate = selectXRate(this.props.rates, ticker, Ticker.ZEPHUSD, true);
    if (ticker === Ticker.ZEPHRSV) {
      xRate = selectXRate(this.props.rates, Ticker.ZEPHRSV, Ticker.ZEPH);
    }

    const latestBlockerHeader: BlockHeaderRate = this.props.rates[this.props.rates.length - 1];
    let spot = latestBlockerHeader?.stable?.toJSNumber() / Math.pow(10, 12) ?? 0;
    let ma = latestBlockerHeader?.stable_ma?.toJSNumber() / Math.pow(10, 12) ?? 0;

    if (ticker === Ticker.ZEPH) {
      spot = latestBlockerHeader?.spot?.toJSNumber() / Math.pow(10, 12) ?? 0;
      ma = latestBlockerHeader?.moving_average?.toJSNumber() / Math.pow(10, 12) ?? 0;
    }

    let balance: number = convertBalanceToMoney(this.props.balances[ticker].balance, 12);
    let unlockedBalance: number = convertBalanceToMoney(this.props.balances[ticker].unlockedBalance, 12);
    let lockedBalance: number = convertBalanceToMoney(this.props.balances[ticker].lockedBalance, 12);
    let value = balance * xRate;
    if (ticker === Ticker.ZEPHRSV) {
      const spotRate = selectXRate(this.props.rates, Ticker.ZEPH, Ticker.ZEPHUSD, true);
      value *= spotRate;

      spot = latestBlockerHeader?.reserve?.toJSNumber() / Math.pow(10, 12) ?? 0;
      ma = latestBlockerHeader?.reserve_ma?.toJSNumber() / Math.pow(10, 12) ?? 0;
    }

    const detailProps = { assetId: ticker, value, balance, unlockedBalance, lockedBalance, price: xRate, spot, ma };
    return (
      <Details {...detailProps}>
        <TxHistoryDesktop assetId={ticker} />
      </Details>
    );
  }
}

const mapStateToProps = (state: ZephyrAppState) => ({
  balances: state.xBalance,
  rates: state.blockHeaderExchangeRate,
});

const ZephyrDetails = connect(mapStateToProps, {})(DetailsContainer);

export const ZephyrDetailWithParams = () => {
  const { id } = useParams();
  return <ZephyrDetails assetId={id as Ticker} />;
};
