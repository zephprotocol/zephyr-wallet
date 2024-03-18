import { ZephyrAppState } from "platforms/desktop/reducers";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Receive } from "shared/pages/_wallet/receive";
import { Ticker } from "shared/reducers/types";
import { useNavigate } from "react-router";

class Container extends Component<any, any> {
  render() {
    return (
      //@ts-ignore
      <Receive addresses={this.props.address} />
    );
  }
}

export const mapStateToProps = (state: ZephyrAppState) => ({
  address: state.address,
});

const ConnectedReceivePage = connect(mapStateToProps, {})(Container);

export const ZephyrReceive = () => {
  const navigate = useNavigate();
  return <ConnectedReceivePage navigate={navigate} />;
};
