// Library Imports
import React, { Component, Fragment } from "react";
import { OwnAddress } from "shared/pages/_wallet/receive/addresses";
// Relative Imports
import Body from "../../../components/_layout/body";
import Header from "../../../components/_layout/header";

export class Receive extends Component<any, any> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Fragment>
        <Body>
          <Header title="Receive" description="View and create new Zephyr Addresses" />
          <OwnAddress />
        </Body>
      </Fragment>
    );
  }
}
