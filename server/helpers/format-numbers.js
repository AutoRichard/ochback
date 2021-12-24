'use strict'


const formatUSD = (stripeAmount) => {
    return `$${(stripeAmount / 100).toFixed(2)}`;
}

const formatStripeAmount = (USDString) => {
    return parseFloat(USDString) * 100;
}

export default {
    formatUSD,
    formatStripeAmount
};