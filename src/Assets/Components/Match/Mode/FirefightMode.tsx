import { Box } from "@mui/material";
import { FirefightSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { ModeLabelValue } from "./ModeLabelValue";

interface FirefightModeProps
{
	mode: FirefightSchema;
}

export function FirefightMode(props: FirefightModeProps)
{
	const { mode } = props;	

	return <Box>
		<Box sx={{ display: "flex" }}>
			<Box sx={{ width: "50%", ml: 1 }}>
				<ModeLabelValue label="Boss Kills" value={mode.boss_kills} />
				<ModeLabelValue label="Brute Kills" value={mode.brute_kills} />
				<ModeLabelValue label="Elite Kills" value={mode.elite_kills} />
				<ModeLabelValue label="Grunt Kills" value={mode.grunt_kills} />
			</Box>
			<Box sx={{ width: "50%", mr: 1 }}>
				<ModeLabelValue label="Hunter Kills" value={mode.hunter_kills} />
				<ModeLabelValue label="Jackal Kills" value={mode.jackal_kills} />
				<ModeLabelValue label="Sentinel Kills" value={mode.sentinel_kills} />
				<ModeLabelValue label="Skimmer Kills" value={mode.skimmer_kills} />
			</Box>
		</Box>
	</Box>;
}