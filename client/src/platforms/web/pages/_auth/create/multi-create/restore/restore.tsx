// Library Imports
import React, { Component } from "react";

// Relative Imports
import MultiRestore from "shared/components/_auth/multi-restore";
import Input from "shared/components/_inputs/input";
import Toggle from "shared/components/_inputs/toggle";
import { Information } from "assets/styles/type.js";
import VerifySeed from "shared/components/_create/verify_seed";
import InputButton from "shared/components/_inputs/input_button";
import { connect } from "react-redux";
import { selectisRequestingWalletCreation, selectErrorMessageForWalletCreation } from "shared/reducers/walletCreation";
import { WebAppState } from "platforms/web/reducers";
import { storeKeyFileToDisk } from "platforms/web/actions/storage";
import { restoreWalletByMnemomic } from "shared/actions/walletCreation";
import { startWalletSession } from "shared/actions/walletSession";
import { selectIsLoggedIn } from "shared/reducers/walletSession";
import { MoneroUtils } from "zephyr-javascript";
import Checkbox from "../../../../../../../shared/components/checkbox";
import { Navigate } from "react-router";
import Form from "../../../../../../../shared/components/_inputs/form";

interface RestoreProps {
  walletName: string;
  isRequestingLogin: boolean;
  walletIsCreated: boolean;
  isLoggedIn: boolean;
  errorMessage: string;
  startWalletSession: (fileName: string | undefined) => void;
  storeKeyFileToDisk: (walletname: string) => void;
  restoreWalletByMnemomic: (
    path: string | undefined,
    mnemomic: string,
    password: string,
    walletName: string | undefined,
    restoreHeight: number | undefined,
  ) => void;
}

interface RestoreState {
  step: number;
  error: string;
  vault_name: string;
  reveal: boolean;
  mnemomic: string;
  action: string;
  create_vault_name: string;
  create_vault_password: string;
  check_vault_password: string;
  validationSucceed: boolean;
  checked: boolean;
  disabled: boolean;
  restore_height: number | undefined;
}

class RestoreWeb extends Component<RestoreProps, RestoreState> {
  state: RestoreState = {
    step: 1,
    error: "",
    action: "Paste Seed",
    vault_name: "",
    reveal: false,
    mnemomic: "",
    // Create Vault
    create_vault_name: "",
    create_vault_password: "",
    check_vault_password: "",
    validationSucceed: false,
    checked: false,
    disabled: false,
    restore_height: undefined,
  };

  componentDidUpdate(prevProps: RestoreProps, prevState: RestoreState) {
    if (this.props.walletIsCreated && this.state.step === 2) {
      this.setState({ step: 3 });
    }

    if (prevProps.errorMessage === "" && this.props.errorMessage) {
      this.setState({ error: this.props.errorMessage });
      setTimeout(() => this.setState({ error: "" }), 2000);
    }
  }

  nextRestoreStep = () => {
    const { step } = this.state;

    if (step === 1) {
      try {
        MoneroUtils.validateMnemonic(this.state.mnemomic);
      } catch (e: any) {
        this.setState({ error: e.message });
        setTimeout(() => {
          this.setState({ error: "" });
        }, 2000);
        return;
      }
    }

    if (step === 2) {
      this.props.restoreWalletByMnemomic(
        undefined,
        this.state.mnemomic,
        this.state.create_vault_password,
        this.state.create_vault_name,
        this.state.restore_height,
      );
      return;
    }

    // Until step three incremennt the steps
    if (step < 4) {
      this.setState({ step: step + 1 });
    }

    // On step three, if seed is invalid display error messsage for 2s
    else if (step === 4) {
      const { check_vault_password, create_vault_password } = this.state;

      const validationSucceed = check_vault_password.trim() === create_vault_password.trim();

      if (validationSucceed) {
        this.props.startWalletSession(this.props.walletName);
      } else {
        this.setState({ error: "Sorry, that password is incorrect" });
      }
    }
  };

  prevRestoreStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  };

  handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState<never>({
      [name]: value,
    });
  };

  handleRestoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    let value: number = e.currentTarget.valueAsNumber;
    value = value < 0 ? 0 : value;
    this.setState<never>({
      [name]: value,
    });
  };

  showPassword = () => {
    this.setState({
      reveal: !this.state.reveal,
    });
  };

  downloadedFile = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  onDownLoad = (event: any) => {
    this.props.storeKeyFileToDisk(this.props.walletName);
  };

  handleRestoreFlow = () => {
    const windowWidth = window.innerWidth;
    const { step, mnemomic, error } = this.state;

    switch (step) {
      case 1:
        return (
          <>
            <VerifySeed
              label="Enter Seed Phrase"
              name="mnemomic"
              placeholder="Enter your 25 word seed phrase"
              value={mnemomic}
              error={error}
              rows={windowWidth < 600 ? "6" : "4"}
              action={this.state.action}
              onChange={this.handleChange}
            />
            <Information>
              Enter your 25 word seed phrase to generate a new wallet file. This is an encrypted file, with a unique
              name and password. A restore requires a full chain sync and can take ~2.5hrs. An alternative approach is
              to create a new wallet to use within the web wallet, which is much quicker, and then transferring your
              funds into that new wallet.
            </Information>
          </>
        );
      case 2:
        return (
          <>
            <Form>
              <Input
                label="Wallet Name"
                type="text"
                placeholder="Create a wallet name"
                name="create_vault_name"
                value={this.state.create_vault_name}
                onChange={this.handleChange}
              />
              <Input
                // @ts-ignore
                label="Restore Height (Optional)"
                placeholder="Enter restore height"
                name="restore_height"
                type="number"
                value={this.state.restore_height}
                onChange={this.handleRestoreChange}
              />
            </Form>

            <Toggle
              label="Wallet Password"
              placeholder="Create a wallet password"
              name="create_vault_password"
              type={this.state.reveal === true ? "text" : "password"}
              reveal={this.state.reveal}
              value={this.state.create_vault_password}
              onChange={this.handleChange}
              onClick={this.showPassword}
              readOnly={false}
              onKeyUp={() => {}}
              error={error}
              width
            />

            <Information>
              Create a unique name and strong password for your wallet file. You will be asked to confirm this password
              on the final step. If you lose your wallet file you can always restore it with the 25 word seed phrase you
              entered on the previous step.
            </Information>
          </>
        );
      case 3:
        return (
          <>
            <InputButton
              label="Wallet File"
              name="Wallet File"
              placeholder="Error"
              value={this.props.walletName}
              button={"Save"}
              type="text"
              readOnly={true}
              onClick={this.onDownLoad}
            />
            <Checkbox
              label="I have saved my wallet file to my device"
              checked={this.state.checked}
              onChange={this.downloadedFile}
            />
            <Information>
              A wallet file uses military grade encryption to secure your assets. Store this file in a safe location. To
              avoid permanent loss of assets, never share your seed phrase, wallet file or password with anyone.
            </Information>
          </>
        );
      case 4:
        return (
          <>
            <Toggle
              label="Wallet Password"
              placeholder="Re-enter your wallet password"
              name="check_vault_password"
              type={this.state.reveal === true ? "text" : "password"}
              reveal={this.state.reveal}
              value={this.state.check_vault_password}
              onChange={this.handleChange}
              onClick={this.showPassword}
              error={error}
              onKeyUp={() => {}}
              readOnly={false}
              width
            />
            <Information>
              Re-enter the password you used to create this wallet file. If you have forgotten it, please start again. A
              wallet requires both the wallet file and valid password to access.
            </Information>
          </>
        );
      default:
    }
  };

  render() {
    if (this.props.isLoggedIn) {
      return <Navigate to="/wallet/assets" />;
    }

    const { step } = this.state;
    return (
      <MultiRestore
        title="Create a Wallet"
        link="/login"
        route="Login"
        label="Have a Wallet?"
        step={step}
        nextStep={this.nextRestoreStep}
        prevStep={this.prevRestoreStep}
        loading={this.props.isRequestingLogin}
        disabled={step === 3 && !this.state.checked}
      >
        {this.handleRestoreFlow()}
      </MultiRestore>
    );
  }
}

const mapStateToProps = (state: WebAppState) => ({
  walletName: state.walletCreation.name,
  isRequestingLogin: selectisRequestingWalletCreation(state),
  walletIsCreated: state.walletCreation.isCreated,
  isLoggedIn: selectIsLoggedIn(state),
  errorMessage: selectErrorMessageForWalletCreation(state),
});

export const RestoreWebComponent = connect(mapStateToProps, {
  restoreWalletByMnemomic,
  storeKeyFileToDisk,
  startWalletSession,
})(RestoreWeb);
