// Library Imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { selectTheme } from "../../../actions";
// Relative Imports
import Body from "../../../components/_layout/body";
import Header from "../../../components/_layout/header";
import Input from "../../../components/_inputs/input";
import RevealSeed from "../../../components/_inputs/revealSeed";
import Form from "../../../components/_inputs/form";
import Theme from "../../../components/_inputs/theme";
import DoubleFooter from "../../../components/_inputs/double_footer";
import { Container } from "./styles";
import { storeKeyFileToDisk } from "platforms/web/actions/storage";
import { ZephyrAppState } from "platforms/desktop/reducers";
import { IKeys } from "typings";
import { isTemporaryWallet as selectIsTemporaryWallet } from "shared/reducers/walletSession";
import { selectSyncState } from "shared/reducers/chain";
import { SyncState } from "shared/types/types";

import { downloadTransfers } from "shared/actions/transferHistory";

// Address parts
import { AddressEntry } from "shared/reducers/address";
import { writeText } from "vendor/clipboard/clipboard-polyfill";
import { showModal } from "../../../actions/modal";
import { MODAL_TYPE } from "../../../reducers/modal";
import { selectSelectedAddress } from "../../../reducers/address";
import { setSelectedAddress } from "shared/actions/address";
import { setRestoreFromHeight } from "shared/actions/refresh";
import AddressDropdown from "../../../components/_inputs/addresses_dropdown/index.js";
import Description from "../../../components/_inputs/description";
import InputButton from "shared/components/_inputs/input_button";

const options = [
  { theme: "dark", value: "Dark Theme" },
  { theme: "light", value: "Light Theme" },
  { theme: "sepia", value: "Sepia Theme" },
];

interface SettingsProps extends IKeys {
  theme: any;
  selectTheme: (theme: any) => void;
  syncState: SyncState;
  wallet: any;
  storeKeyFileToDisk: (walletname: string) => void;
  downloadTransfers: (type: string) => void;
  tempWallet: boolean;
  selected: AddressEntry | undefined;
  addresses: AddressEntry[];
  showModal: (modalType: MODAL_TYPE) => void;
  setSelectedAddress: (index: number) => void;
  restoreHeight: number;
  setRestoreFromHeight: (height: number) => void;
}

interface SettingsState {
  status: boolean;
  value: string;
  reveal: boolean;
  validated: boolean;
  psk: string;
  seed: string;
  synced: boolean;
  copyButtonState: string;
  refreshFromHeight: number;
}

class SettingsPage extends Component<SettingsProps, SettingsState> {
  state: SettingsState = {
    status: false,
    value: "",
    reveal: false,
    validated: true,
    psk: "",
    seed: "",
    synced: true,
    copyButtonState: "Copy",
    refreshFromHeight: this.props.restoreHeight,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({
      value: this.props.theme.value,
    });
  }

  handleClick = ({ theme, value }: { theme: string; value: string }) => {
    this.props.selectTheme(theme);
    this.setState({
      value: value,
    });
  };

  toggleVisibility = () => {
    this.setState({
      reveal: !this.state.reveal,
    });
  };

  downloadKeystore = () => {
    this.props.storeKeyFileToDisk(this.props.wallet.activeWallet);
  };

  selectAddress = (selected: AddressEntry) => {
    this.props.setSelectedAddress(selected.index);
  };

  clipboardAddress = () => {
    const { address } = this.props.selected!;

    this.setState({
      copyButtonState: "Copied...",
    });

    writeText(address);

    setTimeout(() => {
      this.setState({
        copyButtonState: "Copy",
      });
    }, 1000);
  };

  showQRCodeModal = () => {
    this.props.showModal(MODAL_TYPE.ShowQRCode);
  };

  showAddressModal = () => {
    this.props.showModal(MODAL_TYPE.ShowAddressModal);
  };

  downloadTxJson = () => {
    this.props.downloadTransfers("json");
  };

  downloadTxCsv = () => {
    this.props.downloadTransfers("csv");
  };

  onChangeRestoreFromHeight = (event: any) => {
    this.setState({
      refreshFromHeight: event.target.value,
    });
  };

  updateRestoreFromHeight = (event: any) => {
    const height = Number(this.state.refreshFromHeight);
    this.props.setRestoreFromHeight(height);
  };

