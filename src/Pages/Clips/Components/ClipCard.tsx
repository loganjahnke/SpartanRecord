import { Button, Card, CardActions, CardMedia, Grid } from "@mui/material";
import { HaloDotAPIClip } from "../../../Database/Schemas/HaloDotAPIClip";
import { PlayArrow, Twitter } from "@mui/icons-material";

interface ClipCardProps
{
	clip: HaloDotAPIClip;
	gamertag: string;
}

export function ClipCard(props: ClipCardProps)
{
	const { clip, gamertag } = props;

	/** Share the match link on Twitter */
	const shareWithTwitter = () =>
	{
		// Opens a pop-up with twitter sharing dialog
		var shareURL = "http://twitter.com/share?"; //url base

		//params
		var params = {
			url: `${clip.media_urls.download}\n\n`,
			text: `${gamertag} - Halo Infinite Clip on SpartanRecord.com\n\n`,
			hashtags: "Halo,SpartanRecord,HaloDotAPI"
		}

		for (const param in params) { shareURL += "&" + param + "=" + encodeURIComponent((params as any)[param]); }
		window.open(shareURL, "_blank", "left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");
	};

	return (
		<Grid item xs={12} md={6} lg={4} xl={3}>
			<Card>
				<CardMedia component="img" image={clip.media_urls.thumbnail} />
				<CardActions>
					<Button size="small" startIcon={<PlayArrow />} onClick={() => window.open(clip.media_urls.download)}>Play</Button>
					<Button size="small" startIcon={<Twitter />} onClick={shareWithTwitter}>Tweet</Button>
				</CardActions>
			</Card>
		</Grid>
	);
}