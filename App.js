import React from 'react';
import { TouchableOpacity, Text, View, YellowBox, Button } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import Dashboard from './screens/Dashboard';
import Expenses from './screens/Expenses';
import Income from './screens/Income';
import Accounts from './screens/Accounts';
import AccountDetails from './screens/AccountDetails';

import {f, auth, database} from './config/config';
import { TextInput } from 'react-native-gesture-handler';
import appStyle from './config/style';
import addCommas from './config/functions';

import firebase from 'firebase';

const MainStack = createAppContainer(createStackNavigator(
  {
    Dashboard: { screen: Dashboard },
    Accounts: { screen: Accounts },
    Income: { screen: Income },
    Expenses: { screen: Expenses },
    AccountDetails: { screen: AccountDetails },
  },
  {
    defaultNavigationOptions: {
      tabBarVisible: false,
    },
  }
));

export default class App extends React.Component {
  componentDidMount() {
    var that = this;
    f.auth().onAuthStateChanged(function(user) {
      if (user) {
          //Logged in
          that.setState({
            loggedIn: true,
            loading: false
          });
      } else {
          //Not logged in
          that.setState({
            loggedIn: false
          });
      }
  });
  }

  login = async() => {
    var that = this;
    that.setState({loading: true})
    try{
      console.log('Starting auth...');
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
      console.log('Finished auth...');
    } catch(error) {
      console.log('Auth error ' + error);
      alert(error);
    }
  }

  signup = async() => {
    var that = this;
    that.setState({loading: true})
    try{
      console.log('Starting signup');
      await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
      console.log('Firebase signup finished. Saving new user to database');
      await database.collection("users").add({
        "currencySymbol": "USD",
        "defaultCurrency": "USD",
        "setupComplete": false,
        "firstName": this.state.firstName,
        "lastName": this.state.lastName,
        "email": this.state.email,
        "password": this.state.password,
        "isGoogleUser": false,
        "profileImageUrl": ""
      });
      console.log('User saved');
    } catch(error) {
      alert(error);
    }
  }

  constructor(props) {
    super(props);
    //Ignore specific warnings
    YellowBox.ignoreWarnings(['Setting a timer']);
    
    this.state = {
      currentUser: null,
      loading: false,
      loggedIn: false,
      signup: false,
      email: 'john.doe@email.com',
      password: '123456',
      firstName: 'New',
      lastName: 'User',
      loginError: false,
      loginErrorMessage: 'Test error',
      signupError: false,
      signupErrorMessage: ''
    };
  }

  render() {
    const styles = appStyle();
    if (this.state.loading) {
      return (
        <View style={styles.centerContainer}><Text>Loading....</Text></View>
      )
    }
    else if (this.state.loggedIn == false) {
       if (this.state.signup) {
         return (
          <View style={styles.centerContainer}>
          <Text style={styles.titleText}>Expense Tracker</Text>
          <Text style={styles.subtitleText}>User Registration</Text>
          <TextInput
              style={styles.inputBox}
              value={this.state.firstName}
              onChangeText={firstName => this.setState({ firstName })}
              placeholder='First Name'
          />
          <TextInput
              style={styles.inputBox}
              value={this.state.lastName}
              onChangeText={lastName => this.setState({ lastName })}
              placeholder='Last Name'
          />
          <TextInput
              style={styles.inputBox}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              placeholder='Email'
              autoCapitalize='none'
          />
          <TextInput
              style={styles.inputBox}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              placeholder='Password'
              secureTextEntry={true}
          />
          {this.state.signupError ? <Text style={styles.errorText}>{this.state.signupErrorMessage}</Text> : <Text></Text> }
          <TouchableOpacity style={styles.button} onPress={this.signup}>
              <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Button 
              onPress={ () => this.setState({signup: false}) }
              title="Already an account? Log In" 
          />
      </View>
         );
       } else {
        return (
          <View style={styles.centerContainer}>
                <Text style={styles.titleText}>Expense Tracker</Text>
                <Text style={styles.subtitleText}>User Login</Text>
                <TextInput
                    style={styles.inputBox}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    placeholder='Email'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.inputBox}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                {this.state.loginError ? <Text style={styles.errorText}>{this.state.loginErrorMessage}</Text> : <Text></Text> }
                <TouchableOpacity style={styles.button} onPress={this.login}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <Button  
                    onPress={ () => this.setState({signup: true}) }
                    title="Don't have an account yet? Sign up" />
            </View>
        );
       }
     } else {
      return (<MainStack />);
     }
  }
}