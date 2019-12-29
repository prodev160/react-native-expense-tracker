import React from 'react';
import {
    Text, View, Button
 } from 'react-native';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import addCommas from  '../config/functions';

 class AccountSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            account: this.props.navigation.state.params.account
        }
    }


    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user) {
            if (user) {
                //Logged in
                that.setState({
                    loggedin: true
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
            title: navigation.getParam('accountName', 'Account Summary'),
        }
    };

    render() {
        const styles = appStyle();
        return (
            <View style={styles.container}>
            { this.state.loggedin == true ? (
                <View>
                    <View style={{width: '100%', backgroundColor: 'lightgrey', padding: 10}}>
                        <Text style={styles.boldText18}>{this.state.account.accountType} account</Text>
                        <Text style={{marginTop: 30, color: "grey", fontSize: 18}}>ALL TRANSACTIONS</Text>
                    </View>
                    <View style={{marginLeft: 20, marginRight: 20}}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 18}}>As Of {this.state.account.asOf}</Text>
                            <Text style={{fontSize: 18}}>{this.state.account.symbol}{addCommas(parseFloat(this.state.account.openingBalance))}</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 18}}> + Funds In</Text>
                            <Text style={{fontSize: 18, color: "green"}}>{this.state.account.symbol}{addCommas(parseFloat(this.state.account.allCredits))}</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 18}}> - Funds Out </Text>
                            <Text style={{fontSize: 18, color: "red"}}>{this.state.account.symbol}{addCommas(this.state.account.allDebits)}</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 18}}>Current Balance</Text>
                            <Text style={{fontSize: 18}}>{this.state.account.symbol}{addCommas(this.state.account.currentBalance)}</Text>
                        </View>
                    </View>
                    <View style={{width: '100%', backgroundColor: 'lightgrey', padding: 10}}>
                        <Text></Text>
                    </View>
                    <View style={{marginLeft: 20, flexDirection: "row", justifyContent: "evenly-spaced"}}>
                        <Button title="Add Expense" />
                        <Button title="Add Income" />
                        <Button title="Monthly View" />
                    </View>
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

 export default AccountSummary;