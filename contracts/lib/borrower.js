
'use strict';

const State = require('../ledger-api/state.js');
const State = require('./loan.js');


class Asset{
	constructor(value){
		this.value = value;
		this.flag = 0;
	}
	getValue(){
		return this.value;
	}
	getFlag() {
		return this.flag;
	}
	setFlag(value) {
		this.flag = value;
	}
} 

class Borrower extends State {
	constructor(obj) {
		super(Borrower.getClass(), [obj.identity]);
		Object.assign(this, obj);
	}

	getIdentity() {
		return this.identity;
	}

	// Consents 

	checkConsent(identity) {
		return this.consents.includes(identity);
	}

	giveConsent(identity) {
		this.consents.push(identity);
	}

	revokeConsent(identity){
		var index = this.consents.indexof(identity);
		if(index != -1){
			this.consents.splice(index);
		}
		else{
			throw new Error(identity + " does not contain consent");
		}
	}

	addLoan(loanId){
		this.pendingLoans.push(loanId);	
	}

	approveLoan(loanId){
		var index = this.pendingLoans.indexof(loanId);
		if(index === -1){
			throw new Error("Loan Id: " + loanId + " is not pending.");
		}
		this.ongoingLoans.push(loanId);
		this.pendingLoans.splice(index);
	}

	revertApproved(loanId){
		var index = this.ongoingLoans.indexof(loanId);
		if(index === -1){
			throw new Error("Loan Id: " + loanId + " is not approved.");
		}
		this.ongoingLoans.splice(loanId);
		this.pendingLoans.push(index);
	}

	completeLoan(loadId){
		var index = this.ongoingLoans.indexof(loanid);
		if(index === -1){
			throw new Error("Loan Id: " + loanId + " does not belong to this borrower.");
		}
		// check if loan could actually be cleared or not
		this.prevLoan.add(loanId);
		this.ongoingLoans.splice(index);
	}

	getAssetValue(index){
		return this.assets[index].value;
	}

	useAsset(index){
		if(this.assets[index].getFlag() == 1){
			throw new Error("Asset already in use.") ;
		}
		this.assets[index].setFlag(0)
	}

	unuseAsset(index){
		if(this.assets[index].getFlag() === 0){
			throw new Error("Asset not in use");
		}
		this.assets[index].setFlag(1);
	}

	removeAsset(index){
		this.assets.splice(index);
	}

	addAsset(value){
		var asset = new Asset(value);
		this.assets.push(asset);
	}

    static fromBuffer(buffer) {
        return Borrower.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Borrower);
    }

    static createInstance(identity, consents, pendingLoans, ongoingLoans, prevLoan, assetValues) {
    	var assets = [];
    	for (index = 0; index < assetValues.length; index++){
    		var asset = new Asset(assetValues[index]);
    		assets.push(asset);
    	}
        return new Borrower({ idnetity, consents, pendingLoans, ongoingLoans, prevLoan, assets });
    }

    static getClass() {
    	return 'borrower';
    }
}

module.exports = Borrower;