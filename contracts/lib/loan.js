'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

class Installment {
	constructor(amount, date, lateTime) {
		this.amount = amount;
		this.date = date;
		this.lateTime = lateTime;
	}

	getAmount() {
		return this.amount;
	}

	getDate() {
		return this.date;
	}

	getLateTime() {
		return this.lateTime;
	}
}

class Loan extends State {
	constructor(obj) {
		super(Loan.getClass(), [obj.loadId]);
		Object.asign(this, obj);
	}
    
    /**
     * Basic getters and setters
    */
    getLoanId() {
    	return this.loadId;
    }

    getBorrowerIdentity() {
    	returnt this.borrowerIdentity;
    }
	
    getLenderIdentity() {
    	returnt this.lenderIdentity;
    }

    getAmount() {
    	return this.amount;
    }

	getAssets() {
		return this.assets;
	}

	getInterest() {
		return this.interest;
	}

	getInstallments() {
		this.installments;
	}

	getRemainingAmount() {
		return this.remainingAmount;
	}

	setRemainingAmount(remainingAmount) {
		this.remainingAmount = remainingAmount;
	}

	getLastInstallmentDate() {
		return this.lastInstallmentDate;
	}

	setLastInstallmentDate() {
		this.lastInstallmentDate = lastInstallmentDate;
	}

	getNextInstallmentDate() {
		return this.nextInstallmentDate;
	}

	setNextInstallmentDate(nextInstallmentDate) {
		this.nextInstallmentDate = nextInstallmentDate;
	}

	getNextInstallmentAmount() {
		return this.nextInstallmentAmount;
	}

	setNextInstallmentAmount(nextInstallmentAmount) {
		this.nextInstallmentAmount = nextInstallmentAmount;
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
	}

	/**
     * Useful methods to encapsulate commercial paper states
     */
	addInstallment(amountPaid) {
		var curDate = Date(Date.now())
		var installment = new Installment(amountPaid, curDate, curDate - this.getNextInstallmentDate);
		this.installments.push(installment);
	}

}