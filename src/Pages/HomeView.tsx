import { Box, Divider, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GamertagSearch } from "./Subpage/GamertagSearch";
import { ViewProps } from "./Props/ViewProps";

interface HomeViewProps
{
	setGamertag: (gamertag: string) => void;
	switchTab: (url: string, tab?: string) => void;
}

export function HomeView(props: ViewProps & HomeViewProps)
{
	//#region Props and Navigate
	const { setGamertag, switchTab } = props;
	//#endregion
	
	//#region State
 	const [localGamertag, setLocalGamertag] = useState("");
	//#endregion

	/** Controlled search component */
	function onGamertagTextChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		setLocalGamertag(event.target.value);
	};

	/** When the search button is pressed */
	function searchForGamertag()
	{
		if (localGamertag === "") { return; }
		setGamertag(localGamertag);
		switchTab(`service_record/${localGamertag}`, "Service Record");
	}

	/** When the search button is pressed */
	function openRecent(gamertag: string)
	{
		setGamertag(gamertag);
		switchTab(`service_record/${gamertag}`, "Service Record");
	}

	/** When enter is pressed */
	function searchForGamertagViaEnter(event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (event.key === "Enter")
		{
			searchForGamertag();
		}
	};

	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% - 64px)" }}>
			<Toolbar />
			<Divider />
			<GamertagSearch search={localGamertag} openRecent={openRecent} onValueChanged={onGamertagTextChange} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} />
		</Box>
	);
}