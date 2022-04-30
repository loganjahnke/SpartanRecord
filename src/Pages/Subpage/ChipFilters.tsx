import { Box, Chip, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { FilterCount } from "../../Objects/Pieces/FilterCounts";

interface ServiceRecordFiltersProps
{
	activeFilter: string;
	filters: FilterCount[];
	onFilterClick: (filter: string) => void;
	areVariants?: boolean;
}

export function ChipFilters(props: ServiceRecordFiltersProps)
{
	const { activeFilter, filters, onFilterClick, areVariants } = props;

	const [selectedPrefix, setSelectedPrefix] = useState("");
	const [variantPrefixes, setVariantPrefixes] = useState<string[]>([]);

	/**
	 * When a chip is clicked
	 * @param filter the name of the filter
	 */
	function onChipClick(filter: string)
	{
		onFilterClick(filter);
	}

	/**
	 * When the toggle button is pressed
	 * @param _event event
	 * @param newPrefix new mode
	 */
	function handleToggleButtonChange(_event: React.MouseEvent<HTMLElement>, newPrefix: string | null)
	{
		if (newPrefix)
		{
			setSelectedPrefix(newPrefix);
		}
	}

	useEffect(() =>
	{
		if (areVariants)
		{
			const allPrefixes = filters.map(filter => filter.name.slice(0, filter.name.indexOf(":"))).filter((v, i, a) => a.indexOf(v) === i);
			setVariantPrefixes(allPrefixes);
			setSelectedPrefix(allPrefixes.length > 0 ? allPrefixes[0] : "");
		}
	}, [filters]);
	
	return areVariants ?
		<Box sx={{ textAlign: "center", flexGrow: 1 }}>
			<ToggleButtonGroup value={selectedPrefix} exclusive onChange={handleToggleButtonChange} aria-label="text alignment" size="small">
				{variantPrefixes.map(prefix => <ToggleButton value={prefix}>{prefix}</ToggleButton>)}
			</ToggleButtonGroup>
			<Box sx={{ textAlign: "center", flexGrow: 1, mt: 1 }}>
				{filters.filter(filter => filter.name.startsWith(selectedPrefix)).map(filter => <Chip sx={{ margin: "4px 4px" }} label={filter.name.slice(selectedPrefix.length + 1) + " (" + filter.count + ")"} variant={activeFilter === filter.name ? "filled" : "outlined"} onClick={() => onChipClick(filter.name)} />)}
			</Box>
		</Box>
		: 
		<Box sx={{ textAlign: "center", flexGrow: 1 }}>
			{filters.map(filter => <Chip sx={{ margin: "4px 4px" }} label={filter.name + " (" + filter.count + ")"} variant={activeFilter === filter.name ? "filled" : "outlined"} onClick={() => onChipClick(filter.name)} />)}
		</Box>
	;
}