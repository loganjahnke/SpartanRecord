import { Box } from "@mui/material";
import { CTFSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { ModeLabelValue } from "./ModeLabelValue";

interface CTFModeProps
{
	mode: CTFSchema;
}

export function CTFMode(props: CTFModeProps)
{
	const { mode } = props;

	const humanTimeAsCarrier = mode.time_as_flag_carrier.seconds >= 3600
		? mode.time_as_flag_carrier.human
		: mode.time_as_flag_carrier.seconds >= 600
		? mode.time_as_flag_carrier.human.substring(4)
		: mode.time_as_flag_carrier.seconds >= 60
		? mode.time_as_flag_carrier.human.substring(5)
		: mode.time_as_flag_carrier.seconds >= 10
		? mode.time_as_flag_carrier.human.substring(8)
		: mode.time_as_flag_carrier.human.substring(9);
		

	return <Box>
		<Box sx={{ display: "flex" }}>
			<Box sx={{ width: "50%" }}>
				<ModeLabelValue label="Flag Captures" value={mode.flag_captures} />
				<ModeLabelValue label="Capture Assists" value={mode.flag_capture_assists} />
				<ModeLabelValue label="Flag Returns" value={mode.flag_returns} />
			</Box>
			<Box sx={{ width: "50%" }}>
				<ModeLabelValue label="Flag Steals" value={mode.flag_steals} />
				<ModeLabelValue label="Carriers Killed" value={mode.flag_carriers_killed} />
				<ModeLabelValue label="Carrier Time" time={humanTimeAsCarrier} />
			</Box>
		</Box>
	</Box>;
}