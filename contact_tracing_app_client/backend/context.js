import React, {Component} from 'react';

const Context = React.createContext();

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';

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
    contactHistory: {
      data: {},
      today: 0,
      yesterday: 0,
      last3days: 0,
      last7days: 0,
      last14days: 0,
    },
    contactHistoryArray: [],
    isTrackingEnable: false,
  };
  componentDidMount() {
    this.authenticateUser();
    // this.setObjectValue([
    //   {contacted_time: 1591008973859, id: 'ffdffwdfwf445dsfa'},
    //   {contacted_time: 1592118973859, id: 'ffdffwdfwf445dsfa'},
    //   {contacted_time: 1592628973859, id: 'ffdffwdfwf445dsfa'},
    //   {contacted_time: 1592788973859, id: 'ffdffwdfwf445dsfa'},
    //   {contacted_time: 1592888973859, id: 'ffdffwdfwf445dsfa'},
    //   {contacted_time: 1592958973859, id: 'ffdffwdfwf445dsfa'},
    // ]);
    this.getContactHistoryFromLocal();
  }

  setAppLoading = (value) => {
    this.setState({isLoadingApp: value});
  };

  setTracking = (val) => {
    this.setState({isTrackingEnable: val});
    console.log('Tracking changed!');
    this.handleNewUserContact('ffdffwdfwf445dsfa');
  };

  handleNewUserContact = async (id) => {
    try {
      const getData = await AsyncStorage.getItem('@contactHistory');
      const contactHistory = getData != null ? JSON.parse(getData) : null;
      contactHistory.push({
        contacted_time: Date.now(),
        id: id,
      });

      this.setContactHistoryData(contactHistory);
    } catch (e) {
      // save error
    }
  };

  uploadContactedPersonHistory = () => {
    database()
      .ref('/users/' + this.state.uid)
      .update({
        contacted_details_uploaded_date: Date.now(),
      })
      .then(function (val) {
        console.log('uploaded contact history time!');
      })
      .catch((err) => {
        console.log(err);
      });

    database()
      .ref('/users/' + this.state.uid)
      .update({
        contactedUsers: this.state.contactHistory.data,
      })
      .then(function (val) {
        console.log('uploaded contact history!');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  reportAsInfected = () => {
    database()
      .ref('/users/' + this.state.uid)
      .update({
        infected: true,
      })
      .then(function (val) {
        console.log('report as infected');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setObjectValue = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@contactHistory', jsonValue);
    } catch (e) {
      // save error
    }

    console.log('Done.');
  };

  setContactHistoryData = (data) => {
    var contactHistoryData = {
      data: {},
      today: 0,
      yesterday: 0,
      last3days: 0,
      last7days: 0,
      last14days: 0,
    };
    var contactHistoryArray = [];

    var index = 0;
    data.forEach((element) => {
      var dateDiff =
        (Date.now() - element.contacted_time) / (1000 * 60 * 60 * 24);
      if (dateDiff < 14 && dateDiff > 0) {
        // console.log(dateDiff);
        contactHistoryArray.push({...element, key: `${index}`});
        contactHistoryData['data'][`${index++}`] = element;
        contactHistoryData['last14days'] += 1;
        if (dateDiff < 7) {
          contactHistoryData['last7days'] += 1;
          if (dateDiff < 3) {
            contactHistoryData['last3days'] += 1;
            if (dateDiff < 2 && dateDiff > 1) {
              contactHistoryData['yesterday'] += 1;
            } else if (dateDiff < 1) {
              contactHistoryData['today'] += 1;
            }
          }
        }
      } else {
        console.log('outDate', dateDiff);
      }
    });
    this.setObjectValue(contactHistoryArray);
    this.setState({
      contactHistory: contactHistoryData,
      contactHistoryArray: contactHistoryArray,
    });
  };

  getContactHistoryFromLocal = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@contactHistory');
      const contactHistory = jsonValue != null ? JSON.parse(jsonValue) : null;

      this.setContactHistoryData(contactHistory);
    } catch (e) {
      console.log(e);
    }
  };

  getNotifications = () => {
    var userNotify = database()
      .ref(`/users/${this.state.uid}/notifications`)
      .on('value', async (snapshot) => {
        var list = [];
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val()) {
            list.push({...childSnapshot.val(), key: childSnapshot.key});
          }
        });
        this.setState({notifications: list});
      });
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
          id: '',
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
        id: data.id,
      });

      this.getNotifications();
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
          uploadContactedPersonHistory: this.uploadContactedPersonHistory,
          setTracking: this.setTracking,
          reportAsInfected: this.reportAsInfected,
        }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export {ContextProvider, Context};
