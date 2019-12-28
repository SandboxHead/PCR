'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
// const Lender = require('../')
var ArgumentParser = require('argparse').ArgumentParser;

function getArguments() {
	var parser = new ArgumentParser({
		version: '0.0.1',
		addHelp : true
	});

	parser.addArgument(
		['-k', '--key'],
		{
			help: 'Loan Key',
			metavar:'',
			required:true

		}
	);
	var args = parser.parseArgs();
	return args;
}

async function main() {

// 	Arguments : loanKey

	var args = getArguments();
	console.dir(args);

	const gateway = new Gateway();

	try {

		let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));
		let connectionOptions = {

	        identity: userName,
	        wallet: wallet,
	        discovery: { enabled: false, asLocalhost: true }

	    };
	    console.log('Connect to Fabric gateway.');
	    await gateway.connect(connectionProfile, connectionOptions);
	    const network = await gateway.getNetwork(channelName);

	    const contract = await network.getContract('contract');

	    const confirmLoanResponse = await contract.submitTransaction("confirmLoan", args.key);

	    console.log("Loan confirmation done.");
	    console.log("Transaction Completed");
	}

	catch(error) {
		console.log(`Error processing transaction. ${error}`);
		console.log(error.stack);
	}

	finally {
		console.log('Disconnect from Fabric gateway.');
		gateway.disconnect();
	}
}

main().then(() => {

    console.log('Confirm Loan program complete.');

}).catch((e) => {

    console.log('Confirm Loan program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});