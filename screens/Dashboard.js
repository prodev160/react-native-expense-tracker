import React from 'react';
import {
    Text, View, TouchableOpacity, Button
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
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            { this.state.loggedin == true ? (
                <View style={styles.container}>
                    <Button title="Log Out" onPress={this.logoff}></Button>
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

 export default Dashboard;