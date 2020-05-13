import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function History({navigation}) {
  const [contactHistory, setContactHistory] = useState([0, 1, 2, 3]);
  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold', fontSize: 16, paddingVertical: 10}}>
        Last 14 days contact history.
      </Text>
      <View>
        <TouchableOpacity style={styles.uploadbtn}>
          <AntDesign name="cloudupload" size={20} color="white" />
          <Text
            style={{paddingHorizontal: 10, fontSize: 14, fontWeight: 'bold'}}>
            Upload
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{marginVertical: 20}}>
        <View
          style={{borderColor: 'black', borderWidth: 2, flexDirection: 'row'}}>
          <Text
            style={{
              width: '50%',
              paddingVertical: 5,
              textAlign: 'center',
              borderRightWidth: 1,
            }}>
            Date
          </Text>
          <Text
            style={{
              width: '50%',
              paddingVertical: 5,
              textAlign: 'center',
              borderLeftWidth: 1,
            }}>
            ID
          </Text>
        </View>
        <FlatList
          data={contactHistory}
          renderItem={({item}) => {
            return (
              <View style={styles.listContainer}>
                <Text style={styles.listItemfst}>2020/05/10 | 18:10:10</Text>
                <Text style={styles.listItemtwo}>{item}</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 10,
    marginBottom: 50,
  },
  listContainer: {
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    borderTopWidth: 0,
  },
  listItemtwo: {
    width: '50%',
    paddingVertical: 5,
    textAlign: 'center',
  },
  listItemfst: {
    width: '50%',
    paddingVertical: 5,
    textAlign: 'center',
    borderRightWidth: 1,
  },
  uploadbtn: {
    backgroundColor: 'gray',
    borderRadius: 10,
    flexDirection: 'row',
    width: 100,
    alignSelf: 'flex-end',
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    marginHorizontal: 20,
  },
});
