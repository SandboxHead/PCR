'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');


/**
 * Lender:
 * Identity: x509 certificate
 * Pending Loans : [] of loans (Loans which are not approved yet by the borrower)
 * Ongoing Loans :  [] of loans (Loans which are approved by the borrower and is ongoing)
 * Prev Loans : [] of loans (Loans which are completed)
 * Consents : [] of borrower of which consent has got
 */

class Lender extends State {
	constructor(obj) {
		super(Lender.getClass(), [obj.identity]);
		Object.asign(this, obj);
	}
    
    /**
     * Basic getters and setters
    */
    getIdentity() {
    	return this.identity;
    }

	/**
     * Useful methods to encapsulate commercial paper states
     */

    addLoan(loanId) {
    	this.pendingLoans.push(loanId);
    }

    addConsent(identity) {
    	this.consents.push(identity);
    }

    removeConsent(identity) {
    	index = this.consents.indexOf(identity);
    	if (index > -1){
    		this.consents.splice(index, 1);
    		return true;
    	}
    	return false;
    }

    approveLoan(loanId) {
        var index = this.pendingLoans.indexof(loanId);
        if(index === -1){
            throw new Error("Loan Id: " + loanId + " is not pending.");
        }
        this.ongoingLoans.push(loanId);
        this.pendingLoans.splice(index);        
    }

    completeLoan(loanId) {
    	index = this.ongoingLoans.indexof(loanId);
    	if (index > -1) {
    		this.ongoingLoans.splice(index, 1);
    		this.prevLoans.push(loanId);
    		return true;
    	}
    	return false;
    }

    static fromBuffer(buffer) {
    	return Lender.deserialize(buffer);
    }

    toBuffer() {
    	return Buffer.from(JSON.stringify(this));
    }
    
    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Lender);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(identity, pendingLoans, ongoingLoans, prevLoans, consents) {
        return new Lender({ identity, pendingLoans, ongoingLoans, prevLoans, consents });
    }

    static getClass() {
        return 'Lender';
    }
}

module.exports = Lender;
