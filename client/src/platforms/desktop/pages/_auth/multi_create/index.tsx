// Library Imports
import React, { Component } from "react";

// Relative Imports
import { Container, Main, Header, Footer, Route, Label, Tabs, Tab, Title, Description } from "./styles";
import { RestoreDesktop } from "../restore";
import { DesktopAppState } from "../../../reducers";
import { connect } from "react-redux";
import { selectIsLoggedIn } from "../../../../../shared/reducers/walletSession";
import { Navigate } from "react-router";
import { CreateDesktop } from "../create";

interface MultiloginState {
  loginType: LOGIN_TYPE;
}

interface MultiLoginProps {
  isLoggedIn: boolean;
}

enum LOGIN_TYPE {
  Open,
  Create,
  Restore,
}

class MultiLoginPage extends Component<MultiLoginProps, MultiloginState> {
  state: MultiloginState = {
    loginType: LOGIN_TYPE.Create,
  };

  selectRestore = () => {
    this.setState({
      loginType: LOGIN_TYPE.Restore,
    });
  };

  selectCreate = () => {
    this.setState({
      loginType: LOGIN_TYPE.Create,
    });
  };

  render() {
    if (this.props.isLoggedIn) {
      return <Navigate to="/wallet/assets" />;
    }

    const { loginType } = this.state;

    return (
      <Container>
        <Header>
          <Title>{loginType === 2 ? "Restore Wallet" : "Create a Wallet"}</Title>
          <Description>Privately store, exchange and transfer assets.</Description>
        </Header>
        <Tabs>
          <Tab active={loginType === LOGIN_TYPE.Create} onClick={this.selectCreate}>
            Create
          </Tab>
          <Tab active={loginType === LOGIN_TYPE.Restore} onClick={this.selectRestore}>
            Restore
          </Tab>
        </Tabs>
        <Main>
          {loginType === LOGIN_TYPE.Restore && <RestoreDesktop />}
          {loginType === LOGIN_TYPE.Create && <CreateDesktop />}
        </Main>
        <Footer>
          <Label>Have a Wallet?</Label>
          <Route to={"/"}>Login</Route>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = (state: DesktopAppState) => ({
  isLoggedIn: selectIsLoggedIn(state),
});

export const MultiCreateDesktop = connect(mapStateToProps)(MultiLoginPage);
