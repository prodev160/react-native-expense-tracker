import React from 'react';
import {
    Text, View
 } from 'react-native';

 import {f, auth, database } from '../config/config';

 class AccountDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false
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

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            { this.state.loggedin == true ? (
                <Text>Account Details</Text>
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

 export default AccountDetails;