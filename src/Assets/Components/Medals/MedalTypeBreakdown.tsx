import { Box, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { AllMedals } from "../../../Objects/Helpers/AllMedals";
import { Medal, MedalType } from "../../../Objects/Pieces/Medal";
import { BreakdownTile } from "../Breakdowns/BreakdownTile";
import { MedalTile } from "./MedalTile";
import { UnearnedMedalTile } from "./UnearnedMedalTile";

interface MedalTypeBreakdownProps
{
	type: MedalType;
	medals: Medal[];
}

export function MedalTypeBreakdown(props: MedalTypeBreakdownProps)
{
	const { type, medals } = props;

	const [showAll, setShowAll] = useState(false);

	const filtered = medals.filter(medal => medal.type === type);
	const totalCountArray = filtered.length > 0 ? filtered.map(medal => medal.count) : [];
	const totalCount = totalCountArray.length > 0 ? totalCountArray.reduce((a, b) => a + b) : 0;

	function onPressShowAll(event: React.ChangeEvent<HTMLInputElement>)
	{
		setShowAll(event.target.checked);
	}

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3 }}>
			<FormGroup sx={{ textAlign: "right", float: "right" }}>
				<FormControlLabel control={<Checkbox checked={showAll} onChange={onPressShowAll} size="small" />} label={<Typography variant="subtitle1">Show All</Typography>} />
			</FormGroup>
			<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", clear: "both" }}>
				<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
					<BreakdownTile title={`Total ${type} Medals`} value={totalCount} isMainStat isHeader />
				</Box>
				<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap", width: "100%" }}>
					{filtered.map(medal => <MedalTile medal={medal} />)}
				</Box>
				{showAll 
					?  <Box sx={{ backgroundColor: "secondary.main", borderRadius:3, m: 2, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "center" }}>
							{Object.values(AllMedals)
								.map((medalJSON: any) => new Medal(medalJSON))
								.filter(medal => medal.type === type && (filtered.length > 0 ? !filtered.map(filter => filter.name).includes(medal.name) : true))
								.sort((a, b) => a.sort > b.sort ? 1 : -1)
								.map(medal => <UnearnedMedalTile medal={medal} />)}
						</Box>
					: undefined}
			</Box>
		</Box>
	);
}