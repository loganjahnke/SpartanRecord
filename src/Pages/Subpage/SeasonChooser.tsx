import { ToggleButtonGroup, ToggleButton, Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";

interface ServiceRecordFiltersProps
{
	setSeason: (season: number) => void;
}

export function SeasonChooser(props: ServiceRecordFiltersProps)
{
	const { setSeason } = props;
	const [season, chooseSeason] = useState<HTMLElement>((-1 as unknown as HTMLElement));

	/**
	 * When the select is changed
	 * @param event event
	 */
	function handleSeasonChange(event: SelectChangeEvent<HTMLElement>)
	{
		const element = event.target.value as HTMLElement;
		if (element)
		{
			chooseSeason(element);
			setSeason(+element);
		}
	}

	return (
		<FormControl size="small">
			<InputLabel>Season</InputLabel>
			<Select value={season} label="Season" onChange={handleSeasonChange}>
				<MenuItem value={-1}>All</MenuItem>
				<MenuItem value={1}>Season 1</MenuItem>
				<MenuItem value={2}>Season 2</MenuItem>
			</Select>
		</FormControl>
	);
}