import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../../Assets/Theme/ArrowheadTheme";
import { HaloDotAPIPlaylist } from "../../../Database/Schemas/AutocodeMetadata";

import "../../../Assets/Styles/Views/Playlist.css";

interface PlaylistCardProps
{
	playlist: HaloDotAPIPlaylist;
	chosen?: boolean;
	overrideBackgroundColor?: string;
	onPlaylistClicked?: (id: string) => void;
}

export function PlaylistCard(props: PlaylistCardProps)
{
	const { playlist, chosen, overrideBackgroundColor, onPlaylistClicked } = props;

	const content = <>
		<CardMedia className="_cardMedia" component="img" image={playlist.image_urls.thumbnail} sx={{ maxHeight: chosen ? "428px" : "0px" }} />
		<CardContent sx={{ backgroundColor: overrideBackgroundColor ?? (chosen ? ArrowheadTheme.good : ArrowheadTheme.box) }}>
			<Typography variant="h6" sx={{ color: ArrowheadTheme.label }}>{playlist.name}</Typography>
			<Typography variant="subtitle1">{playlist.description}</Typography>
		</CardContent>
	</>;

	return (
		<Card sx={{ margin: 2 }}>
			{onPlaylistClicked && <CardActionArea onClick={() => onPlaylistClicked(playlist.id)}>{content}</CardActionArea>}
			{!onPlaylistClicked && content}
		</Card>
	);
}