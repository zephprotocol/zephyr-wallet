import { selectErrorMessageForLogin, selectIsLoggedIn } from "shared/reducers/walletSession";
import { selectisRequestingWalletCreation, selectIsWalletCreated } from "shared/reducers/walletCreation";
import { connect } from "react-redux";
import { restoreWalletByMnemomic } from "shared/actions/walletCreation";
import { Navigate } from "react-router";
import React, { Component } from "react";
import { Information } from "assets/styles/type";
import VerifySeed from "shared/components/_create/verify_seed";
import { Buttons, Submit } from "../multi_login/styles";
import { Spinner } from "shared/components/spinner";
import { Body, Wrapper, Url } from "./styles";
import Input from "shared/components/_inputs/input";
import { DesktopAppState } from "../../../reducers";
import InputButton from "shared/components/_inputs/input_button";
import { startWalletSession } from "shared/actions/walletSession";
import Form from "../../../../../shared/components/_inputs/form";

interface RestoreProps {
  restoreWalletByMnemomic: (
    path: string | undefined,
    seed: string,
    pw: string,
    walletName: string | undefined,
    restoreHeight?: number,
  ) => void;
  isLoggedIn: boolean;
  isRequestingLogin: boolean;
  errorMessage: string;
  isWalletCreated: boolean;
  startWalletSession: (walletName: string | undefined) => void;
}

enum RESTORE_STEP {
  SEED_STEP,
  NAME_STEP,
}

interface RestoreState {
  step: RESTORE_STEP;
  error: string | undefined;
  seed: string;
  pw: string;
  restoreHeight: number | undefined;
  name: string;
  showPassword: boolean;
}

class RestoreDesktopContainer extends Component<RestoreProps, RestoreState> {
  state: RestoreState = {
    step: RESTORE_STEP.SEED_STEP,
    error: undefined,
    seed: "",
    pw: "",
    name: "",
    restoreHeight: undefined,
    showPassword: false,
  };

  componentDidUpdate(prevProps: Readonly<RestoreProps>, prevState: Readonly<RestoreState>, snapshot?: any): void {
    if (prevProps.errorMessage === "" && this.props.errorMessage) {
      this.setState({ error: this.props.errorMessage });
      setTimeout(() => this.setState({ error: "" }), 2000);
    }

    if (prevProps.isWalletCreated === false && this.props.isWalletCreated) {
      this.props.startWalletSession(this.state.name);
    }
  }

  onRestoreWallet = () => {
    const { seed, pw, name, restoreHeight } = this.state;

    if (!seed || !name || !pw) {
      return;
    }

    this.validateNameAndPW();

    this.props.restoreWalletByMnemomic(name, seed, pw, name, restoreHeight);
  };

  onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value: string = e.currentTarget.value;
    this.setState<never>({ [name]: value });
  };

  onSetRestoreHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    let value: number = e.currentTarget.valueAsNumber;
    value = value < 0 ? 0 : value;
    this.setState<never>({ [name]: value });
  };

  onBack() {
    this.setState({ step: RESTORE_STEP.SEED_STEP });
  }

  onContinue() {
    this.validateSeed();
    this.setState({ step: RESTORE_STEP.NAME_STEP });
  }

  validateSeed() {}

  validateNameAndPW() {}

  togglePassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  render() {
    const windowWidth = window.innerWidth;
    const { error, step, seed, name, pw } = this.state;

    if (this.props.isLoggedIn) {
      return <Navigate to="/wallet/assets" />;
    }

    return (
      <>
        {step === RESTORE_STEP.SEED_STEP && (
          <Wrapper>
            <Body>
              <VerifySeed
                label="Seed Phrase"
                placeholder="Enter your 25 word seed phrase..."
                name="seed"
                value={seed}
                error={error}
                rows={windowWidth < 600 ? "6" : "4"}
                onChange={this.onChangeHandler}
              />
              <Information>
                Restore your wallet by entering your 25 word seed phrase. This process will generate an encrypted wallet
                file that enables you to store, send and convert assets in complete privacy.
              </Information>
            </Body>
            <Buttons buttons="single">
              <Submit onClick={() => this.onContinue()} disabled={seed.length > 0 ? false : true}>
                Restore
              </Submit>
            </Buttons>
          </Wrapper>
        )}

        {step === RESTORE_STEP.NAME_STEP && (
          <Wrapper>
            <Body>
              <Form>
                <Input
                  label="Wallet Name"
                  placeholder="Create a wallet name"
                  name="name"
                  type={"text"}
                  value={name}
                  onChange={this.onChangeHandler}
                />
                <Input
                  // @ts-ignore
                  label="Restore Height (Optional)"
                  placeholder="Enter restore height"
                  name="restoreHeight"
                  value={this.state.restoreHeight}
                  onChange={this.onSetRestoreHeight}
                  type="number"
                />
              </Form>
              <InputButton
                // @ts-ignore
                label="Wallet Password"
                placeholder="Enter wallet password"
                name="pw"
                type={this.state.showPassword === true ? "text" : "password"}
                button={this.state.showPassword === true ? "hide" : "show"}
                value={this.state.pw}
                onChange={this.onChangeHandler}
                onClick={this.togglePassword}
              />
              <Information>
                Create a unique name and strong password for your wallet file. If you lose your wallet file you can
                always restore it with the 25 word seed phrase you entered on the previous step. Store your password in
                a safe location such as a password manager. Lastly, you can save sync time by entering your restore
                height above.
              </Information>
            </Body>
            <Buttons buttons="single">
              <Submit disabled={!(name.length > 0 && pw.length > 0)} onClick={() => this.onRestoreWallet()}>
                {this.props.isRequestingLogin ? <Spinner /> : "Finish"}
              </Submit>
            </Buttons>
          </Wrapper>
        )}
      </>
    );
  }
}

// @ts-ignore
const mapStateToProps = (state: DesktopAppState) => ({
  isRequestingLogin: selectisRequestingWalletCreation(state),
  isLoggedIn: selectIsLoggedIn(state),
  errorMessage: selectErrorMessageForLogin(state),
  isWalletCreated: selectIsWalletCreated(state),
});

// @ts-ignore
export const RestoreDesktop = connect(mapStateToProps, {
  restoreWalletByMnemomic,
  startWalletSession,
})(RestoreDesktopContainer);
