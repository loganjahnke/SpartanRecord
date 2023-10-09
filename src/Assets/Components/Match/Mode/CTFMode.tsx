import { Box } from "@mui/material";
import { CTFSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { ModeLabelValue } from "./ModeLabelValue";
import { TimePlayed } from "../../../../Objects/Pieces/TimePlayed";

interface CTFModeProps
{
	mode: CTFSchema;
}

export function CTFMode(props: CTFModeProps)
{
	const { mode } = props;

	const timeAsCarrier = new TimePlayed(mode.time_as_flag_carrier);		

	return <Box>
		<Box sx={{ display: "flex" }}>
			<Box sx={{ width: "50%", ml: 1 }}>
				<ModeLabelValue label="Flag Captures" value={mode.flag_captures} />
				<ModeLabelValue label="Capture Assists" value={mode.flag_capture_assists} />
				<ModeLabelValue label="Flag Returns" value={mode.flag_returns} />
			</Box>
			<Box sx={{ width: "50%", mr: 1 }}>
				<ModeLabelValue label="Flag Steals" value={mode.flag_steals} />
				<ModeLabelValue label="Carriers Killed" value={mode.flag_carriers_killed} />
				<ModeLabelValue label="Carrier Time" time={timeAsCarrier.readable()} />
			</Box>
		</Box>
	</Box>;
}