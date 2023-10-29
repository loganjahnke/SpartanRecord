import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "../BreakdownTile";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";

export function InfectionBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Infected Killed" value={serviceRecord.infection.infected_killed + serviceRecord.infection.alphas_killed} isMainStat />
				<BreakdownTile title="Spartans Infected" value={serviceRecord.infection.spartans_infected + serviceRecord.infection.spartans_infected_as_alpha} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Time as Last Spartan Standing" value={serviceRecord.infection.time_as_last_spartan_standing.readable()} small isMainStat backgroundColor={ArrowheadTheme.box} />
			</Box>
		</>
	);
}