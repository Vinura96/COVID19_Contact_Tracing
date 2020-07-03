import React, {Component} from 'react';

import {Alert, Platform} from 'react-native';
import {NativeEventEmitter, NativeModules} from 'react-native';
import BLEAdvertiser from 'react-native-ble-advertiser';
import update from 'immutability-helper';
import DeviceInfo from 'react-native-device-info';

import {PermissionsAndroid} from 'react-native';

export async function requestLocationPermission() {
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

class Broadcast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueid: '',
      devicesFound: [],
    };
  }

  addDevice(_uniqueid, _name, _mac, _rssi, _date) {
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
      this.setState({
        devicesFound: update(this.state.devicesFound, {$push: [dev]}),
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

  componentDidMount() {
    requestLocationPermission();
    let a = DeviceInfo.getUniqueId();
    let b = a.slice(0, 4);
    let c = a.slice(4, 16);
    let d = '00000000-0000-0000-' + b + '-' + c;
    this.setState({
      uniqueid: d,
    });
    console.log('BLE Advertiser', BLEAdvertiser);
    // Uses the Apple code to pick up iPhones
    BLEAdvertiser.setCompanyId(0x4c);

    const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);

    eventEmitter.addListener('onDeviceFound', (event) => {
      console.log('onDeviceFound', event);
      if (event.serviceUuids) {
        for (let i = 0; i < event.serviceUuids.length; i++) {
          if (event.serviceUuids[i] && event.rssi > -80) {
            console.log('Checking RSSI is greater than -80');
            console.log(event.rssi);
            console.log('Checking RSSI is greater than -80');
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
  }

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
    return (
      str.substring(0, 4) +
      ' ... ' +
      str.substring(str.length - 4, str.length)
    ).toUpperCase();
  }
}
