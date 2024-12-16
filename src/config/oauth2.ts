const config = {
    issuer: 'https://accounts.google.com',
    clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
    redirectUrl: 'com.yourapp:/oauth2redirect/google',
    scopes: ['openid', 'profile', 'email'],
    additionalParameters: {},
    serviceConfiguration: {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
    },
};
