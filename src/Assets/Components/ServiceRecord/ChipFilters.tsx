import { Box, Chip } from "@mui/material";
import { HaloDotAPIPlaylist, HaloDotAPICategory } from "../../../Database/Schemas/AutocodeMetadata";
import { SRFilter } from "../../../Objects/Pieces/SRFilter";

interface ServiceRecordFiltersProps
{
	activeFilter: string;
	filters: HaloDotAPIPlaylist[] | HaloDotAPICategory[] | string[] | SRFilter[];
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
				else if (filter instanceof SRFilter)
				{
					return <Chip sx={{ margin: "4px 4px" }} label={(filter as SRFilter).name + " (" + (filter as SRFilter).count + ")"} variant={activeFilter === (filter as SRFilter).id ? "filled" : "outlined"} onClick={() => onChipClick((filter as SRFilter).id)} />;
				}
				else
				{
					return <Chip sx={{ margin: "4px 4px" }} label={filter.name} variant={activeFilter === ((((filter as any)?.id) ?? (filter as any)?.id) + "") ? "filled" : "outlined"} onClick={() => onChipClick((filter as any)?.id ?? (filter as any)?.id)} />;
				}
			})}
		</Box>
	);
}