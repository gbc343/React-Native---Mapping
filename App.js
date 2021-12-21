import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export default function App(){

  const [value, setValue] = useState({msg:'empty'});
  const {getItem, setItem, mergeItem, removeItem} = useAsyncStorage('@myStorageKey');
  const {getOtherItem, setOtherItem} = useAsyncStorage('MyOtherKey');

  const [userName, onChangeName] = useState('noname');
  const [myarr, setArray] = useState([{title:'test'}]);

  const arr = [{title:'test2'}];

  const writeArray = async newValue => {
    const sval = JSON.stringify(newValue);
    await setOtherItem(sval);
    setArray(newValue);
  };

  const readArray = async ()=>{
try{
    const item = await getOtherItem();
    const oitem = item!=null ? JSON.parse(item) : [];
    setArray(oitem);
  }catch(e){
    console.log(e);
  }

  };

  const addItem = (item)=>{
    myarr.push(item);
    writeArray(myarr);
  }

  const readItem = async ()=>{
    const item = await getItem();
    const oitem = item!=null ? JSON.parse(item) : {msg:'empty'};
    setValue(oitem);
    onChangeName(oitem.msg);
  };

  const writeItem = async newValue => {
    const sval = JSON.stringify(newValue);
    await setItem(sval);
    setValue(newValue);
  };

  const deleteItem = async ()=>{
    await removeItem();
    setValue({msg:'empty'});
  };


  useEffect(
    ()=>{
      readItem();
      readArray();
      }, []
    );
  const genMessage = ()=>{
    const m = Math.random()
    .toString(36)
    .substr(2,5);
    return {msg:m};
  }

  return(
      <View>
        <Text>Welcome {value.msg}!</Text>
        <TextInput
          onChangeText = {text=>onChangeName(text)}
          value = {userName}
        />
        <Button
          //title="Generate new value"
          title="Set name"
          onPress={()=>{
            //writeItem(  genMessage());
            writeItem({msg:userName});
            }
          }
        />
        <Button
          title="Delete name"
          onPress={()=>{
            deleteItem();
            onChangeName('noname');
            }}
        />
        <FlatList
          data={myarr}
          renderItem={({item})=>(
            <Text>{item.title}</Text>
            )}

        />
        <Button
          title = "Add item"
          onPress={()=>{
            const m = Math.random()
            .toString(36)
            .substr(2,5);
            addItem({title:m});
            }}
          />
      </View>

    );

};