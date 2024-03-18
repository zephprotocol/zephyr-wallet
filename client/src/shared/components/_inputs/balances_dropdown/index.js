import React from "react";
// import "./styles.css";
import {
  Container,
  Select,
  Wrapper,
  Item,
  Button,
  Labels,
  Name,
  Row,
  Ticker
} from "./styles";
import { Label, Error } from "../../../../assets/styles/type.js";

class BalanceDropdown extends React.Component {
  state = {
    displayMenu: false,
    selected: this.props.placeholder
  };

  showDropdownMenu = event => {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
      document.addEventListener("click", this.hideDropdownMenu);
    });
  };

  hideDropdownMenu = () => {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener("click", this.hideDropdownMenu);
    });
  };

  renderOptions = () => {
    const { onClick, options } = this.props;
    return options.map(option => {
      const { ticker, value, code } = option;
      return (
        <Item key={ticker} onClick={() => onClick({ ticker, value })}>
          <Row>
            <Ticker>{code}</Ticker>
            <Name>{value}</Name>
          </Row>
        </Item>
      );
    });
  };

  render() {
    const { displayMenu } = this.state;
    const { label, error, value, options } = this.props;

    return (
      <Container>
        <Labels>
          <Label>{label}</Label>
          <Error>{error}</Error>
        </Labels>
        <Select>
          <Button onClick={this.showDropdownMenu}>
            <Row>
              <Ticker>{options[0].code}</Ticker>
              <Name>{value}</Name>
            </Row>
          </Button>
          {displayMenu && <Wrapper>{this.renderOptions()}</Wrapper>}
        </Select>
      </Container>
    );
  }
}

export default BalanceDropdown;
