import { Box } from "@mui/material";
import { MMR } from "../../../Objects/Pieces/MMR";
import { TitleCard } from "../Cards/TitleCard";
import { BreakdownTile } from "./BreakdownTile";

export function MMRBreakdown(props: { mmr: MMR })
{
	const { mmr } = props;

	return (
		<TitleCard title="MMR">
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                <BreakdownTile title="FFA" value={mmr.ffa && mmr.ffa > 0 ? mmr.ffa.toLocaleString() : "N/A"} isMainStat />
                <BreakdownTile title="Last Spartan Standing" value={mmr.lastSpartanStanding && mmr.lastSpartanStanding > 0 ? mmr.lastSpartanStanding.toLocaleString() : "N/A"} isMainStat />
            </Box>
		</TitleCard>
	);
}