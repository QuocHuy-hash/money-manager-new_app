"use strict";
import { Dimensions, Platform } from "react-native";


const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const info = { version: "1", hotline: "19006061" };
const size = {
    sWidth: screenWidth,
    sHeight: screenHeight,
};
export const Color = {
    mainColor: "#157DC0",
    main_text_blue: "#007AFE",
    main_text_red: "#A01C20",
    main_text_yellow: "#FABF12",
    main_text_gray: "#8A8D91",
    main_line_color: "#8A8D91",
    main_list_background: "#E5E5E5",
    main_gray_background: "#CECECE",
    main_detail_background: "rgba(0, 140, 255, 0.5)",
    title_category_color: "#FF971E",
    seemore_color: "#565656",
    main_text_color: "#FFFFFF",
    sub_text_color: "#6A6A6A",
    toggle_green_color: "#ccffcc",
    lineColor: "#CED0CE",
    error_color: "#FC1D1D",
    green_color: "#228b22",
    drawer_line_color: "#FF971E",
    blue_color: "#2087FC",
    red_color: "#ff0000",
    main_background_color: "#DCDEE3",
    main_red_color: "#CA2027",
    white: "#ffffffff",
    blue: "#007bff",
    red: "#dc3545",
    yellow: "#fcf4a3",
    green: "#28a745",
    orange: "#FF971E",
    gray: "#8B8E91",
    bg_blue: "#4A63F0",
    transparent: "white",
    light_background: "#caeefd",
    shadowBlock: {
        backgroundColor: "white",
        padding: 15,
        marginTop: 15,
        ...Platform.select({
            ios: {
                width: screenWidth - 15 * 2,
                shadowColor: "rgba(0,0,0,0.2)",
                shadowOpacity: 1,
                shadowOffset: { height: 2, width: 2 },
                shadowRadius: 2,
            },

            android: {
                elevation: 10,
                marginHorizontal: 15,
            },
        }),
    },
    navigationBarHeight: 50, // Add the navigationBarHeight property
};

module.exports = {
    ...size,
    ...Color,
    ...info,

    APPBAR_HEIGHT: Platform.OS === "ios" ? 44 : 56,
    STATUSBAR_HEIGHT: Platform.OS === "ios" ? 20 : 0,
    navbar_height: 47,
    drawer_marginTop: Platform.OS === "ios" ? 20 : 0,

    loadingViewOpacity: 0.2,
    init: function () {
        if (Platform.OS === "android") {
            this.navigationBarHeight = 50;
        }
        return this;
    },
}.init();
