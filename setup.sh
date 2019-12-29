#!/bin/bash

bin/cryptogen generate --config=./crypto-config.yaml

#set PATH as the current working directory
export FABRIC_CFG_PATH=$PWD

# create genesis block using configtx.yaml
bin/configtxgen -profile PCRGenesis -channelID pcr-channel -outputBlock ./channel-artifacts/genesis.block

# create channel
export CHANNEL_NAME=pcr-channel  && bin/configtxgen -profile PCRChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

# Add anchor peers for orgnaisations with peers
bin/configtxgen -profile PCRChannel -outputAnchorPeersUpdate ./channel-artifacts/Org0MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org0MSP

bin/configtxgen -profile PCRChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP

bin/configtxgen -profile PCRChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
