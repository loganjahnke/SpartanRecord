import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";

interface ServiceRecordFiltersProps
{
	setPerMatch: ((perMatch: boolean) => void);
}

export function ServiceRecordFilters(props: ServiceRecordFiltersProps)
{
	const { setPerMatch } = props;
	const [mode, setMode] = useState("overall");

	/**
	 * When the toggle button is pressed
	 * @param event event
	 * @param newMode new mode
	 */
	function handleToggleButtonChange(event: React.MouseEvent<HTMLElement>, newMode: string | null)
	{
		if (newMode)
		{
			setMode(newMode);
			setPerMatch(newMode === "per match");
		}
	}

	return (
		<ToggleButtonGroup value={mode} exclusive onChange={handleToggleButtonChange} aria-label="text alignment" size="small">
			<ToggleButton value="overall" aria-label="left aligned">Overall</ToggleButton>
			<ToggleButton value="per match" aria-label="centered">Per Match</ToggleButton>
		</ToggleButtonGroup>
	);
}