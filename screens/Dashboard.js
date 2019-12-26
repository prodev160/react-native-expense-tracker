import React from 'react';
import {
    Text, View, TouchableOpacity, Button, SafeAreaView, FlatList
 } from 'react-native';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import addCommas from  '../config/functions';
 import { ScrollView } from 'react-native-gesture-handler';
 import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';


 class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            user: null,
            transactions: [],
            expenses: [],
            income: [],
            transfers: [],
            accounts: [],
            categories: [],
            subcategories: [],
            dbUser: [],
            loading: true,
            refresh: false,
            expenseTotal: 0,
            incomeTotal: 0,
            transfersTotal: 0,
            accountsTotal: 0,
            categoriesTotal: 0,
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
                var transactions = [];
                snapshot.forEach(function(doc) {
                    var transaction = doc.data();
                    transaction.dateString = that.timeConverter(transaction.transactionDate.seconds)
                    transactions.push(transaction);
                    if (transaction.transType == "Expense")
                        expenses.push(transaction);
                    if (transaction.transType == "Income")
                        income.push(transaction);
                    if (transaction.transType == "Transfer")
                        transfers.push(transaction);
                });
                that.setState({
                    refresh: false,
                    loading: false,
                    expenses: expenses,
                    income: income,
                    transfers: transfers,
                    transactions: transactions
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

    loadUser = () => {
        var that = this;
        var ref = database.collection("users").doc(that.state.user.uid);
        ref.get().then(function(doc) {
            if (doc.exists) {
                that.setState({dbUser: doc.data()});
            } else {
                console.log("User doc not found for " + that.state.user.uid);
            }
        })
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
        for (var i = 0; i < this.state.categories.length; i++) {
          for (var j = 0; j < this.state.subcategories.length; j++) {
              if (this.state.subcategories[j].categoryId == this.state.categories[i].id)
                budg += this.state.subcategories[j].budget;
          }
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
                that.loadUser();
            } else {
                //Not logged in
                that.setState({
                    loggedin: false
                });
            }
        });
    };

    pluralCheck = (s) => {
        if (s==1) {
            return ' ago';
        } else {
            return 's ago';
        }
    }

    timeConverter = (timestamp) => {
        var a = new Date(timestamp * 1000);
        var seconds = Math.floor((new Date() - a) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + ' year' + this.pluralCheck(interval);
        }

       interval = Math.floor(seconds / 2592000);
       if (interval > 1) {
           return interval + ' month' + this.pluralCheck(interval);
       }

       interval = Math.floor(seconds / 86400);
       if (interval > 1) {
           return interval + ' day' + this.pluralCheck(interval);
       }

       interval = Math.floor(seconds / 3600);
       if (interval > 1) {
           return interval + ' hour' + this.pluralCheck(interval);
       }

       interval = Math.floor(seconds / 60);
       if (interval > 1) {
           return interval + ' minute' + this.pluralCheck(interval);
       }

       return Math.floor(seconds) + ' second' + this.pluralCheck(seconds);
    }

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
                <View style={{flex: 1}}>
                    <ScrollView>
                        <View style={{flex: 1, backgroundColor: 'white'}}>
                            <View style={{
                                height: 200, 
                                backgroundColor: '#f4511e', 
                                borderBottomLeftRadius: 50, 
                                borderBottomRightRadius: 50
                                }}>
                                <View style={{
                                    flexDirection: 'row', 
                                    justifyContent: "space-evenly",
                                    marginTop: 20, 
                                    marginLeft: 20
                                    }}>
                                    <View>
                                        <Text style={{
                                            fontSize: 28,
                                            fontWeight: "bold",
                                            color: "white"
                                        }}>{this.state.dbUser.currencySymbol}{addCommas(this.state.accountsTotal)}</Text>
                                        <Text style={{color: "white", fontSize: 12}}>Account Balance (All Accounts)</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => navigate('Accounts')}
                                    >
                                    <View style={{
                                        marginLeft: 20,
                                        marginBottom: 20,
                                        width: 150,
                                        borderRadius: 30,
                                        height: 50,
                                        backgroundColor: "#33B2FF",
                                        shadowOpacity: 0.6,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}>
                                        <Text style={{
                                            textAlign: "center",
                                            padding: 10,
                                            fontSize: 20,
                                            color: "white",
                                            textAlignVertical: "center"
                                        }}>Accounts</Text>
                                    </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{
                                marginHorizontal: 20, 
                                height: 330, 
                                borderRadius: 10, 
                                marginTop: 10, 
                                position: "absolute", 
                                top: 80, 
                                width: '90%',
                                backgroundColor: "white",
                                shadowOpacity: 0.6,
                                shadowRadius: 4,
                                elevation: 3,
                                }}>
                                    <View style={{
                                        height: 60,
                                        width: '90%',
                                        left: '5%',
                                        top: 10,
                                        paddingTop: 30,
                                        flexDirection: 'row',
                                        justifyContent: 'space-evenly'
                                    }}>
                                        <View style={{alignItems: "center"}}>
                                            <MaterialCommunityIcons name="rotate-3d" size={32} color="blue" />
                                            <Text style={{color: "grey"}}>Transfer</Text>
                                        </View>

                                        <View style={{alignItems: "center"}}>
                                            <MaterialCommunityIcons name="briefcase-upload" size={32} color="green" />
                                            <Text style={{color: "grey"}}>Income</Text>
                                        </View>

                                        <View style={{alignItems: "center"}}>
                                            <MaterialCommunityIcons name="briefcase-download" size={32} color="red" />
                                            <Text style={{color: "grey"}}>Expense</Text>
                                        </View>
                                    </View>
                                    <View style={{flex: 1, margin: 10, paddingTop: 60}}>
                                        <TouchableOpacity onPress={() => (navigate('Transfers'))} >
                                            <View style={styles.dashboardWidgetContainer}>
                                                <MaterialCommunityIcons name="rotate-3d" size={32} color="blue" />
                                                <Text style={{flex: 1, marginTop: 5, fontWeight: "bold", fontSize: 18}}>Transfers</Text>
                                                <Text style={{marginRight: 5, marginTop: 5, color: "blue", fontWeight: "bold"}}>{this.state.dbUser.currencySymbol}{addCommas(this.state.transfersTotal)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => (navigate('Income'))} >
                                            <View style={styles.dashboardWidgetContainer}>
                                                <Feather name="chevrons-up" size={32} color="green" />
                                                <Text style={{flex: 1, marginTop: 5, fontWeight: "bold", fontSize: 18}}>Income</Text>
                                                <Text style={{marginRight: 5, marginTop: 5, color: "green", fontWeight: "bold"}}>{this.state.dbUser.currencySymbol}{addCommas(this.state.incomeTotal)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => (navigate('Expenses'))} >
                                            <View style={styles.dashboardWidgetContainer}>
                                                <Feather name="chevrons-down" size={32} color="red" />
                                                <Text style={{flex: 1, marginTop: 5, fontWeight: "bold", fontSize: 18}}>Expenses</Text>
                                                <Text style={{marginRight: 5, marginTop: 5, color: "red", fontWeight: "bold"}}>{this.state.dbUser.currencySymbol}{addCommas(this.state.expenseTotal)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => (navigate('Budget'))} >
                                            <View style={styles.dashboardWidgetContainer}>
                                                <MaterialCommunityIcons name="rotate-3d" size={32} color="purple" />
                                                <Text style={{flex: 1, marginTop: 5, fontWeight: "bold", fontSize: 18}}>Budget</Text>
                                                <Text style={{marginRight: 5, marginTop: 5, color: "purple", fontWeight: "bold"}}>{this.state.dbUser.currencySymbol}{addCommas(this.state.categoriesTotal)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                            </View>
                        </View>
                        <View
                            style={{
                                marginHorizontal: 20, 
                                height: 200, 
                                borderRadius: 10, 
                                marginTop: 10, 
                                position: "absolute", 
                                top: 420, 
                                width: '90%',
                                backgroundColor: "white",
                                shadowOpacity: 0.6,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Text style={{fontWeight: 'bold', marginTop: 10, marginLeft: 10}}>Recent transactions</Text>
                            <FlatList
                                style={styles.videos_flatList}
                                horizontal={true}
                                data={this.state.transactions}
                                renderItem={({item}) => 
                                    <TouchableOpacity>
                                        <View style={{
                                            borderWidth: 2,
                                            borderColor: 'grey',
                                            elevation: 3,
                                            borderRadius: 10,
                                            width: 100,
                                            height: '90%',
                                            marginRight: 20,
                                            marginBottom: 20,
                                            padding: 10
                                        }}>
                                            <Text style={{fontWeight: 'bold'}}>{item.transType}</Text>
                                            <Text>{item.dateString}</Text>
                                            <Text>{this.state.dbUser.currencySymbol}{addCommas(item.transactionAmount)}</Text>
                                            <Text>{item.description}</Text>
                                            <Text>{item.notes}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }

                                ItemSeparatorComponent={() => {
                                    return (
                                        <View
                                            style={{
                                            height: "100%",
                                            width: 2,
                                            backgroundColor: "white",//"#CED0CE",
                                            }}
                                        />
                                    );
                                }}

                                keyExtractor={(item, index) => index.toString()}
/>
                        </View>
                    </ScrollView>
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