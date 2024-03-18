#!/usr/bin/env bash

trap "kill 0" EXIT

#electron envs
export ZEPHYR_DESKTOP_DEVELOPMENT=true
export BROWSER=none
export NODE_INSTALLER=npm

# npm run start:desktop:testnet --prefix client &
npm run start --prefix zephyr-desktop-app

#start electron

wait
