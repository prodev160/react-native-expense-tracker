import React from 'react';
import {
    Text, View, TouchableOpacity, Button, SafeAreaView
 } from 'react-native';

 import {f, auth, database } from '../config/config';
 import appStyle from '../config/style';

 class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false
        }
    }

    logoff() {
        f.auth().signOut();
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
        const styles = appStyle();
        return (
            <SafeAreaView style={styles.droidSafeArea}>
            { this.state.loggedin == true ? (
                <View>
                   <Text style={{textAlign: "center",  fontSize: 32, borderBottomColor: "grey", borderBottomWidth: 1}}>Expense Tracker</Text>
                   <View style={{flex: 1}}>
                    <Text></Text>
                   </View>
                   <View>
                    <Button title="Logout" onPress={this.logoff}/>
                   </View>
                </View>
            ) : (
                <View style={styles.centerContainer}>
                    <Text>You are not logged in</Text>
                    <Text>Please log in to view this page</Text>
                </View>                
            )} 
            
            </SafeAreaView>
        )
    }
 }

 export default Dashboard;