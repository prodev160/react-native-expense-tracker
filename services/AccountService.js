import {f, auth, database } from '../config/config';

export function debitAccount(accountId, amount) {
    console.log('debiting ' + accountId + ' with ' + amount);
    creditAccount(accountId, 0 - amount);
}

export function creditAccount(accountId, amount) {
    console.log('crediting ' + accountId + ' with ' + amount);
    f.firestore().collection("accounts").doc(accountId)
    .get()
    .then(function(doc) {
        if (doc.exists) {
            var account = doc.data();
            var accountBalance = parseFloat(account.currentBalance);
            accountBalance += amount;
            f.firestore().collection("accounts").doc(doc.id)
            .update({currentBalance: accountBalance});
        }
    })
}

export function getAccount(accountId) {
    f.firestore().collection("accounts").doc(accountId)
    .get(function (snapshot) {
        
    })
}

export function transferMoney(
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
