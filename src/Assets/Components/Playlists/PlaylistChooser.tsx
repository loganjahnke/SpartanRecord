import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { HaloDotAPIPlaylist } from "../../../Database/Schemas/AutocodeMetadata";

interface PlaylistChooserProps
{
	playlist: string;
	setPlaylist: (season: string) => void;
	playlists: HaloDotAPIPlaylist[];
	hideAll?: boolean;
	useId?: boolean;
}

export function PlaylistChooser(props: PlaylistChooserProps)
{
	const { playlist, setPlaylist, hideAll, playlists, useId } = props;

	/**
	 * When the select is changed
	 * @param event event
	 */
	function handlePlaylistChange(event: SelectChangeEvent<HTMLElement>)
	{
		let element = event.target.value as string;
		if (element === "All") { element = ""; }
		setPlaylist(element as any as string);
	}

	return (
		<FormControl size="small">
			<InputLabel>Playlist</InputLabel>
			<Select value={(playlist as any === "" ? "All" : playlist as any) as HTMLElement} label="Playlist" onChange={handlePlaylistChange}>
				{!hideAll && <MenuItem value={"All"}>All</MenuItem>}
				{playlists.map(playlist => <MenuItem value={useId ? playlist.id : playlist.name}>{playlist.name}</MenuItem>)}
			</Select>
		</FormControl>
	);
}