import { Box } from "@mui/material";
import { Expectation } from "../../../Objects/Pieces/Expectation";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { BreakdownTile } from "./BreakdownTile";

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { TitleCard } from "../Cards/TitleCard";

export function ExpectationBreakdown(props: { small?: boolean, kills: Expectation, deaths: Expectation })
{
	const { small, kills, deaths } = props;

	return (
		<TitleCard title={small ? "" : "Expectation"} secondary={small}>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%"}}>
				<BreakdownTile small={small} title="Expected Kills" value={kills.expected} icon={kills.actual < kills.expected ? <ArrowDownwardIcon sx={{ color: ArrowheadTheme.bad }} /> : <ArrowUpwardIcon sx={{ color: ArrowheadTheme.good }} />} isMainStat />
				<BreakdownTile small={small} title="Expected Deaths" value={deaths.expected} icon={deaths.actual < deaths.expected ? <ArrowDownwardIcon sx={{ color: ArrowheadTheme.good }} /> : <ArrowUpwardIcon sx={{ color: ArrowheadTheme.bad }} />} isMainStat />
			</Box>
		</TitleCard>
	);
}