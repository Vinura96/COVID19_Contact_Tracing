import React, {Component} from 'react';
import {AppState} from 'react-native';

const Context = React.createContext();

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';

import {Alert, Platform} from 'react-native';
import {NativeEventEmitter, NativeModules} from 'react-native';
import BLEAdvertiser from 'react-native-ble-advertiser';
import update from 'immutability-helper';
import DeviceInfo from 'react-native-device-info';

import {PermissionsAndroid} from 'react-native';

async function requestLocationPermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'BLE Avertiser Example App',
          message: 'Example App access to your location ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('location permission denied');
      }
    }

    const blueoothActive = await BLEAdvertiser.getAdapterState()
      .then((result) => {
        console.log('[Bluetooth]', 'isBTActive', result);
        return result === 'STATE_ON';
      })
      .catch((error) => {
        console.log('[Bluetooth]', 'BT Not Enabled');
        return false;
      });

    if (!blueoothActive) {
      await Alert.alert(
        'Private Kit requires bluetooth to be enabled',
        'Would you like to enable Bluetooth?',
        [
          {
            text: 'Yes',
            onPress: () => BLEAdvertiser.enableAdapter(),
          },
          {
            text: 'No',
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
        ],
      );
    }

    console.log('BT Active?', blueoothActive);
  } catch (err) {
    console.warn(err);
  }
}

class ContextProvider extends Component {
  state = {
    isLoggedIn: false,
    isLoadingApp: false,
    user: null,
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
    uniqueid: '',
    devicesFound: [],
    formatedBlutoothID: '',
    appState: AppState.currentState,
  };
  componentDidMount() {
    this.authenticateUser();
    requestLocationPermission();
    this.handleDeviceScanner();
    this.getContactHistoryFromLocal();
    this.checkTrackingState();
    this.getdeviceListFromLocal();
    console.log('Appstate listener added');
    // nowdate = new Date();
    // console.log(nowdate.getHours());
    // console.log(JSON.stringify(nowdate));
    AppState.addEventListener('change', this._handleAppStateChange);
    // perform check when the component mounts
    this.checkDate();
    // console.log('object');
    // var dateDiff = new Date(new Date(Date.now()).toLocaleDateString());
    // console.log(
    //   (dateDiff - new Date(new Date('2020-07-18').toLocaleDateString())) /
    //     (1000 * 60 * 60 * 24),
    // );
    // console.log('object');
  }

