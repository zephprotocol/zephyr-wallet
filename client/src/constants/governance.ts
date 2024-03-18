import { NetworkType } from "typings";

const GOVERNANCE_WALLET_ADDRESS = [
  "ZEPHYR2jZrZXenfKejCcCmEkRzUYwXjgWfJF4yzdCznKQ8yQ3g3PsWUbZjzfzHbeTPMgXVmEuDKQUB9rPkgtVwyWRh9knU4EpfJ57", // mainnet
  "ZPHTjbspy3MQWHUVsnRVWUhcWEKnaEiK3FBpsuwPzcCN1zDAuWGjFskcHC9jo6e8fF4UDzFbe5LGnU4ychM48E8D8ukYphLM6qu", // testnet
  "ZPHSjoq9e8pB41HgzKLJ94HPWN9eKhZhqYdFrvf51KUjcevE8SUhh8CYw65g5KYDBqaUsZZLu1NhnL3CvGikQGFEjdGV1hNzVL5", // stagenet
];

export const getGovernanceWalletAddressByNetwork = (network: NetworkType): string => {
  return GOVERNANCE_WALLET_ADDRESS[network];
};
