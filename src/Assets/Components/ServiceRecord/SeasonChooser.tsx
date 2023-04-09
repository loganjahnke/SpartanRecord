import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { HaloDotAPISeason } from "../../../Database/Schemas/AutocodeMetadata";

interface ServiceRecordFiltersProps
{
	season: string;
	setSeason: (season: string) => void;
	seasons: HaloDotAPISeason[];
	hideAll?: boolean;
}

export function SeasonChooser(props: ServiceRecordFiltersProps)
{
	const { setSeason, seasons, hideAll, season } = props;

	/**
	 * When the select is changed
	 * @param event event
	 */
	function handleSeasonChange(event: SelectChangeEvent<HTMLElement>)
	{
		let element = event.target.value as string;
		if (element === "All") { element = ""; }
		setSeason(element as any as string);
	}

	return (
		<FormControl size="small">
			<InputLabel>Season</InputLabel>
			<Select value={(season as any === "" ? "All" : season as any) as HTMLElement} label="Season" onChange={handleSeasonChange}>
				{!hideAll && <MenuItem value={"All"}>All</MenuItem>}
				{seasons.map(season => <MenuItem value={season.properties.identifier}>Season {season.id}: {season.name}</MenuItem>)}
			</Select>
		</FormControl>
	);
}