  componentWillUnmount() {
    this.setDevicelistLocal();
    // remove the listener
    console.log('Appstate listener removed');
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    console.log('Appstate changed');
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // app has come to the foreground
      // perform checks etc here
      await this.checkDate();
    }
    // update the appState
    this.setState({appState: nextAppState});
    console.log('New Appstate is');
    console.log(nextAppState);
  };

  checkDate = async () => {
    // create a string with the current date
    let todaydate = new Date();
    console.log(todaydate);
    let currYear = JSON.stringify(todaydate.getFullYear());
    let currMonth = JSON.stringify(todaydate.getMonth());
    let currDate = JSON.stringify(todaydate.getDate());
    // get the value from storage
    let savedYear = await AsyncStorage.getItem('storedYear');
    let savedMonth = await AsyncStorage.getItem('storedMonth');
    let savedDate = await AsyncStorage.getItem('storedDate');
    if (savedDate) {
      var a = currYear.localeCompare(savedYear);
      var b = currMonth.localeCompare(savedMonth);
      var c = currDate.localeCompare(savedDate);
      if (a != 0 || b != 0 || c != 0) {
        // this is where you put the code that resets everything
        // clear the values that you have previously saved
        console.log('Clearing Daily the state of devices found');
        this.setState({devicesFound: []});
        // remember to save the new date
        try {
          console.log('Saving the new date');
          await AsyncStorage.setItem('storedDate', currDate);
          await AsyncStorage.setItem('storedYear', currYear);
          await AsyncStorage.setItem('storedMonth', currMonth);
        } catch (err) {}
      } else {
        console.log('Date is not changed');
        console.log(currDate);
        console.log('Date is not changedd');
      }
    } else {
      // save the time as this is the first time the app has launched
      // do any other initial setup here
      try {
        console.log(
          'initially storing the dateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        );
        await AsyncStorage.setItem('storedDate', currDate);
        await AsyncStorage.setItem('storedYear', currYear);
        await AsyncStorage.setItem('storedMonth', currMonth);
      } catch (err) {}
    }
  };

  checkTrackingState = async () => {
    try {
      const getData = await AsyncStorage.getItem('@isTrackingEnabled');
      const tracking = getData != null ? JSON.parse(getData) : false;
      this.setTracking(tracking);
    } catch (e) {
      console.log(e);
    }
  };

  handleDeviceScanner = () => {
    let a = DeviceInfo.getUniqueId();
    let b = a.slice(0, 4);
    let c = a.slice(4, 16);
    let d = '00000000-0000-0000-' + b + '-' + c;
    this.setState({
      uniqueid: d,
      formatedBlutoothID: this.short(d),
    });
    console.log('BLE Advertiser', BLEAdvertiser);
    // Uses the Apple code to pick up iPhones
    BLEAdvertiser.setCompanyId(0x4c);

    const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);

    eventEmitter.addListener('onDeviceFound', (event) => {
      // console.log('onDeviceFound', event);

      if (event.serviceUuids) {
        for (let i = 0; i < event.serviceUuids.length; i++) {
          // console.log(this.short(event.serviceUuids[i]));
          if (event.serviceUuids[i] && event.rssi > -80) {
            console.log(
              'New Device found: ',
              event.serviceUuids[i],
              '  RSSI : ',
              event.rssi,
            );

            this.addDevice(
              event.serviceUuids[i],
              event.deviceName,
              event.deviceAddress,
              event.rssi,
              new Date(),
            );
          }
        }
      }
    });
  };

  start() {
    console.log(this.state.uniqueid, 'Starting Advertising');
    // Manuf Data [1,0] picks up iPhones
    //this.state.uuid

    BLEAdvertiser.broadcast(this.state.uniqueid, [1, 0], {
      advertiseMode: BLEAdvertiser.ADVERTISE_MODE_BALANCED,
      txPowerLevel: BLEAdvertiser.ADVERTISE_TX_POWER_MEDIUM,
      connectable: false,
      includeDeviceName: false,
      includeTxPowerLevel: false,
    })
      .then((sucess) =>
        console.log(this.state.uniqueid, 'Adv Successful', sucess),
      )
      .catch((error) => console.log(this.state.uniqueid, 'Adv Error', error));

    console.log(this.state.uniqueid, 'Starting Scanner');
    // Manuf Data [1,0] picks up iPhones
    BLEAdvertiser.scan([1, 0], {scanMode: BLEAdvertiser.SCAN_MODE_LOW_LATENCY})
      .then((sucess) =>
        console.log(this.state.uniqueid, 'Scan Successful', sucess),
      )
      .catch((error) => console.log(this.state.uniqueid, 'Scan Error', error));

    this.setState({
      isLogging: true,
    });
  }

  stop() {
    console.log(this.state.uniqueid, 'Stopping Broadcast');
    BLEAdvertiser.stopBroadcast()
      .then((sucess) =>
        console.log(this.state.uniqueid, 'Stop Broadcast Successful', sucess),
      )
      .catch((error) =>
        console.log(this.state.uniqueid, 'Stop Broadcast Error', error),
      );

    console.log(this.state.uniqueid, 'Stopping Scanning');
    BLEAdvertiser.stopScan()
      .then((sucess) =>
        console.log(this.state.uniqueid, 'Stop Scan Successful', sucess),
      )
      .catch((error) =>
        console.log(this.state.uniqueid, 'Stop Scan Error', error),
      );

    this.setState({
      isLogging: false,
    });
  }

  onClearArray = () => {
    this.setState({devicesFound: []});
  };

  short(str) {
    return str.substring(19, str.length).toUpperCase();
  }

  addDevice(_uniqueid, _name, _mac, _rssi, _date) {
    this.checkDate();
    let index = -1;
    for (let i = 0; i < this.state.devicesFound.length; i++) {
      if (this.state.devicesFound[i].uniqueid == _uniqueid) {
        index = i;
      }
    }

    if (index < 0) {
      let dev = {
        uniqueid: _uniqueid,
        name: _name,
        mac: _mac,
        rssi: _rssi,
        start: _date,
        end: _date,
      };

      // Add new user to localstorage
      this.handleNewUserContact(this.short(_uniqueid));

      //

      this.setState({
        devicesFound: update(this.state.devicesFound, {
          $push: [dev],
        }),
      });
    } else {
      //let dev = this.state.devicesFound[index];
      //const newList = this.state.devicesFound.splice(index, 1);
      const itemIndex = index;
      this.setState({
        devicesFound: update(this.state.devicesFound, {
          [itemIndex]: {
            end: {$set: _date},
            rssi: {$set: _rssi || this.state.devicesFound[itemIndex].rssi},
          },
        }),
      });
    }
  }

  setAppLoading = (value) => {
    this.setState({isLoadingApp: value});
  };

  setTracking = async (val) => {
    if (val) {
      this.start();
    } else {
      this.stop();
    }
    this.setState({isTrackingEnable: val});
    try {
      const jsonValue = JSON.stringify(val);
      await AsyncStorage.setItem('@isTrackingEnabled', jsonValue);
    } catch (e) {
      console.log(e);
    }
    console.log('Tracking changed!');
  };

  handleNewUserContact = async (id) => {
    try {
      const getData = await AsyncStorage.getItem('@contactHistory');
      const contactHistory = getData != null ? JSON.parse(getData) : [];
      contactHistory.push({
        contacted_time: Date.now(),
        id: id,
      });
      console.log('New user saved on local storage: ', id);

      this.setContactHistoryData(contactHistory);
    } catch (e) {
      console.log(e);
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

    console.log('contactHistory saved to local.');
  };

  setDevicelistLocal = async () => {
    try {
      const jsonValue = JSON.stringify(this.state.devicesFound);
      await AsyncStorage.setItem('@deviceList', jsonValue);
    } catch (e) {
      console.log(e);
    }

    console.log('deviceList saved to local.');
  };

  getdeviceListFromLocal = async () => {
    try {
      const getData = await AsyncStorage.getItem('@deviceList');
      const deviceList = getData != null ? JSON.parse(getData) : [];
      this.setState({devicesFound: deviceList});
    } catch (e) {
      console.log(e);
    }
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
        (new Date(new Date(Date.now()).toLocaleDateString()) -
          new Date(new Date(element.contacted_time).toLocaleDateString())) /
        (1000 * 60 * 60 * 24);
      if (dateDiff < 14 && dateDiff > -1) {
        console.log(dateDiff);
        contactHistoryArray.push({...element, key: `${index}`});
        contactHistoryData['data'][`${index++}`] = element;
        contactHistoryData['last14days'] += 1;
        if (dateDiff < 7) {
          contactHistoryData['last7days'] += 1;
          if (dateDiff < 3) {
            contactHistoryData['last3days'] += 1;
            if (dateDiff == 1) {
              contactHistoryData['yesterday'] += 1;
            } else if (dateDiff == 0) {
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
      const contactHistory = jsonValue != null ? JSON.parse(jsonValue) : [];

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

export {ContextProvider, Context, requestLocationPermission};
