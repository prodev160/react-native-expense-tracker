import React from 'react';
import {
    Text, View, FlatList, TouchableOpacity
 } from 'react-native';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import addCommas from  '../config/functions';

 class AccountTransactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            account: this.props.navigation.state.params.account,
            dbUser: this.props.navigation.state.params.dbUser,
            transactions: [],
            refreshing: false,
            user: [],
        };
        this.getTransactions();
    }

    getTransactions = () => {
        var that = this;
        this.setState({loading: true});
        f.firestore().collection("transactions")
        .where("owner", "==", that.state.dbUser.id)
        .orderBy("transactionDate")
        .get()
        .then(function (snapshot) {
            var transactions = [];
            snapshot.forEach(function (doc) {
                var transaction = [];
                transaction = doc.data();
                transaction.transDate = new Date(transaction.transactionDate.seconds * 1000);
                transaction.prettyDate = transaction.transDate.toDateString();
                if (transaction.debitAccountId == that.state.account.id ||
                    transaction.creditAccountId == that.state.account.id
                    ) {
                        transactions.push(transaction);
                    }
            });
            that.setState({transactions: transactions, loading: false});
            for (var t = 0; t < transactions.length; t++) {
                var transaction = transactions[t];
                if (transaction.transType == "Transfer") {
                    transaction.transferDesc = "Unk";
                    var accountId = transaction.debitAccountId;
                    if (transaction.debitAccountId == that.state.debitAccountId)
                        accountId = transaction.creditAccountId;
                    
                    f.firestore().collection("accounts")
                    .doc(accountId)
                    .get()
                    .then(function (doc) {
                        if (doc.exists) {
                            transaction.transferDesc = doc.data().accountName;
                            that.setState({transactions: transactions, loading: false});
                            
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }
        })
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user) {
            if (user) {
                //Logged in
                that.setState({
                    loggedin: true,
                    user: user
                });
            } else {
                //Not logged in
                that.setState({
                    loggedin: false
                });
            }
        });
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('accountName', 'Transactions'),
        }
    };

    renderRow({item, index}) {
        const styles = appStyle();
        var that = this;
        return (
            
            <TouchableOpacity onPress={() => {
                //item.navigation.navigate('EditTransaction', {transaction: item, dbUser: item.dbUser});
            }}>
                
                <View style={styles.rowStyle}>
                    {item.transType == "Transfer" ? (
                        <View>
                            <Text style={{fontWeight: "bold"}}>{item.transType}</Text>
                            <Text>{item.prettyDate}</Text>
                            {
                                item.transType == "Income" 
                                ? 
                                (
                                    <View>
                                        <Text>From: {item.transferDesc}</Text>
                                        <Text style={{color: "green"}}>{item.currency}{addCommas(item.transactionAmount)}</Text>
                                    </View>
                                )
                                : 
                                (
                                    <View>
                                        <Text>To: {item.transferDesc}</Text>
                                        <Text style={{color: "red"}}>{item.currency}{addCommas(item.transactionAmount)}</Text>
                                    </View>
                                )}
                        </View>
                    )
                    : (
                    <View>
                        <Text style={{fontWeight: "bold"}}>{item.transType}</Text>
                        <Text style={{fontWeight: "bold"}}>{item.description}</Text>
                        <Text>{item.prettyDate}</Text>
                        {item.transType == "Income" ? (<Text style={{color: "green"}}>{item.currency}{addCommas(item.transactionAmount)}</Text>)
                        : (<Text style={{color: "red"}}>{item.currency}{addCommas(item.transactionAmount)}</Text>)}
                    </View>
                    )}
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const styles = appStyle();
        return (
            <View style={styles.container}>
            { this.state.loggedin == true ? (
                <View style={styles.container}>
                <FlatList
                    data = {this.state.transactions}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={this.getTransactions}
                    refreshing={this.state.refreshing}
                    renderItem={this.renderRow}
                />
            </View>
            ) : (
                <View>
                    <Text>You are not logged in</Text>
                    <Text>Please log in to view this page</Text>
                </View>                
            )} 
            
            </View>
        )
    }
 }

 export default AccountTransactions;