import React from 'react';
import {
    Text, View, FlatList, TouchableOpacity, Button, SafeAreaView
 } from 'react-native';
 import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import addCommas from  '../config/functions';

 class Accounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            dbUser: this.props.navigation.state.params.dbUser,
            user: null,
            accounts: [],
            refreshing: false
        }
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
                that.fetchAccounts();
            } else {
                //Not logged in
                that.setState({
                    loggedin: false
                });
            }
        });
    }

    fetchAccounts = () => {
        var that = this;
        database.collection("accounts")
        .where("uid", "==", that.state.user.uid)
        .onSnapshot(function(snapshot) {
            var accounts = [];
            snapshot.forEach(function(doc) {
                var account = doc.data();
                var epoch = account.createdOn.seconds;
                if (account.balanceAsOf) {
                    epoch = account.balanceAsOf.seconds;
                } else {
                    account.balanceAsOf = account.createdOn;
                }

                var asOf = new Date(epoch * 1000);
                account.dbUser = that.state.dbUser;
                account.id = doc.id;
                account.formattedValue = addCommas(account.currentBalance);
                account.navigation = that.props.navigation;
                account.symbol = that.state.dbUser.currencySymbol;
                account.asOf = asOf.toDateString();
                accounts.push(account);
            });
            that.setState({
                accounts: accounts
            })
        } );
    }

    openAccountDetails(account){
        const { navigate } = this.props.navigation;
        navigate('AccountDetails');
    }

    static navigationOptions = ({navigation}) => ({
        title: 'Accounts',
        headerRight: () => (
            <Button
              onPress={() =>  navigation.navigate('AccountDetails', {editing: false, dbUser: navigation.getParam('dbUser', null), account: null})}
              title="New Account"
            />
          ),
      });

    renderRow({item, index}) {
        const styles = appStyle();
        var that = this;
        return (
            
            <TouchableOpacity onPress={() => {
                item.navigation.navigate('AccountSummary', {account: item, accountName: item.accountName, dbUser: item.dbUser});
            }}>
                
                <View style={styles.rowStyle}>
                    <View>
                        <Text style={{fontWeight: "bold"}}>{item.accountName}</Text>
                        {item.currentBalance > 0 ? (<Text style={{color: "green"}}>{item.symbol}{item.formattedValue}</Text>)
                        : (<Text style={{color: "red"}}>{item.symbol}{item.formattedValue}</Text>)}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const styles = appStyle();
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView style={styles.container}>
            { this.state.loggedin == true ? (
                <View style={styles.container}>
                    <View style={styles.container}>
                        <FlatList
                            data = {this.state.accounts}
                            keyExtractor={(item, index) => index.toString()}
                            onRefresh={this.fetchAccounts}
                            refreshing={this.state.refreshing}
                            renderItem={this.renderRow}
                        />
                    </View>
                    <View style={{padding: 10, backgroundColor:"lightgrey", flexDirection: "row", justifyContent: "flex-start"}}>
                       <TouchableOpacity onPress={() => (navigate('Transfers', {dbUser: this.state.dbUser}))}>
                        <View style={{alignItems: "center"}}>
                                <MaterialCommunityIcons name="rotate-3d" size={32} color="blue" />
                                <Text>Transfers</Text>
                            </View>
                       </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View>
                    <Text>You are not logged in</Text>
                    <Text>Please log in to view this page</Text>
                </View>                
            )} 
            
            </SafeAreaView>
        )
    }
 }

 export default Accounts;