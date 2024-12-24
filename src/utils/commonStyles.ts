import { StyleSheet } from "react-native";
import ScaleUtils from "./ScaleUtils";

const commonStyles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },
    flex4: {
        flex: 4,
    },
    flex5: {
        flex: 5,
    },
    flex6: {
        flex: 6,
    },
    flexRow: {
        flex: 1,
        flexDirection: "row",
    },
    row: {
        flexDirection: "row",
    },
    jusBetween: {
        justifyContent: "space-between",
    },
    jusAround: {
        justifyContent: "space-around",
    },
    jusCenter: {
        justifyContent: "center",
    },
    fCenter: {
        flex: 1,
        alignItems: "center",
    },
    fEnd: {
        flex: 1,
        alignItems: "flex-end",
    },
    fStart: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
    alignCenter: {
        alignItems: "center",
    },
    jusEnd: {
        flex: 1,
        justifyContent: "flex-end",
    },
    iconBase: {
        height: ScaleUtils.floorScale(11),
        width: ScaleUtils.floorScale(11),
        paddingHorizontal: 10,
    },
    iconMedium: {
        height: ScaleUtils.floorScale(24),
        width: ScaleUtils.floorScale(24),
        paddingHorizontal: 10,
    },
    iconVehicle: {
        height: ScaleUtils.floorScale(38),
        width: ScaleUtils.floorScale(38),
    },
    textSmall: {
        fontSize: ScaleUtils.floorScale(12),
    },
    mt10: {
        marginTop: ScaleUtils.floorScale(10),
    },
    pl10: {
        paddingLeft: ScaleUtils.floorScale(10),
    },
    pr10: {
        paddingRight: ScaleUtils.floorScale(10),
    },
    pb10: {
        paddingBottom: ScaleUtils.floorScale(10),
    },
    pb20: {
        paddingBottom: ScaleUtils.floorScale(20),
    },
    m10: {
        margin: ScaleUtils.floorScale(10),
    },
    ph10: {
        paddingHorizontal: ScaleUtils.floorScale(10),
    },
    pv10: {
        paddingVertical: ScaleUtils.floorScale(10),
    },
    p10: {
        padding: ScaleUtils.floorScale(10),
    },
    mb10: {
        marginBottom: ScaleUtils.floorScale(10),
    },
    mh10: {
        marginHorizontal: ScaleUtils.floorScale(10),
    },
    mv10: {
        marginVertical: ScaleUtils.floorScale(10),
    },
    loadingBackground: {
        backgroundColor: "rgba(0,0,0,0.5)",
        bottom: 0,
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
    },
    textMedium: {
        fontSize: ScaleUtils.floorScale(14),
    },
    textWhite: {
        color: "white",
    },
    textBold: {
        fontWeight: "bold",
    },
    textLarge: {
        fontSize: ScaleUtils.floorScale(18),
    },
    transparentColor: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    bgWhite: {
        backgroundColor: "white",
    },
    bgHome: {
        backgroundColor: "#555",
    },
    bgHomeDark: {
        backgroundColor: "red",
    },
    bgGreen: {
        backgroundColor: "green",
    },
    bgBlue: {
        backgroundColor: "blue",
    },
    flexEnd: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: "100%",
    },
 iconContainer: {
    width: ScaleUtils.floorScale(25),
     backgroundColor: '#e1e1e3',
    borderRadius: ScaleUtils.scale(5),
    height: ScaleUtils.floorVerticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ScaleUtils.floorScale(12),
},
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: ScaleUtils.scaleFontSize(4),
        borderRadius: ScaleUtils.floorScale(8),
        borderWidth: 1,
        borderColor: '#f0f0f0',
        paddingHorizontal: ScaleUtils.floorScale(8),
        shadowColor: '#133b1e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
},
    // inputPopup: {
    //     fontSize: ScaleUtils.floorScale(14),
    //     borderColor: globalSetting.gray,
    //     borderWidth: 1,
    //     borderRadius: 10,
    //     minWidth: 80,
    //     textAlign: "center",
    //     padding: 10,
    //     height: ScaleUtils.floorScale(40),
    // },
    // dropdown: {
    //     borderColor: globalSetting.gray,
    //     borderWidth: 1,
    //     borderRadius: 10,
    //     minHeight: ScaleUtils.floorScale(40),
    // },
    // dropdownContainer: {
    //     borderColor: globalSetting.gray,
    //     borderWidth: 1,
    //     borderRadius: 10,
    //     minHeight: ScaleUtils.floorScale(40),
    //     fontSize: ScaleUtils.floorScale(12),
    // },
    // dropdownPlaceholder: {
    //     fontSize: ScaleUtils.floorScale(14),
    //     color: globalSetting.gray,
    // },
    // textError: {
    //     fontSize: ScaleUtils.floorScale(14),
    //     color: globalSetting.red,
    // },
    // calendar: {
    //     width: ScaleUtils.floorScale(300),
    // },
    // loginButton: {
    //     height: ScaleUtils.floorScale(40),
    //     borderWidth: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     flexDirection: "row",
    //     backgroundColor: globalSetting.mainColor,
    //     borderColor: "white",
    //     borderRadius: 5,
    // },
    // disabledButton: {
    //     backgroundColor: globalSetting.main_gray_background,
    // },
    // loginButtonText: {
    //     color: globalSetting.white,
    //     fontSize: ScaleUtils.floorScale(16),
    // },
    // inputDay: {
    //     fontSize: ScaleUtils.floorScale(14),
    //     borderColor: globalSetting.gray,
    //     borderWidth: 1,
    //     borderRadius: 10,
    //     minWidth: 120,
    //     textAlign: "center",
    //     padding: 5,
    //     height: ScaleUtils.floorScale(40),
    //     backgroundColor: globalSetting.white,
    //     color: globalSetting.black,
    // },
    // button: {
    //     flexDirection: "row",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     backgroundColor: globalSetting.mainColor,
    //     borderRadius: 8,
    //     paddingVertical: 10,
    //     paddingHorizontal: 15,
    // },
    buttonText: {
        backgroundColor: '#666',
        padding: ScaleUtils.scale(16),
        margin: ScaleUtils.scale(16),
        borderRadius: ScaleUtils.scale(20),
        alignItems: 'center',
    },
    buttonClose: {
        width: ScaleUtils.scale(22),
        height: ScaleUtils.scale(23),
        backgroundColor: 'red',
        padding: ScaleUtils.scale(5),
        borderRadius: ScaleUtils.scale(20),
        alignItems: 'center',
    },
    // searchTextInputStyle: {
    //     height: 40,
    //     fontweight: "bold",
    //     borderColor: globalSetting.gray,
    //     color: globalSetting.black,
    // }

});

export default commonStyles;
