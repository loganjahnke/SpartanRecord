import { Box } from "@mui/material";
import { VerticalModeLabelValue } from "./ModeLabelValue";
import { PlayerMatchPlayer } from "../../../../Objects/Pieces/PlayerMatchPlayer";
import { MatchPlayer } from "../../../../Objects/Pieces/MatchPlayer";

interface GenericModeProps
{
	player?: PlayerMatchPlayer | MatchPlayer;
}

export function GenericMode(props: GenericModeProps)
{
	const { player } = props;

	if (!player) { return <></>; }

	const kda = (player instanceof PlayerMatchPlayer) ? player.kda : player.stats.kda;
	const kdr = (player instanceof PlayerMatchPlayer) ? player.kdr : player.stats.kdr;
	const maxSpree = (player instanceof PlayerMatchPlayer) ? player.summary.maxKillingSpree : player.stats.summary.maxKillingSpree;

	return <Box>
		<Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
			<VerticalModeLabelValue label="KDA" value={Math.round(kda * 10) / 10} />
			<VerticalModeLabelValue label="Max Killing Spree" value={maxSpree} />
			<VerticalModeLabelValue label="KDR" value={Math.round(kdr * 10) / 10} />
		</Box>
	</Box>;
}