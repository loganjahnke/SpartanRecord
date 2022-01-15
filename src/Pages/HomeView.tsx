import { Box, Divider, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GamertagSearch } from "./Subpage/GamertagSearch";
import { ViewProps } from "./Props/ViewProps";

export function HomeView(props: ViewProps)
{
	//#region Props and Navigate
	const { app } = props;
	const navigate = useNavigate();
	//#endregion
	
	//#region State
 	const [gamertag, setGamertag] = useState("");
	//#endregion

	/** Controlled search component */
	function onGamertagTextChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		setGamertag(event.target.value);
	};

	/** When the search button is pressed */
	function searchForGamertag()
	{
		if (gamertag === "") { return; }
		navigate(`service_record/${gamertag}`);
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
			<GamertagSearch search={gamertag} onValueChanged={onGamertagTextChange} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} />
		</Box>
	);
}