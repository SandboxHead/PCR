#!/bin/bash
export CHANNEL_NAME=pcr-channel

echo "Creating channel"

peer channel create -o orderer.rbi.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/rbi.com/orderers/orderer.rbi.com/msp/tlscacerts/tlsca.rbi.com-cert.pem

echo "Joining Channel org0"

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org0.rbi.com/users/Admin@org0.rbi.com/msp
export CORE_PEER_ADDRESS=peer0.org0.rbi.com:7051
export CORE_PEER_LOCALMSPID="Org0MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org0.rbi.com/peers/peer0.org0.rbi.com/tls/ca.crt

peer channel join -b pcr-channel.block

echo "Joined Channel org0"

echo "Joining Channel org1"

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.rbi.com/users/Admin@org1.rbi.com/msp
export CORE_PEER_ADDRESS=peer0.org1.rbi.com:8051
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.rbi.com/peers/peer0.org1.rbi.com/tls/ca.crt

peer channel join -b pcr-channel.block
echo "Joined Channel org1"

echo "Joining Channel org2"


export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.rbi.com/users/Admin@org2.rbi.com/msp
export CORE_PEER_ADDRESS=peer0.org2.rbi.com:9051
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.rbi.com/peers/peer0.org2.rbi.com/tls/ca.crt

peer channel join -b pcr-channel.block

echo "Joined Channel org2"

echo "Adding anchor peer: org0"


export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org0.rbi.com/users/Admin@org0.rbi.com/msp
export CORE_PEER_ADDRESS=peer0.org0.rbi.com:7051
export CORE_PEER_LOCALMSPID="Org0MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org0.rbi.com/peers/peer0.org0.rbi.com/tls/ca.crt

peer channel update -o orderer.rbi.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org0MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/rbi.com/orderers/orderer.rbi.com/msp/tlscacerts/tlsca.rbi.com-cert.pem

echo "Added anchor peer: org0"
echo "Adding anchor peer: org1"


export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.rbi.com/users/Admin@org1.rbi.com/msp
export CORE_PEER_ADDRESS=peer0.org1.rbi.com:8051
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.rbi.com/peers/peer0.org1.rbi.com/tls/ca.crt

peer channel update -o orderer.rbi.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/rbi.com/orderers/orderer.rbi.com/msp/tlscacerts/tlsca.rbi.com-cert.pem


echo "Added anchor peer: org1"
echo "Adding anchor peer: org2"


export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.rbi.com/users/Admin@org2.rbi.com/msp
export CORE_PEER_ADDRESS=peer0.org2.rbi.com:9051
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.rbi.com/peers/peer0.org2.rbi.com/tls/ca.crt

peer channel update -o orderer.rbi.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org2MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/rbi.com/orderers/orderer.rbi.com/msp/tlscacerts/tlsca.rbi.com-cert.pem


echo "Added anchor peer: org2"

echo "Installing Smart Contract: org0"


export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org0.rbi.com/users/Admin@org0.rbi.com/msp
export CORE_PEER_ADDRESS=peer0.org0.rbi.com:7051
export CORE_PEER_LOCALMSPID="Org0MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org0.rbi.com/peers/peer0.org0.rbi.com/tls/ca.crt

peer chaincode install -n mycc -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/

echo "Installied Smart Contract: org0"
echo "Installing Smart Contract: org1"


export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.rbi.com/users/Admin@org1.rbi.com/msp
export CORE_PEER_ADDRESS=peer0.org1.rbi.com:8051
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.rbi.com/peers/peer0.org1.rbi.com/tls/ca.crt

peer chaincode install -n mycc -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/


echo "Installied Smart Contract: org1"
echo "Installing Smart Contract: org2"


export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.rbi.com/users/Admin@org2.rbi.com/msp
export CORE_PEER_ADDRESS=peer0.org2.rbi.com:9051
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.rbi.com/peers/peer0.org2.rbi.com/tls/ca.crt

peer chaincode install -n mycc -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/

echo "Installied Smart Contract: org2"
echo "Instantiating Smart Contract: org2"


peer chaincode instantiate -o orderer.rbi.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/rbi.com/orderers/orderer.rbi.com/msp/tlscacerts/tlsca.rbi.com-cert.pem -C $CHANNEL_NAME -n mycc -l node -v 1.0 -c '{"Args":[]}' -P "AND ('Org0MSP.member')"

echo "Instantiated Smart Contract: org2"

