import React, { Component } from "react";
import Chart from "../chart";
import { connect } from "react-redux";
import { PRICE_RANGE_MONTH } from "../../reducers/priceHistory";
import { getPriceDates, getPriceValues } from "utility/utility";
import { getPriceHistory } from "../../actions";
import { PriceRangeHistory } from "shared/reducers/xPriceHistory";
import { Ticker } from "shared/reducers/types";

class ChartWrapper extends Component<any, any> {
  state = { selectedRangeInDays: PRICE_RANGE_MONTH };

  componentDidMount() {
    this.selectPriceHistory(PRICE_RANGE_MONTH);
  }

  selectPriceHistory(rangeInDays: number | string) {
    this.props.getPriceHistory(rangeInDays);
    this.setState({ selectedRangeInDays: rangeInDays });
  }

  render() {
    const { assetId, price } = this.props;

    let prices = [];
    let labels;

    if (assetId === Ticker.ZEPH) {
      const priceRangeEntry = this.props.priceHistory.prices.find(
        (priceRangeEntry: PriceRangeHistory) => priceRangeEntry.rangeInDays === this.state.selectedRangeInDays,
      );

      prices = getPriceValues(priceRangeEntry.prices);
      labels = getPriceDates(priceRangeEntry.prices);
    } else if (assetId === Ticker.ZEPHUSD) {
      prices = [1.0, 1.0];
      labels = [new Date(1792, 3, 2).toLocaleDateString(), new Date().toLocaleDateString()];
    }

    const lastPrice = price ? price : prices[prices.length - 1];

    return (
      <Chart
        prices={prices}
        labels={labels}
        ticker={assetId}
        price={lastPrice ? lastPrice.toFixed(2) : 0}
        onChangePriceRange={(args: number | string) => this.selectPriceHistory(args)}
      />
    );
  }
}

const mapStateToProps = (state: any) => ({
  priceHistory: state.priceHistory,
});

export const ChartContainer = connect(mapStateToProps, { getPriceHistory })(ChartWrapper);
