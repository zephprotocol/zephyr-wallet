import React from "react";
import { Ticker } from "shared/reducers/types";
import { Container, Select, Wrapper, Item, Button, Labels, Ticker as TickerWrapper, Name, Row, Icon } from "./styles";
import { Label, Error } from "../../../../assets/styles/type.js";
import {convertToNewTicker} from "../../../../utility/utility";
import logo from "../../../../assets/icons/zephyr.png";
import stableLogo from "../../../../assets/icons/stable.png";
import reserveLogo from "../../../../assets/icons/reserve.png";

class Dropdown extends React.Component {
  state = {
    displayMenu: false,
    selected: this.props.placeholder,
    buttonRef: null,
  };

  constructor(props) {
    super(props);

    this.buttonRef = React.createRef();
  }

  showDropdownMenu = () => {
    this.setState({ displayMenu: true });
    document.addEventListener("click", this.onClickOutside);
  };

  hideDropdownMenu = () => {
    this.setState({ displayMenu: false });
    document.removeEventListener("click", this.onClickOutside);
  };

  onClickOutside = (e) => {
    const { target } = e;
    const { current } = this.buttonRef;
    if (current && !current.contains(target)) this.hideDropdownMenu();
  };

  componentWillUnmount = () => {
    document.removeEventListener("click", this.onClickOutside);
  };

  renderOptions = () => {
    const { onClick, options } = this.props;
    return options.map((option) => {
      const { name, ticker } = option;
      const image = ticker === Ticker.ZEPH ? logo : ticker === Ticker.ZEPHUSD ? stableLogo : ticker === Ticker.ZEPHRSV ? reserveLogo : null;

      return (
        <Item key={name} onClick={() => onClick(option)}>
          <Row>
            {image && <Icon src={image} />}
            <Name>{name}</Name>
            {ticker ? <TickerWrapper>{convertToNewTicker(ticker)}</TickerWrapper> : null}
          </Row>
        </Item>
      );
    });
  };

  render() {
    const { displayMenu } = this.state;
    const { label, error, placeholder, value, ticker, width, disabled } = this.props;

    const image = ticker === Ticker.ZEPH ? logo : ticker === Ticker.ZEPHUSD ? stableLogo : ticker === Ticker.ZEPHRSV ? reserveLogo : null;

    return (
      <Container width={width}>
        <Labels>
          <Label>{label}</Label>
          <Error>{error}</Error>
        </Labels>
        <Select>
          <Button type="button" ref={this.buttonRef} disabled={disabled} onClick={this.showDropdownMenu}>
            {value === "Select Asset" ? (
              placeholder
            ) : (
              <Row>
                {image && <Icon src={image} />}
                <div style={{ height: "30px", display: "block" }}></div>
                <Name>{value}</Name>
                <TickerWrapper>{convertToNewTicker(ticker)}</TickerWrapper>
              </Row>
            )}
          </Button>
          {displayMenu && <Wrapper>{this.renderOptions()}</Wrapper>}
        </Select>
      </Container>
    );
  }
}

export default Dropdown;
