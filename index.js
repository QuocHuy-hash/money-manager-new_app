
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import "react-native-gesture-handler";
import Root from "./src/myApp";

function HeadlessCheck(isHeadless ) {
    return <Root />;
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);
