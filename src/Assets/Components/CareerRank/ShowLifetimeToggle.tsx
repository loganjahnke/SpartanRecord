import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";

interface ShowLifetimeToggleProps
{
	setShowLifetime: (showLifetime: boolean) => void;
}

export function ShowLifetimeToggle(props: ShowLifetimeToggleProps)
{
	const { setShowLifetime } = props;
	const [mode, setMode] = useState("current");

	/**
	 * When the toggle button is pressed
	 * @param _event event
	 * @param newMode new mode
	 */
	function handleToggleButtonChange(_event: React.MouseEvent<HTMLElement>, newMode: string | null)
	{
		if (newMode)
		{
			setMode(newMode);
			setShowLifetime(newMode === "lifetime");
		}
	}

	return (
		<ToggleButtonGroup value={mode} exclusive onChange={handleToggleButtonChange} aria-label="text alignment" size="small">
			<ToggleButton value="current" aria-label="left aligned">Current</ToggleButton>
			<ToggleButton value="lifetime" aria-label="centered">Lifetime</ToggleButton>
		</ToggleButtonGroup>
	);
}