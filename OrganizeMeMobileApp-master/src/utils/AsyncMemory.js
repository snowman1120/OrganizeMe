
import AsyncStorage from '@react-native-community/async-storage';

export default class AsyncMemory  {

  static async storeItem(key, item) {
    try {    
        var storedItem = await AsyncStorage.setItem(key, JSON.stringify(item));
        return storedItem;
    } catch (error) {
      console.log(error.message);
    }
  }
  static async retrieveItem(key) {
    try {
      const retrievedItem =  await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return
  } 
}
