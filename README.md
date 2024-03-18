# Zephyr Frontend for Web and Desktop

Official Zephyr Frontend Monorepository for Zephyr Desktop and Zephyr Web Version.
Originally forked from: https://github.com/haven-protocol-org/haven-web-app

**Main Libraries:** React, Redux, Electron, Styled Components

**Languages:** Typescript, Javascript

## Web

#### Environments

- mainnet
- stagenet
- testnet

#### Build & Develop

1. Navigate to client folder
2. Build the app for given environment
3. Start the app for given environment

```bash
cd client
npm run build:web
npm run start:web
```

## Desktop

#### Build

1. Navigate to client folder
2. Build the app for the environment

```bash
cd client
npm run build:desktop
```

To build the final desktop build

```bash
sh ./sh/make.sh
```

#### Develop

1. Run start script to prepare client
2. Start the build by executing shell script

```bash
npm run start:desktop
cd ../
sh ./sh/develop.sh
```
