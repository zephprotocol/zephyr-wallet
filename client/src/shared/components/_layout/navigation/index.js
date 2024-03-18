// Library Imports
import React, { Component } from "react";
import { connect } from "react-redux";

// Relative Imports
import { Container, Zephyr, Logo, Brand, Button, Logout, Tag } from "./styles.js";
import Icon from "../../../../assets/icons/zephyr.png";
import { closeWallet } from "../../../closeWallet";
import { selectIsLoggedIn } from "shared/reducers/walletSession";
import { APP_VERSION, NET_TYPE_NAME } from "../../../../constants/env";

class Navigation extends Component {
  handleLogout = () => {
    this.props.logout();
  };

  render() {
    const auth = this.props.isLoggedIn;

    return (
      <Container>
        <Brand to={auth ? "/wallet/assets" : "/"}>
          <Logo src={Icon} />
          <Zephyr>ZEPHYR</Zephyr>
          <Tag>
            v{APP_VERSION} {NET_TYPE_NAME}
          </Tag>
        </Brand>
        {!auth ? <Button to="/login">Login</Button> : <Logout onClick={this.handleLogout}>Logout</Logout>}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: selectIsLoggedIn(state),
});

export default connect(mapStateToProps, { logout: closeWallet })(Navigation);
