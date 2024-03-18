// Library Imports
import React from "react";

// Relative Imports
import { Container, Title, Internal, External, Section, Wrapper } from "./styles";

const Footer = () => {
  return (
    <Container>
      <Wrapper>
        <Section>
          <Title>Mining Pools</Title>

          <External rel="noopener" href="https://pool.zephyrprotocol.com/" target="_blank">
            Zephyr Pool
          </External>
          <External rel="noopener" href="https://ekapool.com/zeph/" target="_blank">
            Ekapool
          </External>
          <External rel="noopener" href="https://moneroocean.stream/" target="_blank">
            Moneroocean
          </External>
          <External rel="noopener" href="https://zephyr.miningocean.org/" target="_blank">
            Mining Ocean
          </External>
          <External rel="noopener" href="http://minergalaxy.org/ZEPH" target="_blank">
            Miner Galaxy
          </External>
        </Section>
        <Section>
          <Title>Social</Title>
          <External rel="noopener" href="https://discord.gg/y4mzbDYSqQ" target="_blank">
            Discord
          </External>
          <External rel="noopener" href="https://medium.com/@zephyrcurrencyprotocol" target="_blank">
            Medium
          </External>
          <External rel="noopener" href="https://twitter.com/zephyr_org" target="_blank">
            Twitter
          </External>
          <External rel="noopener" href="https://github.com/ZephyrProtocol" target="_blank">
            Github
          </External>
          <External rel="noopener" href="https://t.me/zephyrprotocol" target="_blank">
            Telegram
          </External>
        </Section>
        <Section>
          <Title>Products</Title>
          <External
            rel="noopener"
            href="https://github.com/ZephyrProtocol/zephyr/releases/download/v0.2.2/zephyr-gui-win-v0.2.2.zip"
          >
            Windows Wallet
          </External>
          <External
            rel="noopener"
            href="https://github.com/ZephyrProtocol/zephyr/releases/download/v0.2.2/zephyr-gui-linux-v0.2.2.zip"
          >
            Linux Wallet
          </External>
          <External
            rel="noopener"
            href="https://github.com/ZephyrProtocol/zephyr/releases/download/v0.2.2/zephyr-cli-mac-v0.2.2.zip"
          >
            Mac CLI
          </External>
          <External
            rel="noopener"
            href="https://github.com/ZephyrProtocol/zephyr/releases/download/v0.2.2/zephyr-cli-linux-v0.2.2.zip"
          >
            Linux CLI
          </External>

          <External rel="noopener" href="https://explorer.zephyrprotocol.com/" target="_blank">
            Block Explorer
          </External>
        </Section>

        <Section>
          <Title>Exchanges</Title>
          <External rel="noopener" href="https://www.sevenseas.exchange/market/ZEPH-USDT" target="_blank">
            Seven Seas Exchange
          </External>
          <External rel="noopener" href="https://tradeogre.com/exchange/ZEPH-BTC" target="_blank">
            TradeOgre
          </External>
          <External rel="noopener" href="https://txbit.io/Trade/ZEPH/USDT" target="_blank">
            TxBit
          </External>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Footer;
