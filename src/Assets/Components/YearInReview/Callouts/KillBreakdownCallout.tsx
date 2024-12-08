import { GridItemCentered } from "../../Common/GridItemCentered";
import { CalloutsProps } from "../Props/CalloutsProps";
import { Box, Typography } from "@mui/material";
import { CalloutStat } from "../Typography/CalloutStat";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";
import { BreakdownTile } from "../../Breakdowns/BreakdownTile";
import { BreakdownCategory } from "../../../../Objects/Pieces/Breakdowns";
import { KillBreakdownChart } from "../../Charts/KillBreakdownChart";
import { OpacityBox } from "../../Animations/OpacityBox";

interface KillBreakdownCalloutProps extends CalloutsProps
{
	killDeathDelay: string;
	chartDelay: string;
}

/**
 * Shows the yearly callout for kills and the breakdown
 */
export function KillBreakdownCallout(props: KillBreakdownCalloutProps)
{
	const { delay, player, killDeathDelay, chartDelay } = props;

	if (!player) { return <></>; }
	return (
		<GridItemCentered>
			<OpacityBox delay={delay} content={
				<>
					<Typography>You conquered other Spartans, earning <CalloutStat text={Math.round(player.serviceRecord.killsPerGame * 100) / 100} /> kills per game!</Typography>
					<OpacityBox delay={killDeathDelay} nested content={
						<>
							<Box sx={{ display: "flex", flexDirection: "row", width: "95%", textAlign: "left", mb: 1,
								".MuiBox-root:first-child": { borderRadius: "8px 0 0 8px", mr: "1px" }, 
								".MuiBox-root:last-child": { borderRadius: "0 8px 8px 0", ml: "1px" },
								".MuiBox-root:not(:first-child):not(:last-child)": { ml: "1px", mr: "1px" } }}>
								<BreakdownTile title="Kills" backgroundColor={ArrowheadTheme.good} value={player.serviceRecord.summary.kills} total={player.serviceRecord.summary.kills + player.serviceRecord.summary.deaths} />
								<BreakdownTile title="Deaths" backgroundColor={ArrowheadTheme.bad} value={player.serviceRecord.summary.deaths} total={player.serviceRecord.summary.kills + player.serviceRecord.summary.deaths} />
							</Box>
							<Typography>That's a KDA of <CalloutStat text={Math.round(player.serviceRecord.kda * 100) / 100} /> and a KDR of <CalloutStat text={Math.round(player.serviceRecord.kdr * 100) / 100} />.</Typography>
						</>
					} />
					<OpacityBox delay={chartDelay} nested content={
						<>							
							<BestKillComment {...props} />
							<KillBreakdownChart currentSR={player.serviceRecord} legendOnBottom />
						</>
					} />
				</>
			} />
		</GridItemCentered>
	);
}

function BestKillComment(props: KillBreakdownCalloutProps)
{
	const { player } = props;

	if (!player) { return ""; }
	
	let totalValueForBest = 0;
	let bestCategory = "";
	let comment = "";
	switch (player.serviceRecord.breakdowns.kills.getTopCategory())
	{
		case BreakdownCategory.melee:
			totalValueForBest = player.serviceRecord.breakdowns.kills.melee;
			bestCategory = "the good ole melee";
			comment = "Have you considered playing fighting games?"; 
			break;
		case BreakdownCategory.grenades:
			totalValueForBest = player.serviceRecord.breakdowns.kills.grenades;
			bestCategory = "grenades";
			comment = "BOOM!"; 
			break;
		case BreakdownCategory.headshots:
			totalValueForBest = player.serviceRecord.breakdowns.kills.headshots;
			bestCategory = "headshots";
			comment = "Precise!"; 
			break;
		case BreakdownCategory.powerWeapons:
			totalValueForBest = player.serviceRecord.breakdowns.kills.powerWeapons;
			bestCategory = "power weapons";
			comment = "You like the big guns, I see."; 
			break;
		case BreakdownCategory.assassinations:
			totalValueForBest = player.serviceRecord.breakdowns.kills.assassinations;
			bestCategory = "assassinations";
			comment = "Melee to the back!"; 
			break;
		case BreakdownCategory.splatters:
			totalValueForBest = player.serviceRecord.breakdowns.kills.splatters;
			bestCategory = "splatters";
			comment = "Big Team Battle must be your go-to, that's a lot of driving!"; 
			break;
		case BreakdownCategory.repulsor:
			totalValueForBest = player.serviceRecord.breakdowns.kills.repulsor;
			bestCategory = "the repulsor";
			comment = "Nice use of equipment!"; 
			break;
		case BreakdownCategory.fusionCoil:
			totalValueForBest = player.serviceRecord.breakdowns.kills.fusionCoil;
			bestCategory = "a fusion coil";
			comment = "KONG! Did you play a lot of Kong Slayer?"; 
			break;
		case BreakdownCategory.sticks:
			totalValueForBest = player.serviceRecord.breakdowns.kills.sticks;
			bestCategory = "stickies";
			comment = "Betcha can't stick it (sounds like you won that bet)!"; 
			break;
	}

	return <>
		<Typography sx={{ mt: 2, mb: 1 }}>Your top way to best other spartans was with <CalloutStat text={bestCategory} />, with a total of <CalloutStat text={totalValueForBest} /> kills.</Typography>
		<Typography sx={{ mb: 2 }}>{comment}</Typography>
	</>
}