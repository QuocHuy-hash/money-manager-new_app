

const imageUtils = (imageName: string) => {
    switch (imageName) {
        case "vpbank_logo":
            return require("../assets/icon/vpbank_logo.png");
        case "vpbank_logo_tron":
            return require("../assets/icon/vpbank_logo_tron.png");
        case "transaction_history_color":
            return require("../assets/icon/transaction_history_color.png");
        case "history_transaction":
            return require("../assets/icon/history_transaction.png");
        case "prev_header":
            return require("../assets/images/prev_white_icon.png");
        case "otp_logo":
            return require("../assets/images/otp_logo.png");
        // case "playstation":
        //     return require("../assets/images/playstation.png");

        default:
            return null;
    }
};
export default imageUtils;
