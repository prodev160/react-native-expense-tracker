import React from 'react';
import {
    Text, View, TouchableHighlight
 } from 'react-native';
 import DateTimePicker from '@react-native-community/datetimepicker';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import addCommas from  '../config/functions';

 import t from 'tcomb-form-native';
 import moment from 'moment';
 
 import { debitAccount, creditAccount, transferMoney} from '../services/AccountService';

 class TransferObject {
    constructor(
        date,
        source,
        destination,
        amount,
        notes,
        owner,
        id
    ) {
        this.date = date;
        this.source = source;
        this.destination = destination;
        this.amount = amount;
        this.notes = notes;
        this.owner = owner;
        this.id = id;
    }
 }

 class Transfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            dbUser: this.props.navigation.state.params.dbUser,
            transfer: new TransferObject(
                new Date(),
                null,
                null,
                0.00,
                '',
                this.props.navigation.state.params.dbUser.uid
            ),
            user: [],
            genders:  t.enums({
                M: 'Male',
                F: 'Female'
            }),
            accounts: t.enums({}),
            accountList: []
        };
        
    }

    getAccounts() {
        var that = this;
        f.firestore().collection("accounts")
        .where("uid", "==", that.state.user.uid)
        .get()
        .then(function (snapshot) {
            var accounts = [];
            var accountList = [];
            snapshot.forEach(function(doc) {
                var account = doc.data();
                account.accountId = doc.id;
                accounts.push(account.accountName);
                accountList.push(account);
            })
            that.setState({accounts: t.enums.of(accounts, 'Accounts'), accountList});
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    onSave = () => {
        var that = this;
        if (that.refs.form) {
            var transfer = this.state.transfer;
            if (this.state.transfer.source) {
                for (var i = 0; i < this.state.accountList.length; i++) {
                    var account = this.state.accountList[i];
                    console.log(account.accountName, transfer.source);
                    if (account.accountName == transfer.source)
                        transfer.sourceAccountId = account.accountId;
                }
            } 
            if (this.state.transfer.destination) {
                for (var i = 0; i < this.state.accountList.length; i++) {
                    var account = this.state.accountList[i];
                    console.log(account.accountName, transfer.destination);
                    if (account.accountName == transfer.destination)
                        transfer.destinationAccountId = account.accountId;
                }
            } 
            this.setState({transfer});
            f.firestore().collection("transactions")
            .add({
                creditAccountId: transfer.destinationAccountId,
                debitAccoutID: transfer.sourceAccountId,
                currency: "USD",
                transType: "Transfer",
                notes: transfer.notes,
                owner: that.state.user.uid,
                transactionDate: transfer.date,
                transactionAmount: parseFloat(transfer.amount),
                creditorId: "",
                debitorId: "",
                categoryId: "",
                subCategoryId: "",
                timestamp: new Date()
            }).then(function (obj) {
                var transfer = that.state.transfer;
                debitAccount(transfer.sourceAccountId, transfer.amount);
                creditAccount(transfer.destinationAccountId, transfer.amount);
                that.props.navigation.navigate('Transfers', {dbUser: that.state.dbUser});
            }).catch(function (err) {
                console.log(err);
            });
        }
    }
    
     onChange = (value) => {
        this.setState({transfer: value});
    }

     static navigationOptions = ({navigation}) => {
        return {
            title: 'Transfer'
        }
    };

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user) {
            if (user) {
                //Logged in
                that.setState({
                    loggedin: true,
                    user: user
                });
                that.getAccounts();
            } else {
                //Not logged in
                that.setState({
                    loggedin: false
                });
            }
        });
    }


    render() {
        const styles = appStyle();
        var Form = t.form.Form;
 
        var TransferForm = t.struct({
            date: t.Date,            
            source: this.state.accounts,  
            destination: this.state.accounts,
            amount: t.Number,   
            notes: t.maybe(t.String) 
         });

        var options = {
        fields: {
            date: {
                mode: 'date',
                label: 'Transfer Date',
                error: '',
                config: {
                    format: (date) => {
                        return moment(date).format('ddd DD MMM YYYY');
                    },
                    dateFormat: (date) => {
                        return moment(date).format('ddd DD MMM YYYY');
                    },
                }
            }
        }
        };
          
        return (
            <View style={styles.container}>
            { this.state.loggedin == true ? (
                <View style={styles.container, {margin: 10}}>
                    <Form 
                        ref="form"
                        type={TransferForm}
                        options={options}
                        value={this.state.transfer}
                        onChange={this.onChange}
                    />
                    <TouchableHighlight style={styles.blueButton} onPress={this.onSave} underlayColor='#99d9f4'>
                        <Text style={styles.blueButtonText}>Save</Text>
                    </TouchableHighlight>
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

 export default Transfer;
