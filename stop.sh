#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# Shut down the Docker containers that might be currently running.
export CA_LENDER_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/lender.rbi.com/ca && ls *_sk)
export CA_BORROWER_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/borrower.rbi.com/ca && ls *_sk)
export CA_ORG0_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org0.rbi.com/ca && ls *_sk)
export CA_ORG1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org1.rbi.com/ca && ls *_sk)
export CA_ORG2_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org2.rbi.com/ca && ls *_sk)
export COMPOSE_PROJECT_NAME="net"
export SYS_CHANNEL="pcr-sys-channel"

docker-compose -f docker-compose.yaml down

rm -rf ./crypto-config ./channel-artifacts