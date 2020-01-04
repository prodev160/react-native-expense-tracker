import React from 'react';
import {
    Text, View, TouchableHighlight
 } from 'react-native';
 import DateTimePicker from '@react-native-community/datetimepicker';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import addCommas from  '../config/functions';

 import t from 'tcomb-form-native';
 

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
            accounts: [],
        };
        
    }

    getAccounts() {

    }

    onChange(value) {
        //this.setState({transfer: value});
    }
    
    onPress = ()  => {
        var value = this.refs.form.getValue();
        if (value) {
            console.log(value);
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
                that.getAccounts();
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
            title: 'Transfer'
        }
    };


    render() {
        const styles = appStyle();
        var Form = t.form.Form;
 
        var TransferForm = t.struct({
            date: t.Date,            
            source: t.String,  
            destination: t.String,
            amount: t.Number,   
            notes: t.maybe(t.String)   ,
            gender: this.state.genders   
          });
        return (
            <View style={styles.container}>
            { this.state.loggedin == true ? (
                <View style={styles.container, {margin: 10}}>
                    <Form 
                        type={TransferForm}
                        value={this.state.transfer}
                        onChange={this.onChange}
                    />
                    <TouchableHighlight style={styles.button} onPress={this.onSave} underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>Save</Text>
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