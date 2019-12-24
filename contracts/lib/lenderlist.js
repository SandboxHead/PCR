'use strict';

const StateList = require('./../ledger-api/statelist.js');

const lender = require('./lender.js')

class LenderList extends StateList {

    constructor(ctx) {
        super(ctx, 'lenderlist');
        this.use(lender);
    }

    async addLender(lender) {
        return this.addState(lender);
    }

    async getLender(lenderKey) {
        return this.getState(lenderKey);
    }

    async updateLender(lender) {
        return this.updateState(lender);
    }
}

module.exports = LenderList;