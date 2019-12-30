#!/bin/bash

# stop the network if up
./stop.sh

# create identities for all the organisations
bin/cryptogen generate --config=./crypto-config.yaml

#set PATH as the current working directory
export FABRIC_CFG_PATH=$PWD
mkdir -p channel-artifacts
# create genesis block using configtx.yaml
bin/configtxgen -profile PCRGenesis -channelID pcr-sys-channel -outputBlock ./channel-artifacts/genesis.block

# create channel
export CHANNEL_NAME="pcr-channel"  && bin/configtxgen -profile PCRChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

# Add anchor peers for orgnaisations with peers
bin/configtxgen -profile PCRChannel -outputAnchorPeersUpdate ./channel-artifacts/Org0MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org0MSP

bin/configtxgen -profile PCRChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP

bin/configtxgen -profile PCRChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP


export CA_LENDER_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/lender.rbi.com/ca && ls *_sk)
export CA_BORROWER_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/borrower.rbi.com/ca && ls *_sk)
export CA_ORG0_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org0.rbi.com/ca && ls *_sk)
export CA_ORG1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org1.rbi.com/ca && ls *_sk)
export CA_ORG2_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org2.rbi.com/ca && ls *_sk)
export COMPOSE_PROJECT_NAME="net"
export SYS_CHANNEL="pcr-sys-channel"

docker-compose -f docker-compose.yaml up -d