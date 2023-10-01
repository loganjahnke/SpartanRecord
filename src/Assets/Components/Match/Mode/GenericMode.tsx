import { Box } from "@mui/material";
import { VerticalModeLabelValue } from "./ModeLabelValue";
import { PlayerMatchPlayer } from "../../../../Objects/Pieces/PlayerMatchPlayer";

interface GenericModeProps
{
	player?: PlayerMatchPlayer;
}

export function GenericMode(props: GenericModeProps)
{
	const { player } = props;

	if (!player) { return <></>; }

	return <Box>
		<Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
			<VerticalModeLabelValue label="KDA" value={Math.round(player.kda * 10) / 10} />
			<VerticalModeLabelValue label="Max Killing Spree" value={player.summary.maxKillingSpree} />
			<VerticalModeLabelValue label="KDR" value={Math.round(player.kdr * 10) / 10} />
		</Box>
	</Box>;
}