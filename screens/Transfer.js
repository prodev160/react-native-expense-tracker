import React from 'react';
import {
    Text, View, FlatList, TouchableOpacity, TextInput, Button
 } from 'react-native';
 import DateTimePicker from '@react-native-community/datetimepicker';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import addCommas from  '../config/functions';

 class TransferObject {
    constructor(
        transferDate,
        fromAccountID,
        toAccountID,
        amount,
        notes,
        owner,
        id
    ) {
        this.transferDate = transferDate;
        this.fromAccountID = fromAccountID;
        this.toAccountID = toAccountID;
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
            refreshing: false,
            showTransferDate: false,
            user: [],
        };
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
            title: 'Transfer'
        }
    };

    setTransferDate = (event, transferDate) => {
        this.setState({
            showTransferDate: Platform.OS === 'ios' ? true : false,
            transferDate
        })
    }

    show = mode => {
        this.setState({
            showTransferDate: true,
            mode
        })
    }

    datepicker = () => {
        this.show('date');
    }

    hideDateSelectorIos = () => {
        this.setState({showTransferDate: false})
    }

    render() {
        const styles = appStyle();
        return (
            <View style={styles.container}>
            { this.state.loggedin == true ? (
                <View style={{flex: 1, alignItems: "center"}}>
                    <Text>Date</Text>
                    <TextInput
                        style={styles.inputBox}
                        onTouchStart={this.datepicker}
                        editable={false}
                        value={'Transfer Date : ' + this.state.transfer.transferDate.toDateString()}
                    />
                    {
                        this.state.showTransferDate && 
                        <View style={{width: '100%'}}>
                            <DateTimePicker value={this.state.transfer.transferDate}
                                        mode={this.state.mode}
                                        is24hour={true}
                                        display="default"
                                        onChange={this.setTransferDate} />
                            <View style={{alignItems: "center"}}>
                                {Platform.OS === 'ios' && <Button onPress={this.hideDateSelectorIos} title="Set Date"></Button> }
                            </View>
                        </View>
                    }
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