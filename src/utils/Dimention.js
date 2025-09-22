import { Dimensions } from 'react-native';

// Get dimensions for screen width and height
const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;
const FontSize = Dimensions.get('screen').height; // Usually, font size should be based on width or a mix of both

// Function to get height percentage
export const HP = percentage => {
    const percentHeight = parseFloat(percentage.toString());
    return (Height * percentHeight) / 100;
};

// Function to get width percentage
export const WP = percentage => {
    const percentWidth = parseFloat(percentage.toString());
    return (Width * percentWidth) / 100;
};

// Function to get font size percentage
export const FS = percentage => {
    const percentFontSize = parseFloat(percentage.toString());
    return (FontSize * percentFontSize) / 100;
};
