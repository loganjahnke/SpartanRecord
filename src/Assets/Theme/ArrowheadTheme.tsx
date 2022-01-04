import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const text_primary = "rgb(213, 216, 221)";
const text_secondary = "rgb(130, 133, 140)";
const background = "rgb(45, 48, 57)";
const box = "rgb(53, 58, 68)";
const secondary = "rgb(61, 66, 76)";

export const ArrowheadTheme = responsiveFontSizes(createTheme({
    typography:
    {
        h1:
        {
            color: text_primary
        },
        h2:
        {
            color: text_primary
        },
        h3:
        {
            color: text_primary
        },
        h4:
        {
            color: text_primary
        },
        h5:
        {
            color: text_primary
        },
        h6:
        {
            color: text_primary
        },
        body1:
        {
            color: text_primary
        },
        body2:
        {
            color: text_secondary
        },
        caption:
        {
            color: text_secondary
        }
    },
    palette:
    {
        mode: "dark",
        background:
        {
            paper: background
        },
        text:
        {
            primary: text_primary,
            secondary: text_secondary
        },
        primary: 
        {
            main: text_primary
        },
        secondary:
        {
            main: secondary
        },
        divider: box
    }
}));