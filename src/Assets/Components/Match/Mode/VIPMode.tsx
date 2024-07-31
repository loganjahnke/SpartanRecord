import { Box } from "@mui/material";
import { VIPSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { ModeLabelValue } from "./ModeLabelValue";
import { TimePlayed } from "../../../../Objects/Pieces/TimePlayed";

interface VIPModeProps
{
	mode: VIPSchema;
}

export function VIPMode(props: VIPModeProps)
{
	const { mode } = props;

	const timeAsVIP = new TimePlayed(mode.time_as_vip);

	return <Box>
		<Box sx={{ display: "flex" }}>
			<Box sx={{ width: "50%", ml: 1 }}>
				<ModeLabelValue label="Kills as VIP" value={mode.kills_as_vip} />
				<ModeLabelValue label="Max Spree as VIP" value={mode.max_killing_spree_as_vip} />
				<ModeLabelValue label="Time in VIPs" time={timeAsVIP.readable()} />
			</Box>
			<Box sx={{ width: "50%", mr: 1 }}>
				<ModeLabelValue label="VIP Kills" value={mode.vip_kills} />
				<ModeLabelValue label="VIP Assists" value={mode.vip_assists} />
			</Box>
		</Box>
	</Box>;
}