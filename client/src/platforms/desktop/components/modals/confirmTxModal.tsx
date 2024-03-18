import * as React from "react";
import { Modal } from "shared/components/modal";
import { Transaction } from "shared/components/_transactions/transfer";
import { DesktopAppState } from "platforms/desktop/reducers";
import { connect } from "react-redux";
import { hideModal } from "shared/actions/modal";
import { confirmTransfer, resetTransferProcess } from "shared/actions/transfer";
import { TxProcessInfo } from "shared/reducers/transferProcess";
import { convertBalanceToMoney, iNum } from "utility/utility";

interface ConfirmTxModalProps {
  transfer: TxProcessInfo;
  confirmTransfer: (metaList: Array<string>) => void;
  resetTransferProcess: () => void;
  hideModal: () => void;
}

class ConfirmTxModal extends React.Component<ConfirmTxModalProps, any> {
  state = {
    checked: false,
    loading: false,
  };

  approveTransfer = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  render() {
    const { fromTicker, fromAmount, address, fee } = this.props.transfer;

    const readableFee = convertBalanceToMoney(fee!, 6);
    const readableAmount = convertBalanceToMoney(fromAmount!, 6);

    return (
      <Modal
        title="Transfer Confirmation"
        description="Please review and confirm your transaction"
        leftButton="Cancel"
        rightButton="Confirm"
        disabledRight={!this.state.checked}
        disabledLeft={false}
        isLoading={this.state.loading}
        onConfirm={() => this.onConfirm()}
        onCancel={() => this.onCancel()}
      >
        <Transaction
          onChange={this.approveTransfer}
          checked={this.state.checked}
          recipientAddress={address}
          ticker={fromTicker}
          transferAmount={iNum(readableAmount)}
          fee={iNum(readableFee)}
        />
      </Modal>
    );
  }

  onCancel() {
    this.props.hideModal();
    this.props.resetTransferProcess();
  }

  onConfirm() {
    const { metaList } = this.props.transfer;

    this.setState({
      loading: true,
    });
    setTimeout(() => {
      this.props.confirmTransfer(metaList);
    }, 3000);
  }
}

const mapStateToProps = (state: DesktopAppState) => ({
  transfer: state.transferProcess,
});

export const ConfirmTxModalDesktop = connect(mapStateToProps, {
  confirmTransfer,
  hideModal,
  resetTransferProcess,
})(ConfirmTxModal);
