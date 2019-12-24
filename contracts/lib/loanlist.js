'use strict';

const StateList = require('./../ledger-api/statelist.js');

const loan = require('./loan.js')

class LoanList extends StateList {

    constructor(ctx) {
        super(ctx, 'loanlist');
        this.use(loan);
    }

    async addLoan(loan) {
        return this.addState(loan);
    }

    async getLoan(loanKey) {
        return this.getState(loanKey);
    }

    async updateLoan(loan) {
        return this.updateState(loan);
    }
}

module.exports = LoanList;