import React from 'react';
import {
    Text, View, TouchableOpacity, Button, SafeAreaView
 } from 'react-native';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';
 import  '../config/functions';

 class Accounts extends React.Component {
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

    static navigationOptions = {
        title: 'Accounts',
      };

    render() {
        const styles = appStyle();
        return (
            <SafeAreaView style={styles.container}>
            { this.state.loggedin == true ? (
                <View>
                    
                   
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