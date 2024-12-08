import { Box, Typography } from "@mui/material";
import { GridItemCentered } from "../../Common/GridItemCentered";
import { CalloutsProps } from "../Props/CalloutsProps";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";
import { BreakdownTile } from "../../Breakdowns/BreakdownTile";
import { CalloutStat } from "../Typography/CalloutStat";
import { OpacityBox } from "../../Animations/OpacityBox";

interface MatchesCalloutProps extends CalloutsProps
{
	subdelay: string;	
}

/**
 * A component to wrap text around a zoom animation
 */
export function MatchesCallout(props: MatchesCalloutProps)
{
	const { delay, player, subdelay } = props;

	return (
		<GridItemCentered>
			<OpacityBox delay={delay} content={
				<>
					<Typography variant="h6">Let's take a look at your matches breakdown</Typography>
					<Box sx={{ display: "flex", flexDirection: "row", width: "95%", textAlign: "left", mb: 1,
						".MuiBox-root:first-child": { borderRadius: "8px 0 0 8px", mr: "1px" }, 
						".MuiBox-root:last-child": { borderRadius: "0 8px 8px 0", ml: "1px" },
						".MuiBox-root:not(:first-child):not(:last-child)": { ml: "1px", mr: "1px" } }}>
						<BreakdownTile title="Wins" value={player!.serviceRecord.breakdowns.matches.wins} total={player!.serviceRecord.breakdowns.matches.wins + player!.serviceRecord.breakdowns.matches.losses} backgroundColor={ArrowheadTheme.good} />
						<BreakdownTile title="Losses" value={player!.serviceRecord.breakdowns.matches.losses} total={player!.serviceRecord.breakdowns.matches.wins + player!.serviceRecord.breakdowns.matches.losses} backgroundColor={ArrowheadTheme.bad} />
					</Box>
					<OpacityBox delay={subdelay} nested content={
						<MatchesComment {...props} />								
					} />
				</>
			} />
		</GridItemCentered>
	);
}

function MatchesComment(props: MatchesCalloutProps)
{
	const { player } = props;

	if (!player) { return <></>; }

	let comment = "";
	
	if (player.serviceRecord.winRate < 30)
	{
		comment = "Well... it wasn't your best year, but at least you had fun playing!";
	}
	else if (player.serviceRecord.winRate < 50)
	{
		comment = "Not quite more wins than losses, but at least you had fun playing!";
	}
	else if (player.serviceRecord.winRate < 62)
	{
		comment = "Wow, way to win your matches!";
	}
	else
	{
		comment = "Wow, have you ever thought about going pro?! That's a great win rate!";
	}

	return (
		<>
			<Typography sx={{ mt: 1 }}>You won <CalloutStat text={(Math.round(player?.serviceRecord.winRate * 100) / 100).toLocaleString() + "%"} /> of your games</Typography>
			<Typography>{comment}</Typography>
		</>
	);
}