// Library Imports
import React, { Component } from "react";
// Relative Imports
import { Detail, DetailBox, DetailSection } from "./styles";
import { Ticker } from "shared/reducers/types";

class BalanceDetailSection extends Component<any, any> {
  render() {
    const { assetId, balance, unlockedBalance, lockedBalance, spot, ma } = this.props;
    const spotString = assetId === Ticker.ZEPH ? `$${spot.toFixed(4)}` : `${spot.toFixed(4)} ƵEPH`;
    const maString = assetId === Ticker.ZEPH ? `$${ma.toFixed(4)}` : `${ma.toFixed(4)} ƵEPH`;

    const displayBalance = (balance: number, useTwoDP = false) => {
      return useTwoDP
        ? balance
            .toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
            .replace("$", "")
        : balance
            .toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 12,
              maximumFractionDigits: 12,
            })
            .replace("$", "");
    };

    return (
      <>
        <DetailBox>
          <DetailSection>
            <Detail>Total Balance:</Detail>
            {lockedBalance ? <Detail>Locked Balance:</Detail> : null}
            <Detail>Unlocked Balance:</Detail>
          </DetailSection>
          <DetailSection>
            <Detail>{displayBalance(balance)}</Detail>
            {lockedBalance ? <Detail>{displayBalance(lockedBalance)}</Detail> : null}
            <Detail>{displayBalance(unlockedBalance)}</Detail>
          </DetailSection>
        </DetailBox>
        <DetailBox>
          <DetailSection>
            <Detail>Spot:</Detail>
            <Detail>24hr avg:</Detail>
          </DetailSection>
          <DetailSection>
            <Detail>{spotString}</Detail>
            <Detail>{maString}</Detail>
          </DetailSection>
        </DetailBox>
      </>
    );
  }
}

export default BalanceDetailSection;
