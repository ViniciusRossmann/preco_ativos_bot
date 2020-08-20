//Alphavantage
const token_alpha = 'VMWGOQOWENOAQK3N';
const alpha = require('alphavantage')({ key: token_alpha });

alpha.data.quote("petr4.SAO", "full", "JSON").then(data => {
    console.log(data);
});