'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Borrower = require('./borrower.js');
const Lender = require('./lender.js');
const Loan = require('./loan.js');

const BorrowerList = require('./borrowerlist.js');
const LenderList = require('./lenderlist.js');
const LoanList = require('./loanlist.js');


class PCRContext extends Context {

	constructor() {
		super();
		this.borrowerList = new BorrowerList(this);
		this.lenderList = new LenderList(this);
		this.loanList = new LoanList(this);
	}
}


class PCRContract extends Contract {
	constructor() {
		super('PCR')
	}

	createContext(){
		return new PCRContext();
	}

	async instantiate(ctx) {
		console.log('Instantiate the contract')
	}

	
}