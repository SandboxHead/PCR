#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json 
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.yaml | sed -e $'s/\\\\n/\\\n        /g'
}

mkdir -p ./gateway

ORG=0
P0PORT=7051
CAPORT=9054
PEERPEM=crypto-config/peerOrganizations/org0.rbi.com/tlsca/tlsca.org0.rbi.com-cert.pem
CAPEM=crypto-config/peerOrganizations/org0.rbi.com/ca/ca.org0.rbi.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > gateway/connection-org0.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > gateway/connection-org0.yaml

ORG=1
P0PORT=8051
CAPORT=10054
PEERPEM=crypto-config/peerOrganizations/org1.rbi.com/tlsca/tlsca.org1.rbi.com-cert.pem
CAPEM=crypto-config/peerOrganizations/org1.rbi.com/ca/ca.org1.rbi.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > gateway/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > gateway/connection-org1.yaml

ORG=2
P0PORT=9051
CAPORT=11054
PEERPEM=crypto-config/peerOrganizations/org2.rbi.com/tlsca/tlsca.org2.rbi.com-cert.pem
CAPEM=crypto-config/peerOrganizations/org2.rbi.com/ca/ca.org2.rbi.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > gateway/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > gateway/connection-org2.yaml
