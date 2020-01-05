import {f, auth, database } from '../config/config';

function debitAccount(accountId, amount) {

}

function creditAccount(accountId, amount) {

}

function transferMoney(
    debitAccount,
    creditAccount,
    currency,
    amount,
    transferDate,
    notes,
    owner) {
        f.firestore().collection("transactions")
        .add({
            creditAccountId: creditAccount,
            debitAccoutID: debitAccount,
            currency: currency,
            transType: "Transfer",
            notes: notes,
            owner: owner,
            transactionDate: transferDate,
            transactionAmount: amount,
            creditorId: "",
            debitorId: "",
            categoryId: "",
            subCategoryId: "",
            timestamp: new Date()
        }).then(function (obj) {
            creditAccount(creditAccount, amount);
            debitAccount(debitAccount, amount);
        }).catch(function (err) {
            console.log(err);
        });
    }