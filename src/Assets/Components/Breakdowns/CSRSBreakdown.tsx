import { Box } from "@mui/material";
import { CSRS } from "../../../Objects/Model/CSRS";
import { TitleCard } from "../Cards/TitleCard";
import { CSRSBreakdownTile } from "./CSRSBreakdownTile";

export function CSRSBreakdown(props: { csrs: CSRS[] })
{
	const { csrs } = props;

	return (
		<TitleCard title="CSRS">
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				{csrs.map(rank => <CSRSBreakdownTile csrs={rank} />)}
			</Box>
		</TitleCard>
	);
}