  render() {
    const { value, reveal } = this.state;
    const seed = this.props.mnemonic;
    if (seed.length > 0) {
      const first = seed.substring(0, 32);
      const last = seed.substring(seed.length - 32);
    }

    const { isSyncing } = this.props.syncState;

    const windowWidth = window.innerWidth;

    if (this.props.addresses.length === 0) {
      return null;
    }

    const { selected, addresses } = this.props;

    const handleLabel = selected!.label === undefined ? `Address ${selected!.index}` : selected!.label;

    const first = selected!.address.substring(0, 4);
    const last = selected!.address.substring(selected!.address.length - 4);
    const truncated = first + "...." + last;

    return (
      <Body>
        <Header title="Theme " description="Choose between light and dark themes" />
        <Form>
          <Theme
            label="Select Theme"
            placeholder="Dark Theme"
            name="value"
            value={value}
            options={options}
            onClick={this.handleClick}
          />
        </Form>
        <Header title="Refresh Height" description="Choose the block from which your wallet starts syncing from" />
        <InputButton
          type="number"
          label="Restore From Height"
          placeholder="Restore From Height"
          name="restoreHeight"
          button="Update"
          value={this.state.refreshFromHeight.toString()}
          onChange={this.onChangeRestoreFromHeight}
          onClick={this.updateRestoreFromHeight}
        />
        <Header title="Transaction History" description="Download your transaction history" />
        <>
          <Container>
            <DoubleFooter
              // Left Section
              leftLabel={"Download JSON"}
              leftDisabled={false}
              leftLoading={false}
              leftOnClick={this.downloadTxJson}
              leftVisible={true}
              // Right Section
              rightLabel={"Download CSV"}
              rightDisabled={false}
              rightLoading={false}
              rightOnClick={this.downloadTxCsv}
            />
          </Container>
        </>

        <Header title="Private Keys" description="Manage your wallet's private keys" />
        <Form>
          <>
            {reveal ? (
              <RevealSeed label="Seed Phrase" name="Seed Phrase" error="" value={this.props.mnemonic} readOnly />
            ) : (
              <Input
                name="Seed Phrase"
                placeholder=""
                label="Seed Phrase"
                width={true}
                value={this.props.mnemonic}
                readOnly
                type={reveal ? "type" : "password"}
              />
            )}
            <Input
              name="Public View Key"
              placeholder=""
              label="Public View Key"
              width={true}
              value={this.props.publicView}
              readOnly
              type={reveal ? "type" : "password"}
            />
            <Input
              name="Private View Key"
              placeholder=""
              label="Private View Key"
              width={true}
              value={this.props.privateView}
              readOnly
              type={reveal ? "type" : "password"}
            />
            <Input
              name="Private Spend Key"
              placeholder=""
              label="Private Spend Key"
              width={true}
              value={this.props.privateSpend}
              readOnly
              type={reveal ? "type" : "password"}
            />
            <Input
              name="Public Spend Key"
              placeholder=""
              label="Public Spend Key"
              width={true}
              value={this.props.publicSpend}
              readOnly
              type={reveal ? "type" : "password"}
            />
          </>
        </Form>
        <Container>
          <DoubleFooter
            // Left section
            leftLabel={"Download Wallet File"}
            leftDisabled={isSyncing || this.props.tempWallet}
            leftLoading={false}
            leftOnClick={this.downloadKeystore}
            leftVisible={!this.props.tempWallet}
            // Right section
            rightLabel={this.state.reveal ? "Hide Keys" : "Show Keys"}
            rightDisabled={isSyncing ? true : false}
            rightLoading={false}
            rightOnClick={this.toggleVisibility}
          />
        </Container>
      </Body>
    );
  }
}

const mapStateToProps = (state: ZephyrAppState) => ({
  selected: selectSelectedAddress(state),
  addresses: state.address.entrys,
  theme: state.theme,
  syncState: selectSyncState(state),
  wallet: state.walletSession,
  tempWallet: selectIsTemporaryWallet(state),
  restoreHeight: state.walletSession.restoreHeight,
});

export const Settings = connect(mapStateToProps, {
  selectTheme,
  showModal,
  setSelectedAddress,
  storeKeyFileToDisk,
  downloadTransfers,
  setRestoreFromHeight,
})(SettingsPage);
