import { Box } from "@mui/material";
import { ZoneSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { ModeLabelValue } from "./ModeLabelValue";
import { TimePlayed } from "../../../../Objects/Pieces/TimePlayed";

interface ZoneModeProps
{
	mode: ZoneSchema;
}

export function ZoneMode(props: ZoneModeProps)
{
	const { mode } = props;

	const timeInZone = new TimePlayed(mode.stronghold_occupation_time);

	return <Box>
		<Box sx={{ display: "flex" }}>
			<Box sx={{ width: "50%", ml: 1 }}>
				<ModeLabelValue label="Zone Captures" value={mode.stronghold_captures} />
				<ModeLabelValue label="Zone Secures" value={mode.stronghold_secures} />
				<ModeLabelValue label="Time in Zones" time={timeInZone.readable()} />
			</Box>
			<Box sx={{ width: "50%", mr: 1 }}>
				<ModeLabelValue label="Offensive Kills" value={mode.stronghold_offensive_kills} />
				<ModeLabelValue label="Defensive Kills" value={mode.stronghold_defensive_kills} />
			</Box>
		</Box>
	</Box>;
}