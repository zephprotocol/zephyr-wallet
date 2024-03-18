// Library Imports
import React, { Component } from "react";
// Relative Imports
import Header from "../_layout/header";
import { Row } from "./styles";
import { connect } from "react-redux";
import { PRICE_RANGE_MONTH } from "../../reducers/priceHistory";
import { getPriceHistory } from "../../actions";
import BalanceDetailSection from "./detail-section";
import { convertToNewTicker } from "utility/utility";

class BalanceWrapper extends Component<any, any> {
  state = { selectedRangeInDays: PRICE_RANGE_MONTH };

  componentDidMount() {
    this.selectPriceHistory(PRICE_RANGE_MONTH);
  }

  selectPriceHistory(rangeInDays: number | string) {
    this.props.getPriceHistory(rangeInDays);
    this.setState({ selectedRangeInDays: rangeInDays });
  }

  render() {
    const { assetId } = this.props;
    return (
      <>
        <Header back title={`${convertToNewTicker(assetId)} Balance`} description="" />
        <Row>
          <BalanceDetailSection {...this.props} />
        </Row>
      </>
    );
  }
}

const mapStateToProps = (state: any) => ({
  priceHistory: state.priceHistory,
});

export const BalanceContainer = connect(mapStateToProps, { getPriceHistory })(BalanceWrapper);
