import { Box } from "@mui/material";
import { VerticalModeLabelValue } from "./ModeLabelValue";
import { PlayerMatchPlayer } from "../../../../Objects/Pieces/PlayerMatchPlayer";
import { MatchPlayer } from "../../../../Objects/Pieces/MatchPlayer";

interface GenericModeProps
{
	player?: PlayerMatchPlayer | MatchPlayer;
	isPVE?: boolean;
}

export function GenericMode(props: GenericModeProps)
{
	const { player, isPVE } = props;

	if (!player) { return <></>; }

	const kda = (player instanceof PlayerMatchPlayer) ? player.kda : player.stats.kda;
	const kdr = (player instanceof PlayerMatchPlayer) ? player.kdr : player.stats.kdr;
	const maxSpree = (player instanceof PlayerMatchPlayer) ? player.summary.maxKillingSpree : player.stats.summary.maxKillingSpree;
	const damage = (player instanceof PlayerMatchPlayer) ? player.damage : player.stats.damage;

	return <Box>
		<Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
			<VerticalModeLabelValue label="KDA" value={Math.round(kda * 10) / 10} />
			{isPVE 
				? <VerticalModeLabelValue label="Damage Dealt" value={damage.dealt} />
				: <>
					<VerticalModeLabelValue label="Max Killing Spree" value={maxSpree} />
					<VerticalModeLabelValue label="KDR" value={Math.round(kdr * 10) / 10} />
				</>
			}
		</Box>
	</Box>;
}