import { getClientInfoAndToken } from "./getInfoUser";


export const getHeader = async () => {
    const data = await getClientInfoAndToken();

    if (data) {
        return {
            'Content-Type': 'application/json',
            'x-client-id': data.clientId,
            'authorization': data.token.replace(/"/g, ''),
        };
    } else {
        console.log('Failed to get client info and token');
        return null;
    }
};
