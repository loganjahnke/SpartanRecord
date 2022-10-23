import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export class ArrowheadTheme
{
	private static readonly __coolors = ["002029","00303d","004052","74a58b","F9F0FA"];

	/** #002029 */
	public static label = `#34F6F2`;
	/** #002029 */
	public static background = `#072028`;
	/** #00303d */
	public static box = `#00303C`;
	/** #004052 */
	public static secondary = `#014052`;
	/** #70A288 */
	public static text_secondary = `#${this.__coolors[3]}`;
	/** #F9F0FA */
	public static text_primary = `#${this.__coolors[4]}`;
	/** #70A288 */
	public static thin_border = `#${this.__coolors[3]}40`;
	public static card = `#142b33`;

	public static selected = "#2BC3EB";

	public static good = `#1B9D46`;
	public static bad = `#CC2500`;
	public static neutral1 = `#70A288`;
	public static neutral2 = `#5FDD9D`;
	public static cobra = "#CC2500";
	public static eagle = "#007FFF";
	public static leftEarlyText = "#95A3B3";

	//#region Halo Colors
	public static halo_salmon = "#FE3939";
	public static halo_vermilion = "#D84141";
	public static halo_cotton_candy = "#F89AE7";
	public static halo_cerise = "#C43AAC";
	public static halo_lavender = "#8F67AA";
	public static halo_aubergine = "#8D3AC4";
	public static halo_sky = "#49B8FE";
	public static halo_cerulean = "#3B9DFF";
	public static halo_jade = "#8AFFBE";
	public static halo_mint = "#23ED7D";
	public static halo_grass = "#A2DA62";
	public static halo_lime = "#8FED23";
	public static halo_sunshine = "#FCF55C";
	public static halo_pineapple = "#FFEA00";
	public static halo_carrot = "#DC5839";
	public static halo_tangelo = "#DA3A04";

	public static halo_colors = [
		this.halo_salmon,
		this.halo_cerulean,
		this.halo_sunshine,
		this.halo_jade,
		this.halo_cerise,
		this.halo_tangelo,
		this.halo_carrot,
		this.halo_aubergine,
		this.halo_grass,
		this.halo_mint,
		this.halo_sky,
		this.halo_lime,
		this.halo_lavender,
		this.halo_pineapple,
		this.halo_vermilion,
		this.halo_cotton_candy,
	];
	//#endregion
	
	public static theme = responsiveFontSizes(createTheme({
		typography:
		{
			fontFamily: [
				'Industry',
				'Roboto',
				'"Helvetica Neue"',
				'Arial',
				'sans-serif',
			  ].join(','),
			h1:
			{
				color: this.text_primary,
				fontWeight: 600
			},
			h2:
			{
				color: this.text_primary,
				fontWeight: 600
			},
			h3:
			{
				color: this.text_primary,
				fontWeight: 600
			},
			h4:
			{
				color: this.text_primary,
				fontWeight: 400
			},
			h5:
			{
				color: this.text_primary,
				fontWeight: 400
			},
			h6:
			{
				color: this.text_primary,
				fontSize: "1.1rem",
				fontWeight: 200
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
				color: this.text_secondary,
				fontWeight: 200
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
		},
	}));
}