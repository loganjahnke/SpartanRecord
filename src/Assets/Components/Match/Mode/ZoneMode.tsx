import { Box } from "@mui/material";
import { ZoneSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { ModeLabelValue } from "./ModeLabelValue";

interface ZoneModeProps
{
	mode: ZoneSchema;
}

export function ZoneMode(props: ZoneModeProps)
{
	const { mode } = props;

	const humanTimeInZone = mode.stronghold_occupation_time.seconds >= 3600
		? mode.stronghold_occupation_time.human
		: mode.stronghold_occupation_time.seconds >= 600
		? mode.stronghold_occupation_time.human.substring(4)
		: mode.stronghold_occupation_time.seconds >= 60
		? mode.stronghold_occupation_time.human.substring(5)
		: mode.stronghold_occupation_time.seconds >= 10
		? mode.stronghold_occupation_time.human.substring(8)
		: mode.stronghold_occupation_time.human.substring(9);
		

	return <Box>
		<Box sx={{ display: "flex" }}>
			<Box sx={{ width: "50%" }}>
				<ModeLabelValue label="Zone Captures" value={mode.stronghold_captures} />
				<ModeLabelValue label="Zone Secures" value={mode.stronghold_secures} />
				<ModeLabelValue label="Time in Zones" time={humanTimeInZone} />
			</Box>
			<Box sx={{ width: "50%" }}>
				<ModeLabelValue label="Offensive Kills" value={mode.stronghold_offensive_kills} />
				<ModeLabelValue label="Defensive Kills" value={mode.stronghold_defensive_kills} />
			</Box>
		</Box>
	</Box>;
}