import React, {Component } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';

//import Moment from 'moment';

import { Alert, Platform } from 'react-native';
import { NativeEventEmitter, NativeModules } from 'react-native';
import BLEAdvertiser from 'react-native-ble-advertiser'
import update from 'immutability-helper';
import DeviceInfo from 'react-native-device-info';
import {
  getManufacturer,
  getManufacturerSync,
  syncUniqueId,
  useBatteryLevel,
  useBatteryLevelIsLow,
  usePowerState,
  useFirstInstallTime,
  useDeviceName,
  useHasSystemFeature,
  useIsEmulator,
} from 'react-native-device-info';

import {
  Header,
  Colors
} from 'react-native/Libraries/NewAppScreen';

import UUIDGenerator from 'react-native-uuid-generator';
import { PermissionsAndroid } from 'react-native';

export async function requestLocationPermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'BLE Avertiser Example App',
          'message': 'Example App access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
      } else {
        console.log("location permission denied")
      }
    }

    const blueoothActive = await BLEAdvertiser.getAdapterState().then(result => {
      console.log('[Bluetooth]', "isBTActive", result)
      return result === "STATE_ON";
    }).catch(error => { 
      console.log('[Bluetooth]', "BT Not Enabled")
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
      )
    }

    console.log("BT Active?", blueoothActive);
  } catch (err) {
    console.warn(err)
  }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uuid:'',
            uniqueid: '',
            devicesFound:[]
        }
    }

    addDevice(_uuid, _name, _mac, _rssi, _date) {
      let index = -1;
      for(let i=0; i< this.state.devicesFound.length; i++){
        if (this.state.devicesFound[i].uuid == _uuid) {
          index = i;
        }
      }
      if (index<0) {
        let dev = {uuid:_uuid, name:_name, mac: _mac, rssi:_rssi, start:_date, end:_date};
        this.setState({
          devicesFound: update(this.state.devicesFound, 
            {$push: [dev]}
          )
        });
      } else {
        //let dev = this.state.devicesFound[index];
        //const newList = this.state.devicesFound.splice(index, 1);
        const itemIndex = index;
        this.setState({
          devicesFound: update(this.state.devicesFound, 
            {[itemIndex]: {end: {$set: _date}, rssi: {$set: _rssi || this.state.devicesFound[itemIndex].rssi }}}
          )
        });
      }
    }

    componentDidMount(){
      requestLocationPermission();
      let a = DeviceInfo.getUniqueId();
      let b = a.slice(0, 4);
      let c  = a.slice(4, 16);
      let d = "ab000000-cd00-ef00-"+b+"-"+c;
      this.setState({
        uniqueid: d
      });
      console.log("BLE Advertiser", BLEAdvertiser);
      // Uses the Apple code to pick up iPhones
      BLEAdvertiser.setCompanyId(0x4C); 
    
      const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);

      UUIDGenerator.getRandomUUID((newUid) => {
        this.setState({
          uuid: newUid.slice(0, -2) + '00'
        });
      });

      eventEmitter.addListener('onDeviceFound', (event) => {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        console.log('onDeviceFound', event);
        if (event.serviceUuids) {
          for(let i=0; i< event.serviceUuids.length; i++){
            // && event.serviceUuids[i].endsWith('00')
            if (event.serviceUuids[i])
              this.addDevice(event.serviceUuids[i], event.deviceName, event.deviceAddress, event.rssi, new Date())   
          }
        }
      });
    }

    start() {
      console.log(this.state.uniqueid, "Starting Advertising");
      // Manuf Data [1,0] picks up iPhones
      //this.state.uuid

      BLEAdvertiser.broadcast(this.state.uniqueid, [1,0], {
        advertiseMode: BLEAdvertiser.ADVERTISE_MODE_BALANCED, 
        txPowerLevel: BLEAdvertiser.ADVERTISE_TX_POWER_MEDIUM, 
        connectable: false, 
        includeDeviceName: false, includeTxPowerLevel: false })
        .then(sucess => console.log(this.state.uniqueid, "Adv Successful", sucess))
        .catch(error => console.log(this.state.uniqueid, "Adv Error", error));
      
      console.log(this.state.uniqueid, "Starting Scanner");
      // Manuf Data [1,0] picks up iPhones
      BLEAdvertiser.scan([1,0], {scanMode: BLEAdvertiser.SCAN_MODE_LOW_LATENCY})
        .then(sucess => console.log(this.state.uniqueid, "Scan Successful", sucess))
        .catch(error => console.log(this.state.uniqueid, "Scan Error", error));

      this.setState({
        isLogging: true,
      });
    }

    stop(){
      console.log(this.state.uniqueid, "Stopping Broadcast");
      BLEAdvertiser.stopBroadcast()
        .then(sucess => console.log(this.state.uniqueid, "Stop Broadcast Successful", sucess))
        .catch(error => console.log(this.state.uniqueid, "Stop Broadcast Error", error));

      console.log(this.state.uniqueid, "Stopping Scanning");
      BLEAdvertiser.stopScan()
        .then(sucess => console.log(this.state.uniqueid, "Stop Scan Successful", sucess) )
        .catch(error => console.log(this.state.uniqueid, "Stop Scan Error", error) );

      this.setState({
        isLogging: false,
      });
    }

    onClearArray = () => {
      this.setState({ devicesFound: [] });
    };

    short(str) {
      return (str.substring(0, 4) + " ... " + str.substring(str.length-4, str.length)).toUpperCase(); 
    }

    render() {
      return (
        <SafeAreaView>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>BLE Advertiser Demo</Text>
              <Text style={styles.sectionDescription}>Broadcasting: <Text style={styles.highlight}>{ this.short(this.state.uniqueid) }</Text></Text>
            </View>

            <View style={styles.sectionContainer}>
              {this.state.isLogging ? (
              <TouchableOpacity
                onPress={() => this.stop()}
                style={styles.stopLoggingButtonTouchable}>
                <Text style={styles.stopLoggingButtonText}>
                  Stop
                </Text>
              </TouchableOpacity>
                ) : (
              <TouchableOpacity
                onPress={() => this.start()}
                style={styles.startLoggingButtonTouchable}>
                <Text style={styles.startLoggingButtonText}>
                  Start
                </Text>
              </TouchableOpacity>
              )}
            </View>

            <View style={styles.sectionContainerFlex}>
              <Text style={styles.sectionTitle}>Devices Around</Text>
              <FlatList
                  data={ this.state.devicesFound }
                  renderItem={({item}) => <Text style={styles.itemPastConnections}>{this.short(item.uuid)} {item.mac} {item.rssi}</Text>}
                  keyExtractor={item => item.uuid}
                  />
            </View>

            <View style={styles.sectionContainer}>
              <TouchableOpacity
                onPress={this.onClearArray}
                style={styles.startLoggingButtonTouchable}>
                <Text style={styles.startLoggingButtonText}>
                  Clear Devices
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </SafeAreaView>
      );
    }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    height: "100%",
  },
  sectionContainerFlex: {
    flex: 1,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  sectionContainer: {
    flex: 0,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center'
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  startLoggingButtonTouchable: {
    borderRadius: 12,
    backgroundColor: '#665eff',
    height: 52,
    alignSelf: 'center',
    width: 300,
    justifyContent: 'center',
  },
  startLoggingButtonText: {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  stopLoggingButtonTouchable: {
    borderRadius: 12,
    backgroundColor: '#fd4a4a',
    height: 52,
    alignSelf: 'center',
    width: 300,
    justifyContent: 'center',
  },
  stopLoggingButtonText: {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  listPastConnections: {
      width: "80%",
      height: 200
  },
  itemPastConnections: {
      padding: 3,
      fontSize: 18,
      fontWeight: '400',
  },
});

export default App;
