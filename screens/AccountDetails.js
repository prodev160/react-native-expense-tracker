import React, { Component } from 'react';
import {
    Text, View, TouchableOpacity, TextInput, Button, Platform
 } from 'react-native';
 
 import DateTimePicker from '@react-native-community/datetimepicker';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';

 class AccountDetails extends React.Component {
    constructor(props) {
        super(props);
        var editing = this.props.navigation.state.params.editing;
        var account = this.props.navigation.state.params.account;
        this.state = {
            user: null,
            dbUser: this.props.navigation.state.params.dbUser,
            account: account,
            editing: editing,
            loggedin: false,
            saveError: false,
            errorMessage: '',
            accountName: editing ? account.accountName : '',
            accountNumber: editing ? account.accountNo : '',
            accountType: editing ? account.accountType : 'Cash',
            accountBalance: editing ? account.openingBalance.toString() : '0.00',
            asOfDate: editing ? new Date(account.balanceAsOf.seconds * 1000) : new Date(),
            showAsOf: false,
            mode: 'date',
        };
       
    }

    setAsOfDate = (event, asOfDate) => {
        this.setState({
            showAsOf: Platform.OS === 'ios' ? true : false,
            asOfDate
        })
    }

    show = mode => {
        this.setState({
            showAsOf: true,
            mode
        })
    }

    datepicker = () => {
        this.show('date');
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
                //that.loadUser();
            } else {
                //Not logged in
                that.setState({
                    loggedin: false,
                    user: null
                });
            }
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

    save = async() => {
        var that = this;
       if (this.state.editing) {
           f.firestore().collection("accounts").doc(that.state.account.id)
           .update({
            accountName: that.state.accountName,
            accountNo: that.state.accountNumber,
            accountType: that.state.accountType,
            openingBalance: parseFloat(that.state.accountBalance),
            balanceAsOf: that.state.asOfDate,
            currentBalance: parseFloat(that.state.accountBalance) - that.state.account.allDebits + that.state.account.allCredits,
            updatedOn: new Date()
           }).then(function(){
            that.props.navigation.navigate('Accounts');
        }).catch(function (error) {
            console.log("Error when updating account: " + error);
            that.setState({
                error: true,
                errorMessage: error
            })
        })
       } else {
            f.firestore().collection("accounts").add({
                accountName: that.state.accountName,
                accountNo: that.state.accountNumber,
                accountType: that.state.accountType,
                openingBalance: parseFloat(that.state.accountBalance),
                balanceAsOf: that.state.asOfDate,
                currentBalance: parseFloat(that.state.accountBalance),
                currency: that.state.dbUser.defaultCurrency,
                uid: that.state.user.uid,
                createdOn: new Date(),
                updatedOn: new Date(),
                allCredits: 0,
                allDebits: 0
            }).then(function (accountRef) {
                that.props.navigation.navigate('Accounts');
            }).catch(function (error) {
                console.log("Error when saving account: " + error);
                that.setState({
                    error: true,
                    errorMessage: error
                })
            })
       }
    }

    hideDateSelectorIos = () => {
        this.setState({showAsOf: false})
    }

    accTypeAlert() {
        alert("Enter one of Cash, Checking, Credit, Online Wallet etc");
    }

    render() {
        const { navigate } = this.props.navigation;
        const styles = appStyle();
        return (
            <View style={{marginTop: 20, marginHorizontal: 20}}>
            { this.state.loggedin == true ? (
                <View>
                    <TextInput
                        style={styles.inputBox}
                        value={this.state.accountName}
                        onChangeText={accountName => this.setState({ accountName })}
                        placeholder='Account Name'
                    />
                    <TextInput
                        style={styles.inputBox}
                        value={this.state.accountNumber}
                        onChangeText={accountNumber => this.setState({ accountNumber })}
                        placeholder='Account Number'
                    />
                    <View style={{flexDirection:"row"}}>
                        <TextInput
                            style={styles.inputBox}
                            value={this.state.accountType}
                            onChangeText={accountType => this.setState({ accountType })}
                            placeholder='Account Type'
                        />
                        <Button title="i" onPress={this.accTypeAlert}></Button>
                    </View>
                    <TextInput
                        style={styles.inputBox}
                        value={this.state.accountBalance}
                        keyboardType="number-pad"
                        onChangeText={accountBalance => this.setState({ accountBalance })}
                        placeholder='Account Balance'
                    />
                    <TextInput
                        style={styles.inputBox}
                        onTouchStart={this.datepicker}
                        editable={false}
                        value={'Balance As Of: ' + this.state.asOfDate.toDateString()}
                    />
                    {
                        this.state.showAsOf && <View>
                            <DateTimePicker value={this.state.asOfDate}
                                        mode={this.state.mode}
                                        is24hour={true}
                                        display="default"
                                        onChange={this.setAsOfDate} />
                            <View style={{flexDirection:"row"}}>
                                {Platform.OS === 'ios' && <Button onPress={this.hideDateSelectorIos} title="Set Date"></Button> }
                            </View>
                            </View>
                    }
                     {this.state.saveError ? <Text style={styles.errorText}>{this.state.errorMessage}</Text> : <Text></Text> }
                    <TouchableOpacity style={styles.button} onPress={this.save}>
                        <Text style={styles.buttonText}>Save Account</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>You are not logged in</Text>
                    <Text>Please log in to view this page</Text>
                </View>                
            )} 
            
            </View>
        )
    }
 }

 export default AccountDetails;