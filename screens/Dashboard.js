import React from 'react';
import {
    Text, View, TouchableOpacity, Button, SafeAreaView
 } from 'react-native';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import  '../config/functions';

 class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            user: null,
            expenses: [],
            income: [],
            transfers: [],
            accounts: [],
            categories: [],
            loading: true,
            refresh: false,
            expenseTotal: 0,
            incomeTotal: 0,
            transfersTotal: 0,
            accountsTotal: 0,
            categoriesTotal: 0,
            subcategories: [],
        }
    }

    logoff() {
        f.auth().signOut();
    }

    loadTransactions = () => {
        this.setState({
            refresh: true,
            loading: true
        });
        var that = this;
        database.collection("transactions")
        .where("owner", "==", that.state.user.uid)
            .onSnapshot(function(snapshot) {
                var expenses = [];
                var income = [];
                var transfers = [];
                
                snapshot.forEach(function(doc) {
                    if (doc.data().transType == "Expense")
                        expenses.push(doc.data());
                    if (doc.data().transType == "Income")
                        income.push(doc.data());
                    if (doc.data().transType == "Transfer")
                        transfers.push(doc.data());
                });
                that.setState({
                    refresh: false,
                    loading: false,
                    expenses: expenses,
                    income: income,
                    transfers: transfers
                });
            });
    }

    loadAccounts = () => {
        var that = this;
        database.collection("accounts")
        .where("uid", "==", that.state.user.uid)
        .onSnapshot(function(snapshot) {
            var accounts = [];
            snapshot.forEach(function(doc) {
                accounts.push(doc.data());
            });
            that.setState({accounts: accounts});
        });
    }

    loadCategories = () => {
        var that = this;
        database.collection("categories")
        .where("owner", "==", that.state.user.uid)
        .onSnapshot(function (snapshot) {
            var categories = [];
            snapshot.forEach(function (doc) {
                var cat = doc.data();
                cat.id = doc.id;
                cat.totalBudget = 0;
                categories.push(cat);
            });
            that.setState({categories: categories});
        });
    }

    loadSubCategories = () => {
        var that = this;
        database.collection("subcategories")
        .onSnapshot(function (snap){
            var subcategories = [];
            snap.forEach(function (subDoc) {
                subcategories.push(subDoc.data());
            });
            that.setState({subcategories: subcategories});
            that.calculateTotals();
        });
    }

    calculateTotals = () => {
        var exp = 0;
        var inc = 0;
        var tra = 0;
        var acc = 0;
        var budg = 0;
        for (var i = 0; i < this.state.expenses.length; i++) {
            exp += this.state.expenses[i].transactionAmount;
        }
        for (var i = 0; i < this.state.income.length; i++) {
            inc += this.state.income[i].transactionAmount;
        }
        for (var i = 0; i < this.state.transfers.length; i++) {
            tra += this.state.transfers[i].transactionAmount;
        }
        for (var i = 0; i < this.state.accounts.length; i++) {
            acc += this.state.accounts[i].currentBalance;
        }
        for (var i = 0; i < this.state.subcategories.length; i++) {
          budg += this.state.subcategories[i].budget;
        }
        this.setState({
            expenseTotal: exp,
            incomeTotal: inc,
            transfersTotal: tra,
            accountsTotal: acc,
            categoriesTotal: budg
        });
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user) {
            if (user) {
                //Logged in
                that.setState({
                    loggedin: true,
                    user: user,
                    transactions: []
                });
                that.loadTransactions();
                that.loadAccounts();
                that.loadCategories();
                that.loadSubCategories();
            } else {
                //Not logged in
                that.setState({
                    loggedin: false
                });
            }
        });
    };

    static navigationOptions = {
        title: 'Expense Tracker',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      };

    render() {
        const styles = appStyle();
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView style={styles.droidSafeArea}>
            { this.state.loggedin == true ? (
                <View style={styles.container} >
                   <View style={{flex: 1}}>
                       <Text style={{marginBottom:50, marginTop:20, textAlign: "center", fontWeight: "bold"}}>December 2019</Text>
                       <TouchableOpacity
                        onPress={() => navigate('Accounts')}
                       >
                      <View style={styles.dashboardWidgetContainer}>
                           <Text style={styles.dashboardWidgetText}>Accounts</Text>
                           <Text style={styles.dashboardWidgetText}>{this.state.accountsTotal}</Text>
                       </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigate('Expenses')}>
                      <View style={styles.dashboardWidgetContainer}>
                           <Text style={styles.dashboardWidgetText}>Expenses</Text>
                           <Text style={styles.dashboardWidgetText}>{this.state.expenseTotal}</Text>
                       </View>
                      </TouchableOpacity>
                       <TouchableOpacity onPress={() => navigate('Income')}>
                       <View style={styles.dashboardWidgetContainer}>
                           <Text style={styles.dashboardWidgetText}>Income</Text>
                           <Text style={styles.dashboardWidgetText}>{this.state.incomeTotal}</Text>
                       </View>
                       </TouchableOpacity>
                       <TouchableOpacity>
                       <View style={styles.dashboardWidgetContainer}>
                           <Text style={styles.dashboardWidgetText}>Transfers</Text>
                           <Text style={styles.dashboardWidgetText}>{this.state.transfersTotal}</Text>
                       </View>
                       </TouchableOpacity>
                       <TouchableOpacity>
                       <View style={styles.dashboardWidgetContainer}>
                           <Text style={styles.dashboardWidgetText}>Budget</Text>
                           <Text style={styles.dashboardWidgetText}>{this.state.categoriesTotal}</Text>
                       </View>
                       </TouchableOpacity>
                   </View>
                   <View>
                    <Button title="Logout" onPress={this.logoff}/>
                   </View>
                </View>
            ) : (
                <View style={styles.centerContainer}>
                    <Text>You are not logged in</Text>
                    <Text>Please log in to view this page</Text>
                </View>                
            )} 
            
            </SafeAreaView>
        )
    }
 }

 export default Dashboard;