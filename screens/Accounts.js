import React from 'react';
import {
    Text, View, FlatList, TouchableOpacity, Button, SafeAreaView
 } from 'react-native';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import addCommas from  '../config/functions';

 class Accounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            user: null,
            accounts: [],
            refreshing: false,
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
                account.formattedValue = addCommas(account.currentBalance);
                
                accounts.push(account);
            });
            that.setState({
                accounts: accounts
            })
        } );
    }

    openAccountDetails(accountID) {
        const { navigate } = this.props.navigation;
        navigate('AccountDetails');
    }

    static navigationOptions = ({navigation}) => ({
        title: 'Accounts',
        headerRight: () => (
            <Button
              onPress={() =>  navigation.navigate('AccountDetails')}
              title="New Account"
            />
          ),
      });

    renderRow({item, index}) {
        return (
            
            <TouchableOpacity>
                
                <View style={{marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "grey"}}>
                    <View>
                        <Text style={{fontWeight: "bold"}}>{item.accountName}</Text>
                        {item.currentBalance > 0 ? (<Text style={{color: "green"}}>{item.currency} {item.formattedValue}</Text>)
                        : (<Text style={{color: "red"}}>{item.currency} {item.formattedValue}</Text>)}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const styles = appStyle();
        return (
            <SafeAreaView style={styles.container}>
            { this.state.loggedin == true ? (
                <View style={{flex: 1}}>
                    <FlatList
                        data = {this.state.accounts}
                        keyExtractor={(item, index) => index.toString()}
                        onRefresh={this.fetchAccounts}
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
            
            </SafeAreaView>
        )
    }
 }

 export default Accounts;