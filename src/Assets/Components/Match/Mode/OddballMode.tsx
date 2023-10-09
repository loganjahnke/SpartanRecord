import { Box } from "@mui/material";
import { OddballSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { ModeLabelValue } from "./ModeLabelValue";
import { TimePlayed } from "../../../../Objects/Pieces/TimePlayed";

interface OddballModeProps
{
	mode: OddballSchema;
}

export function OddballMode(props: OddballModeProps)
{
	const { mode } = props;

	const timeAsCarrier = new TimePlayed(mode.time_as_skull_carrier);
	const longestTimeAsCarrier = new TimePlayed(mode.longest_time_as_skull_carrier);		

	return <Box>
		<Box sx={{ display: "flex" }}>
			<Box sx={{ width: "50%", ml: 1 }}>
				<ModeLabelValue label="Kills as Carrier" value={mode.kills_as_skull_carrier} />
				<ModeLabelValue label="Carriers Killed" value={mode.skull_carriers_killed} />
				<ModeLabelValue label="Skull Grabs" value={mode.skull_grabs} />
			</Box>
			<Box sx={{ width: "50%", mr: 1 }}>
				<ModeLabelValue label="Total Carrier Time" time={timeAsCarrier.readable()} />
				<ModeLabelValue label="Best Carrier Time" time={longestTimeAsCarrier.readable()} />
			</Box>
		</Box>
	</Box>;
}