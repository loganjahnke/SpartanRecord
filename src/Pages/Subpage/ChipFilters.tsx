import { Box, Chip, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { AutocodePlaylist, AutocodeVariant } from "../../Database/Schemas/AutocodeMetadata";

interface ServiceRecordFiltersProps
{
	activeFilter: string;
	filters: AutocodePlaylist[] | AutocodeVariant[] | string[];
	onFilterClick: (filter: string) => void;
}

export function ChipFilters(props: ServiceRecordFiltersProps)
{
	const { activeFilter, filters, onFilterClick } = props;

	/**
	 * When a chip is clicked
	 * @param filter the name of the filter
	 */
	function onChipClick(filter: string)
	{
		onFilterClick(filter);
	}
	
	return (
		<Box sx={{ textAlign: "center", flexGrow: 1 }}>
			{filters.map(filter => {
				if (typeof(filter) === "string")
				{
					return <Chip sx={{ margin: "4px 4px" }} label={filter} variant={activeFilter === filter ? "filled" : "outlined"} onClick={() => onChipClick(filter)} />;
				}
				else
				{
					return <Chip sx={{ margin: "4px 4px" }} label={filter.name} variant={activeFilter === ((((filter as any)?.category_id) ?? (filter as any)?.asset?.id) + "") ? "filled" : "outlined"} onClick={() => onChipClick((filter as any)?.category_id ?? (filter as any)?.asset?.id)} />;
				}
			})}
		</Box>
	);
}