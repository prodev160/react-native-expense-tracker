import React from 'react';
import {
    Text, View, TouchableOpacity, TextInput, Button
 } from 'react-native';
 

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';

 class AccountDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            saveError: false,
            errorMessage: '',
            accountName: '',
            accountNumber: '',
            accountType: 'Cash',
            accountBalance: 0.00,
            balanceAsOf: new Date(),
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

    save = async() => {
        var that = this;
        var err = false;
        if (that.accountName.length < 1)
            err = true;
        if (err) {
            that.setState({
                saveError: true,
                errorMessage: 'Error: Ensure that all fields have been filled in'
            });
        }
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