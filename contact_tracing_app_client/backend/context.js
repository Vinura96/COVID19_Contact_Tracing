import React, {Component} from 'react';

const Context = React.createContext();

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

class ContextProvider extends Component {
  state = {
    isLoggedIn: false,
    isLoadingApp: false,
    user: null,
    userID: '',
    phone: '',
    name: '',
    address: '',
    uid: null,
    notifications: [],
    startingApp: true,
    isNewUser: false,
    authLoading: false,
  };
  componentDidMount() {
    this.authenticateUser();
  }

  setAppLoading = (value) => {
    this.setState({isLoadingApp: value});
  };

  authenticateUser = () => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user,
          uid: user.uid,
          phone: user.phoneNumber,
        });
        this.updateUserData(user);
      } else {
        this.setState({
          isLoggedIn: false,
          user: null,
          isLoadingApp: false,
          startingApp: false,
          uid: null,
          phone: '',
          name: '',
          address: '',
        });
      }
    });
  };

  updateUserData = async (user) => {
    const data = await database()
      .ref('/users/' + user.uid)
      .once('value')
      .then(function (snapshot) {
        return snapshot.val();
      });
    if (data) {
      this.setState({
        name: data.name,
        address: data.address,
        isLoggedIn: true,
        isLoadingApp: false,
        isNewUser: false,
        authLoading: false,
        startingApp: false,
      });
    } else {
      this.setState({
        isNewUser: true,
        authLoading: false,
        isLoadingApp: false,
        startingApp: false,
      });
    }
  };

  signOut = () => {
    auth().signOut();
    this.setState({user: null, isLoggedIn: false});
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          signOut: this.signOut,
          setAppLoading: this.setAppLoading,
          updateUserData: this.updateUserData,
          setAuthLoading: (value) => this.setState({authLoading: value}),
          setName: (value) => this.setState({name: value}),
          setAddress: (value) => this.setState({address: value}),
        }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export {ContextProvider, Context};
