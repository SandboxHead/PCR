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
		super('pcr')
	}

	createContext(){
		return new PCRContext();
	}

	async instantiate(ctx) {
		console.log('Instantiate the contract')
	}

	async query(ctx, borrowerId){
		var invokerID = ctx.stub.getCreator();

		var borrower = ctx.borrowerList.getBorrower();

		if(invokerID !== borrower.getBorrowerIdentity() && !borrower.checkConsent(invokerID)){
			throw new Error("Invoker does not have consent to query.");
		}
		return borrower.toBuffer();
	}


	/*
	 * The lender must initiate the loan first. The loan, however, is not
	 * made ongoing at the moment, it requires that the borrower confirms
	 * the loan too. Currently, it'll be set to PENDING state.
	 */
	async initiateLoan(ctx, lenderId, borrowerId, loanAmount, assets, interest, lastInstallmentDate, nextInstallmentDate, nextInstallmentAmount) {
		/*
		 * Creates an instance of the loan with given values
		 * The loanKey is added to borrower and lender's list
		 * who keep their own list of loans they are a part of.
		 * Then the loan is added to the list of loans and
		 * borrower and lender state change (new loan) is updated
		 */
		var invokerID = ctx.stub.getCreator();
		
		// if(ctx.stub.getAttributeValue('OU') !== "Lender"){
		// 	throw new Error("Invoker is not a lender")
		// }

		if(invokerID !== lenderId){
			throw new Error("Lender is not invoker");
		}


		var loan = Loan.createInstance(loanId, borrowerId, lenderId, loanAmount, assets, interest, lastInstallmentDate, nextInstallmentDate, nextInstallmentAmount);

		var borrower = ctx.borrowerList.getBorrower(borrowerId);
		var lender = ctx.lenderList.getLender(lenderId);

		var loanKey = loan.getKey();

		borrower.addLoan(loanKey);
		lender.addLoan(loanKey);

		await ctx.loanList.addLoan(loan);
		await ctx.borrowerList.updateBorrower(borrower);
		await ctx.lenderList.updateLender(lender);

		return loanKey;
	}
	
	/*
	 * The borrower shall pay the installment but it's the lender's job to
	 * invoke this. The lender shall also update the next installment date.
	 */
	async payInstallment(ctx, loanKey, amountPaid, nextInstallmentAmount, nextInstallmentDate) {
		/*
		 * Retrieve the loan using the loanKey
		 * Update information regarding next installments and remainging amount
		 */
		var invokerID = ctx.stub.getCreator();
		
		var loan = ctx.loanList.getLoan(loanKey);

		if(invokerID !== loan.getLenderIdentity()){
			throw new Error("Lender is not invoker");
		}

		loan.addInstallment(amountPaid);
		loan.setNextInstallmentAmount(nextInstallmentAmount);
		loan.setNextInstallmentDate(nextInstallmentDate);
		loan.setRemainingAmount(loan.getRemainingAmount() - amountPaid);

		await ctx.loanList.updateLoan(loan);
	}

	/*
	 * Consent is simply a list lookup. If the lender is in the list of consents
	 * given out by the borrower, then the lender has the consent of the
	 * borrower to access their history for credit decision. Lender keeps their
	 * own list of borrowers they have consent of, for convenience.
	 */
	async giveConsent(ctx, lenderId) {
		/*
		 * Borrower is the Invoker
		 * Borrower adds Lender to their list of ppl they have given consent to
		 * Lender adds Borrower to their own list of ppl they have consent from
		 * Borrower and Lender state changes (consent list update) is updated
		 */
		var invokerId = ctx.stub.getCreator();

		// if(ctx.stub.getAttributeValue('OU') !== "Borrower"){
		// 	throw new Error("Invoker is not a Borrower");
		// }


		var borrower = ctx.borrowerList.getBorrower(invokerId);
		var lender = ctx.lenderList.getLender(lenderId);


		borrower.giveConsent(lenderId);
		lender.addConsent(invokerId);

		await ctx.borrowerList.updateBorrower();
		await ctx.lenderList.updateLender();
	} 

	/*
	 * Once the loan cycle has been completed and the loan has been paid for,
	 * the borrower may choose to revoke the consent. The lender will no longer
	 * be part of the list and hence will not be able to view the borrower's
	 * history anymore.
	 */
	async revokeConsent(ctx, lenderId) {
		/*
		 * Borrower is the Invoker
		 * Borrower removes lender from list of ppl they have given consent to
		 * The lender removes borrower from list of ppl they have consent of
		 * Borrower and lender state changes (consent list update) is updated
		 */
		var invokerId = ctx.stub.getCreator();

		// if(ctx.stub.getAttributeValue('OU') !== "Borrower"){
		// 	throw new Error("Invoker is not a Borrower");
		// }

		var borrower = ctx.borrowerList.getBorrower(invokerId);
		var lender = ctx.lenderList.getLender(lenderId);


		borrower.revokeConsent(lenderId);
		lender.removeConsent(invokerId);

		await ctx.borrowerList.updateBorrower();
		await ctx.lenderList.updateLender();
	} 


	/*
	 * Once the loan has been initiated by the lender, the borrower has to
	 * confirm that this loan has been requested for and the details matchup.
	 * With the confirmation, the loan is now said to be ongoing.
	 */
	async confirmLoan(ctx, loanKey) {
		/*
		 * The loan is retrieved from the loanKey
		 * The state of the loan is changed from PENDING to ONGOING
		 * The borrower and lender move the loan from their corresponding
		 * pending list to the ongoing list.
		 */
		var invokerID = ctx.stub.getCreator();

		// if (ctx.stub.getAttributeValue('OU') !== 'Borrower') {
		// 	throw new Error('Invoker is not a borrower');
		// }

		var loan = await ctx.loanList.getLoan(loanKey);

		if (invokerID !== loan.getBorrowerIdentity()) {
			throw new Error('Invoker is not a authorised borrower');
		}

		var borrower = ctx.borrowerList.getBorrower(loan.getBorrowerIdentity());
		var lender = ctx.lenderList.getLender(loan.getLenderIdentity());

		if (loan.getState() !== loanState.PENDING) {
			throw new Error('Loan with loan key: ' + loanKey + ' is not pending');
		}

		loan.setState(loanState.ONGOING);
		borrower.approveLoan(loanKey);
		lender.approveLoan(loanKey);

		await ctx.loanList.updateLoan(loan);
		await ctx.borrowerList.updateBorrower(borrower);
		await ctx.lenderList.updateLender(lender);
	}

	/*
	 * The lender will invoke this once the loan has been payed for fully.
	 * The borrower may then choose to revoke consent.
	 */
	async completeLoan(ctx, loanKey) {
		/*
		 * Retrieve the loan from the loanKey
		 * Change the state of loan from ONGOING to COMPLETED
		 * The borrower and lender move the loan from their corresponding
		 * ongoing list to the completed list.
		 */
		var invokerID = ctx.stub.getCreator();

		// if (ctx.stub.getAttributeValue('OU') !== 'Lender') {
		// 	throw new Error('Invoker is not a Lender');
		// }

		var loan = await ctx.loanList.getLoan(loanKey);

		if (invokerID !== loan.getLenderIdentity()) {
			throw new Error('Invoker is not a authorised lender');
		}

		var borrower = ctx.borrowerList.getBorrower(loan.getBorrowerIdentity());
		var lender = ctx.lenderList.getLender(loan.getLenderIdentity());

		if (loan.getState !== loanState.ONGOING) {
			throw new Error('Loan with loan key: ' + loanKey + ' is not ongoing');			
		}

		loan.setState(loanState.FINISHED);
		borrower.completeLoan(loanKey);
		lender.completeLoan(loanKey);

		await ctx.loanList.updateLoan(loan);
		await ctx.borrowerList.updateBorrower(borrower);
		await ctx.lenderList.updateLender(lender);
	}

	async addBorrower(ctx, identity, assetValues){
		var invokerID = ctx.stub.getCreator();

		// if (ctx.stub.getAttributeValue('OU') !== 'Admin') {
		// 	throw new Error('Invoker is not an admin');
		// }

		var borrower = Borrower.createInstance(identity, [], [], [], [], assetValues);

		await ctx.borrowerList.addBorrower(borrower);
	}

	async addLender(ctx, identity){
		var invokerID = ctx.stub.getCreator();

		// if (ctx.stub.getAttributeValue('OU') !== 'Admin') {
		// 	throw new Error('Invoker is not an admin');
		// }

		var lender = Lender.createInstance(identity, [], [], [], []);

		await ctx.lenderList.addBorrower(lender);
	}
}

module.exports = PCRContract;
