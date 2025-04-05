export type RootStackParamList = {
    LoginScreen: undefined; 
    HomeScreen: undefined;
    RegisterScr: undefined;
    GoalDetailsView: { item: Goal };
    InfoView: { infoState: string };
    verifyOTP: { email: string };
};