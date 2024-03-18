import { EmptyState, History, Message, NoTransactions, Illustration } from "shared/pages/_wallet/details/styles";
import { Spinner } from "shared/components/spinner";
import { convertBalanceToMoney, createRemainingTimeString, iNum, convertToNewTicker } from "utility/utility";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Transaction, TransactionProps } from "shared/components/tx-history/component";
import Header from "shared/components/_layout/header/index.js";
import { selectBlockHeight } from "shared/reducers/chain";
import { selectTransferListByTicker } from "shared/reducers/xTransferList";
import { Ticker } from "shared/reducers/types";
import { ZephyrAppState } from "platforms/desktop/reducers";
import { BlockHeaderRate, selectXRate } from "shared/reducers/blockHeaderExchangeRates";
import { getAllTransfers } from "shared/actions/transferHistory";

export interface TxEntry {
  hash: string;
  timestamp: number;
  mempool: boolean;
  amount: bigInt.BigInteger;
  fee: bigInt.BigInteger;
  unlockHeight: number;
  height: number;
  isConfirmed: boolean;
  isFailed: boolean;
  isMinerTx: boolean;
  isIncoming: boolean;
  conversion: Conversion;
}

export interface Conversion {
  isConversion: boolean;
  amount?: bigInt.BigInteger;
  amountStr?: string;
  prefixStr?: string;
  assetId?: Ticker;
}

interface TxHistoryProps {
  transferList: TxEntry[];
  height: number;
  rates: BlockHeaderRate[];
  assetId: Ticker;
  getAllTransfers: () => void;
}

type TXType = "Mined" | "Pending" | "Sent" | "Received" | "Failed";

class TxHistoryContainer extends Component<TxHistoryProps, any> {
  static getTransactionType(tx: TxEntry): TXType {
    if (tx.isFailed) {
      return "Failed";
    } else if (tx.isMinerTx) {
      return "Mined";
    } else if (tx.mempool) {
      return "Pending";
    } else if (!tx.isIncoming) {
      return "Sent";
    } else {
      return "Received";
    }
  }

  componentDidMount() {
    this.props.getAllTransfers();
  }

  render() {
    const all = this.props.transferList;
    const isFetching = false;
    const currentHeight = this.props.height;

    return (
      <>
        <Header title="History" description={`Review your ${convertToNewTicker(this.props.assetId)} transaction history`} />
        {isFetching && all == null ? (
          <EmptyState>
            <Spinner />
            <Message>Loading transaction history...</Message>
          </EmptyState>
        ) : (
          <History>
            {all && all.length > 0 ? (
              all.map((transaction: any, index: number) => {
                const txProps: TransactionProps = prepareTxInfo(
                  transaction,
                  currentHeight,
                  this.props.assetId,
                  this.props.rates,
                );
                return <Transaction {...txProps} key={index} />;
              })
            ) : (
              <EmptyState>
                <NoTransactions>
                  <Illustration />
                </NoTransactions>
                <Message>
                  No transactions found. Once you send, receive or exchange tokens your transactions will appear here.
                </Message>
              </EmptyState>
            )}
          </History>
        )}
      </>
    );
  }
}

const mapStateToProps = (state: ZephyrAppState, props: any) => ({
  transferList: selectTransferListByTicker(state, props.assetId),
  height: selectBlockHeight(state),
  rates: state.blockHeaderExchangeRate,
});

export const TxHistoryDesktop = connect(mapStateToProps, { getAllTransfers })(TxHistoryContainer);

const prepareTxInfo = (
  tx: TxEntry,
  currentHeight: number,
  ticker: Ticker,
  rates: BlockHeaderRate[],
): TransactionProps => {
  let xRate = selectXRate(rates, ticker, Ticker.ZEPHUSD, true);
  if (ticker === Ticker.ZEPHRSV) {
    const spotRate = selectXRate(rates, Ticker.ZEPH, Ticker.ZEPHUSD, true);
    xRate = selectXRate(rates, ticker, Ticker.ZEPH) * spotRate;
  }

  const transactionDate = new Date(tx.timestamp * 1000).toLocaleDateString();

  const mempool = tx.mempool;
  const failed = tx.isFailed;
  const readableAmount = iNum(convertBalanceToMoney(tx.amount, 6));
  const currentValueInUSD = iNum(parseFloat(readableAmount) * xRate);

  let conversion: Conversion = tx.conversion;
  if (tx.conversion.isConversion && tx.conversion.amount != null) {
    conversion.amountStr = iNum(convertBalanceToMoney(tx.conversion.amount, 6));
    conversion.prefixStr = tx.isIncoming ? "from" : "to";
  }

  const txType = TxHistoryContainer.getTransactionType(tx);

  let blocksTillUnlocked: number = 0;

  // when unlock_time is 0 we have a regular tx which is unlocked after 10 confirmations
  if (tx.unlockHeight === 0) {
    blocksTillUnlocked = Math.max(tx.height + 10 - currentHeight, 0);
  }
  // if unlock_time is higher than transaction height then we expect a mining
  // income where unlock_time is the index of the block where it is unlocked
  else if (tx.unlockHeight > tx.height) {
    if (tx.unlockHeight > currentHeight) {
      blocksTillUnlocked = tx.unlockHeight - currentHeight;
    }
  }
  const minutesTillUnlocked = blocksTillUnlocked * 2;
  const timeTillUnlocked = minutesTillUnlocked > 0 ? createRemainingTimeString(minutesTillUnlocked) : null;

  return {
    timeTillUnlocked,
    type: txType,
    currentValueInUSD,
    conversion,
    mempool,
    date: transactionDate,
    amount: readableAmount,
    hash: tx.hash,
    fee: tx.isIncoming ? 0 : iNum(convertBalanceToMoney(tx.fee, 4)),
    block: tx.height,
    failed,
  };
};
