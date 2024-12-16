import {
  scale as matterScale,
  verticalScale as matterVerticalScale,
  moderateScale as matterModerateScale,
} from "react-native-size-matters";
const baseFontSize = 16;

function scaleFontSize(fontSize : number) {
  const scaledSize = matterScale(fontSize / baseFontSize);
  return Math.round(scaledSize * baseFontSize);
}

class ScaleUtils {
  static scaleFontSize = (size: number) => scaleFontSize(size);

  static scale = (size: number) => matterScale(size);
  static verticalScale = (size: number) => matterVerticalScale(size);
  static moderateScale = (size: number, factor = 0.5) =>
    matterModerateScale(size, factor);

  static floorScale = (size: number) => Math.floor(matterScale(size));
  static floorVerticalScale = (size: number) => Math.floor(matterVerticalScale(size));
  static floorModerateScale = (size: number, factor = 0.5) =>
    Math.floor(matterModerateScale(size, factor));
}

export default ScaleUtils;
