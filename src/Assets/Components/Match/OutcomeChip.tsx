import { Box, Chip, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { PlayerMatchPlayer } from "../../../Objects/Pieces/PlayerMatchPlayer";

interface OutcomeChipProps
{
	player?: PlayerMatchPlayer;
}

export function OutcomeChip(props: OutcomeChipProps)
{
	const { player } = props;
	
	if (!player) { return <></>; }

	return <Box sx={{
		pt: 1,
		pb: 1,
		width: "100%",
		display: "flex", 
		flexDirection: "row", 
		justifyContent: "space-evenly", 
		alignItems: "center",
	}}>
		<Chip 
			label={
				<Typography sx={{ display: "flex", alignItems: "center", pl: 2, pr: 2 }}>
					<Typography component="span" variant="h6" sx={
						{ 
							fontWeight: 900,
							mr: 3,
						}
					}>
						{player.outcome === "win" 
							? "WIN"
							: player.outcome === "loss" 
							? "LOSS"
							: player.outcome === "draw"
							? "Tie"
							: "Left Early"}
					</Typography>
					<Box sx={{ textAlign: "center", mr: 3 }}>
						<Typography variant="caption" component="div" sx={{ color: "#BBBBBB", textTransform: "uppercase", fontSize: "0.6rem", mb: "-3px" }}>Placement</Typography>
						<Typography fontSize="small" component="div">{player.placement}</Typography>
					</Box>
					<Box sx={{ textAlign: "center" }}>
						<Typography variant="caption" component="div" sx={{ color: "#BBBBBB", textTransform: "uppercase", fontSize: "0.6rem", mb: "-3px" }}>Score</Typography>
						<Typography fontSize="small" component="div">{player.scores.personal.toLocaleString()}</Typography>
					</Box>
				</Typography>
			}
			sx={{
				backgroundColor: player.outcome === "win" 
					? ArrowheadTheme.good + "55"
					: player.outcome === "loss" 
					? ArrowheadTheme.bad + "55"
					: player.outcome === "draw"
					? "initial"
					: ArrowheadTheme.leftEarlyText + "55",
				pt: 3,
				pb: 3,
				border: "2px solid",
				borderColor: player.outcome === "win" 
					? ArrowheadTheme.good
					: player.outcome === "loss" 
					? ArrowheadTheme.bad
					: player.outcome === "draw"
					? "initial"
					: ArrowheadTheme.leftEarlyText
			}}
		/>
	</Box>;
}