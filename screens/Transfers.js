import React from 'react';
import {
    Text, View, FlatList, TouchableOpacity
 } from 'react-native';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import addCommas from  '../config/functions';

 class Transfers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
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
        .where("transType", "==", "Transfer")
        .orderBy("transactionDate")
        .get()
        .then(function (snapshot) {
            var transactions = [];
            snapshot.forEach(function (doc) {
                var transaction = [];
                transaction = doc.data();
                transaction.transDate = new Date(transaction.transactionDate.seconds * 1000);
                transaction.prettyDate = transaction.transDate.toDateString();
                transactions.push(transaction);
            });
            that.setState({transactions: transactions, loading: false});
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
            title: 'Transfers',
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
                    <View>
                        <Text style={{fontWeight: "bold"}}>{item.transType}</Text>
                        <Text>{item.prettyDate}</Text>
                        <Text style={{color: "green"}}>{item.currency}{addCommas(item.transactionAmount)}</Text>
                    </View>
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

 export default Transfers;