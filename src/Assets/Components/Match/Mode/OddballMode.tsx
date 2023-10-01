import { Box } from "@mui/material";
import { OddballSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { ModeLabelValue } from "./ModeLabelValue";

interface OddballModeProps
{
	mode: OddballSchema;
}

export function OddballMode(props: OddballModeProps)
{
	const { mode } = props;

	const humanTimeAsCarrier = mode.time_as_skull_carrier.seconds >= 3600
		? mode.time_as_skull_carrier.human
		: mode.time_as_skull_carrier.seconds >= 600
		? mode.time_as_skull_carrier.human.substring(4)
		: mode.time_as_skull_carrier.seconds >= 60
		? mode.time_as_skull_carrier.human.substring(5)
		: mode.time_as_skull_carrier.seconds >= 10
		? mode.time_as_skull_carrier.human.substring(8)
		: mode.time_as_skull_carrier.human.substring(9);

	const longestHumanTimeAsCarrier = mode.longest_time_as_skull_carrier.seconds >= 3600
		? mode.longest_time_as_skull_carrier.human
		: mode.longest_time_as_skull_carrier.seconds >= 600
		? mode.longest_time_as_skull_carrier.human.substring(4)
		: mode.longest_time_as_skull_carrier.seconds >= 60
		? mode.longest_time_as_skull_carrier.human.substring(5)
		: mode.longest_time_as_skull_carrier.seconds >= 10
		? mode.longest_time_as_skull_carrier.human.substring(8)
		: mode.longest_time_as_skull_carrier.human.substring(9);
		

	return <Box>
		<Box sx={{ display: "flex" }}>
			<Box sx={{ width: "50%" }}>
				<ModeLabelValue label="Kills as Carrier" value={mode.kills_as_skull_carrier} />
				<ModeLabelValue label="Carriers Killed" value={mode.skull_carriers_killed} />
				<ModeLabelValue label="Skull Grabs" value={mode.skull_grabs} />
			</Box>
			<Box sx={{ width: "50%" }}>
				<ModeLabelValue label="Total Carrier Time" time={humanTimeAsCarrier} />
				<ModeLabelValue label="Best Carrier Time" time={longestHumanTimeAsCarrier} />
			</Box>
		</Box>
	</Box>;
}