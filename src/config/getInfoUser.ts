import { KEY_TOKEN, KEY_USER } from "@/constants/key";
import AsyncStorage from "@react-native-async-storage/async-storage";



 export const  getClientInfoAndToken = async() => {
     const clientInfoString =await AsyncStorage.getItem(KEY_USER);
     const token = await AsyncStorage.getItem(KEY_TOKEN);
    if (!clientInfoString || !token) {
       console.log('Missing client information or token');
       return null;
    }

    try {
        const clientInfo = JSON.parse(clientInfoString);
        return { clientId: clientInfo.id, token };
    } catch (error) {
        console.error('Error parsing client information:', error);
        return null;
    }
};
