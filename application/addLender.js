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
		['-i', '--identity'],
		{
			help: 'Lender\'s Identity (x.509 certifcate)',
			metavar:'',
			required:true
		}
	);
	var args = parser.parseArgs();
	return args;
}


async function main() {

// 	Arguments : Username, wallet, channelName, lenderId, borrowerId, loanAmount, assets, interest, lastInstallmentDate, nextInstallmentDate, nextInstallmentAmount

	const gateway = new Gateway();
	var args = getArguments();
	console.dir(args);



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

	    const initiateLoanResponse = await contract.submitTransaction("addLender", args.identity);

	    console.log("Lender Added");
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

    console.log('Add Lender program complete.');

}).catch((e) => {

    console.log('Add Lender program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});