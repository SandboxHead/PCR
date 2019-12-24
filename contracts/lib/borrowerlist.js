'use strict';

const StateList = require('./../ledger-api/statelist.js');

const Borrower = require('./borrower.js')

class BorrowerList extends StateList {

    constructor(ctx) {
        super(ctx, 'borrowerlist');
        this.use(Borrower);
    }

    async addBorrower(borrower) {
        return this.addState(borrower);
    }

    async getBorrower(borrowerKey) {
        return this.getState(borrowerKey);
    }

    async updateBorrower(borrower) {
        return this.updateState(borrower);
    }
}

module.exports = BorrowerList;