import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export enum HeroTrackerModeEnum
{
	GoalDate = "Goal Date",
	GamesPerDay = "Games per Day"
}

interface HeroTrackerModeProps
{
	mode: HeroTrackerModeEnum;
	setHeroTrackerMode: (mode: HeroTrackerModeEnum) => void;
}

export function HeroTrackerMode(props: HeroTrackerModeProps)
{
	const { mode, setHeroTrackerMode } = props;

	/**
	 * When the toggle button is pressed
	 * @param _event event
	 * @param newMode new mode
	 */
	function handleToggleButtonChange(_event: React.MouseEvent<HTMLElement>, newMode: string | null)
	{
		if (newMode)
		{
			setHeroTrackerMode(newMode === "Goal Date" ? HeroTrackerModeEnum.GoalDate : HeroTrackerModeEnum.GamesPerDay);
		}
	}

	return (
		<ToggleButtonGroup sx={{ mb: 2, button: { borderWidth: "0.5px", borderColor: ArrowheadTheme.leftEarlyText }}} value={mode} exclusive onChange={handleToggleButtonChange} aria-label="text alignment" size="small">
			<ToggleButton value="Goal Date" aria-label="left aligned">Goal Date</ToggleButton>
			<ToggleButton value="Games per Day" aria-label="centered">Games / Day</ToggleButton>
		</ToggleButtonGroup>
	);
}