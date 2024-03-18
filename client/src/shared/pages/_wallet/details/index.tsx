// Library Imports
import React, { Component } from "react";
// Relative Imports
import Body from "../../../components/_layout/body";
import { BalanceContainer } from "shared/components/balance-container";

interface DetailsProps {
  balance: number;
  unlockedBalance: number;
  lockedBalance: number;
  price: number;
  value: number;
  assetId: string;
  spot: number;
  ma: number;
}

export class Details extends Component<DetailsProps, any> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Body>
        <BalanceContainer {...this.props} />
        {this.props.children}
      </Body>
    );
  }
}
