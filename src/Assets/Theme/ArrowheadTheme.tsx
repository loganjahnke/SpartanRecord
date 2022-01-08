import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// const text_primary = "rgb(213, 216, 221)";
// const text_secondary = "rgb(130, 133, 140)";
// const background = "rgb(45, 48, 57)";
// const box = "rgb(53, 58, 68)";
// const secondary = "rgb(61, 66, 76)";

export class ArrowheadTheme
{
	private static readonly __coolors = ["002029","00303d","004052","70A288","F9F0FA"];

	/** #002029 */
	public static background = `#${this.__coolors[0]}`;
	/** #00303d */
	public static box = `#${this.__coolors[1]}`;
	/** #004052 */
	public static secondary = `#${this.__coolors[2]}`;
	/** #70A288 */
	public static text_secondary = `#${this.__coolors[3]}`;
	/** #F9F0FA */
	public static text_primary = `#${this.__coolors[4]}`;
	
	public static theme = responsiveFontSizes(createTheme({
		typography:
		{
			h1:
			{
				color: this.text_primary
			},
			h2:
			{
				color: this.text_primary
			},
			h3:
			{
				color: this.text_primary
			},
			h4:
			{
				color: this.text_primary
			},
			h5:
			{
				color: this.text_primary
			},
			h6:
			{
				color: this.text_primary,
				fontSize: "1.1rem",
				fontWeight: 300
			},
			body1:
			{
				color: this.text_primary
			},
			body2:
			{
				color: this.text_secondary
			},
			caption:
			{
				color: this.text_secondary
			},
			subtitle1:
			{
				color: this.text_primary,
				fontSize: "0.75rem"
			}
		},
		palette:
		{
			mode: "dark",
			background:
			{
				paper: this.background
			},
			text:
			{
				primary: this.text_primary,
				secondary: this.text_secondary
			},
			primary: 
			{
				main: this.text_primary
			},
			secondary:
			{
				main: this.secondary
			},
			divider: this.box
		}
	}));
}