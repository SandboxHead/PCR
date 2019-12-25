'use strict';

const { Contract, Context } = require('fabric-contract-api');
const shim = require('fabric-shim');

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

	async initiateLoan(ctx, lenderId, borrowerId, loanAmount, assets, interest, lastInstallmentDate, nextInstallmentDate, nextInstallmentAmount) {
		var invokerID = ctx.stub.getCreator();
		
		if(ctx.stub.getAttributeValue('OU') !== "Lender"){
			throw new Error("Invoker is not a lender")
		}

		if(invokerID !== lenderId){
			throw new Error("Lender is not invoker");
		}


		var loan = Loan.createInstance(loanId, borrowerId, lenderId, loanAmount, assets, interest, lastInstallmentDate, nextInstallmentDate, nextInstallmentAmount);

		var borrower = ctx.borrowerList.getBorrower(borrowerId);
		var lender = ctx.lenderlist.getLender(lenderId);

		var loanKey = loan.getKey();

		borrower.addLoan(loanKey);
		lender.addLoan(loanKey);

		await ctx.loanList.addLoan(loan);
		await ctx.borrowerList.updateBorrower(borrower);
		await ctx.lenderList.updateLender(lender);

		return loanKey;
	}
	
	async payInstallment(ctx, loanKey, amountPaid, nextInstallmentAmount, nextInstallmentDate) {
		var invokerID = ctx.stub.getCreator();
		
		var loan = ctx.loanList.getLoan(loanKey);

		if(invokerID !== loan.getLenderIdentity()){
			throw new Error("Lender is not invoker");
		}

		loan.addInstallment(amountPaid);
		loan.setNextInstallmentAmount(nextInstallmentAmount);
		loan.setNextInstallmentDate(nextInstallmentDate);
		loan.setRemainingAmount(loan.getRemainingAmount() - amountPaid);

		await.ctx.loanList.updateLoan(loan);
	}

	async giveConsent(ctx, lenderId) {
		var invokerId = ctx.stub.getCreator();

		if(ctx.stub.getAttributeValue('OU') !== "Borrower"){
			throw new Error("Invoker is not a Borrower");
		}

		var borrower = ctx.borrowerList.getBorrower(invokerId);
		var lender = ctx.lenderList.getLender(lenderId);

		borrower.giveConsent(lenderId);
		lender.addConsent(invokerId);

		await.ctx.borrowerList.updateBorrower();
		await.ctx.lenderList.updateLender();
	} 

	async revokeConsent(ctx, lenderId) {
		var invokerId = ctx.stub.getCreator();

		if(ctx.stub.getAttributeValue('OU') !== "Borrower"){
			throw new Error("Invoker is not a Borrower");
		}

		var borrower = ctx.borrowerList.getBorrower(invokerId);
		var lender = ctx.lenderList.getLender(lenderId);

		borrower.revokeConsent(lenderId);
		lender.removeConsent(invokerId);

		await.ctx.borrowerList.updateBorrower();
		await.ctx.lenderList.updateLender();
	} 

}