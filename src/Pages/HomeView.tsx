import { Box, Divider, Grid, Link, Toolbar, Typography } from "@mui/material";
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

	document.title = "Spartan Record";

	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% - 32px)" }}>
			<Toolbar />
			<Divider />
			<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column" }}>
				<Box sx={{ flexGrow: 1 }} />
				<GamertagSearch search={localGamertag} openRecent={openRecent} onValueChanged={onGamertagTextChange} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} />
				<Box sx={{ flexGrow: 1 }} />
				<Box sx={{ backgroundColor: "secondary.main", textAlign: "center", mt: 18 }}>
					<Typography variant="subtitle1" sx={{ textAlign: "center" }}>Powered by <Link sx={{ cursor: "pointer" }} onClick={() => switchTab("/powered_by_halodotapi")}>HaloDotAPI</Link> | Spartan Record v{process.env.REACT_APP_VERSION}</Typography>
				</Box>

			</Box>
		</Box>
	);
}