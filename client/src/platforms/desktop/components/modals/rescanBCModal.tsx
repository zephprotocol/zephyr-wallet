import * as React from "react";
import { Modal } from "shared/components/modal";
import { ZephyrAppState } from "platforms/desktop/reducers/index.js";
import { connect } from "react-redux";
import { hideModal } from "shared/actions/modal";
import Rescan from "../../../../shared/components/rescan";
import { syncFromFirstIncomingTx, rescanSpent } from "../../../../shared/actions/refresh";

class RescanBCM extends React.Component<any, any> {
  state = {
    isLoading: this.props.isLoading ?? false,
  };

  startRescan = (e: any) => {
    this.setState({
      isLoading: true,
    });

    // Add scan function here
    this.props.syncFromFirstIncomingTx();
  };

  render() {
    const { isLoading } = this.state;
    return (
      <Modal
        title="Rescan Wallet"
        description="Detect and clear stuck transactions"
        leftButton={"Cancel"}
        rightButton="Refresh"
        disabledLeft={isLoading ? true : false}
        disabledRight={isLoading ? true : false}
        isLoading={isLoading}
        onConfirm={(e: any) => this.startRescan(e)}
        onCancel={() => this.onCancel()}
      >
        <Rescan isLoading={isLoading} />
      </Modal>
    );
  }

  onCancel() {
    this.props.hideModal();
  }
}

const mapStateToProps = (state: ZephyrAppState) => ({
  restoreHeight: state.walletSession.restoreHeight,
});

export const RescanBCMModal = connect(mapStateToProps, {
  syncFromFirstIncomingTx,
  rescanSpent,
  hideModal,
})(RescanBCM);
