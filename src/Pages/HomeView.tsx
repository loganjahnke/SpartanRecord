import { Box, Divider, Toolbar } from "@mui/material";
import { useState } from "react";

import { GamertagSearch } from "./Subpage/GamertagSearch";
import { ViewProps } from "./Props/ViewProps";

export function HomeView(props: ViewProps)
{
	//#region Props and Navigate
	const { updatePlayer, switchTab } = props;
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
		updatePlayer(localGamertag);
		switchTab(`service_record/${localGamertag}`, "Service Record");
	}

	/** When the search button is pressed */
	function openRecent(gamertag: string)
	{
		updatePlayer(localGamertag);
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