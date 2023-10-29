import { Box } from "@mui/material";
import { InfectionSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { ModeLabelValue } from "./ModeLabelValue";
import { TimePlayed } from "../../../../Objects/Pieces/TimePlayed";

interface InfectionModeProps
{
	mode: InfectionSchema;
}

export function InfectionMode(props: InfectionModeProps)
{
	const { mode } = props;

	const timeAsLastSpartan = new TimePlayed(mode.time_as_last_spartan_standing);

	return <Box>
		<Box sx={{ display: "flex" }}>
			<Box sx={{ width: "50%", ml: 1 }}>
				<ModeLabelValue label="Rounds as Alpha" value={mode.rounds_as_alpha} />
				<ModeLabelValue label="Spartans Infected" value={mode.spartans_infected + mode.spartans_infected_as_alpha} />
			</Box>
			<Box sx={{ width: "50%", mr: 1 }}>
				<ModeLabelValue label="Infected Killed" value={mode.alphas_killed + mode.infected_killed} />
				<ModeLabelValue label="Time as Last Spartan" time={timeAsLastSpartan.readable()} />
			</Box>
		</Box>
	</Box>;
}