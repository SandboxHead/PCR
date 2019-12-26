'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
// const Lender = require('../')

function getArguments() {
	var parser = new ArgumentParser({
		version: '0.0.1',
		addHelp : true
	});

	parser.addArgument(
		['-i', '--identity'],
		{
			help: 'Lender\'s identity',
			metavar:'',
			required:true

		}
	);
	var args = parser.parseArgs();
	return args;
}

async function main() {

// 	Arguments : Username, wallet, channelName, lenderId

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

	    const confirmLoanResponse = await contract.submitTransaction("giveConsent", args.identity)

	    console.log("Consent Given.");
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

    console.log('Give Consent program complete.');

}).catch((e) => {

    console.log('Give Consent program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});