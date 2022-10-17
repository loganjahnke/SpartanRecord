import { Box } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { TitleCard } from "../Cards/TitleCard";
import { BreakdownProps, BreakdownTile, MatchBreakdownProps } from "./BreakdownTile";

export function DamageBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch, small } = props;

	return (
		<TitleCard title={small ? "" : "Damage"} secondary={small}>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%"}}>
				<BreakdownTile small={small} title="Damage Dealt" value={showPerMatch ? serviceRecord.damage.dealt / serviceRecord.matchesPlayed : serviceRecord.damage.dealt} isMainStat />
				<BreakdownTile small={small} title="Damage Taken" value={showPerMatch ? serviceRecord.damage.taken / serviceRecord.matchesPlayed : serviceRecord.damage.taken} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%"}}>
				<BreakdownTile small={small} title="Damage Efficiency" value={100 * serviceRecord.damageEfficiency} isMainStat isPercent tooltip="Damage efficiency is the ratio of the exact amount of damage needed to kill an enemy over your damage dealt per kill." />
				<BreakdownTile small={small} title="Enemy Efficiency" value={100 * serviceRecord.enemyDamageEfficiency} isMainStat isPercent tooltip="Enemy efficiency is the ratio of the exact amount of damage needed to kill an enemy over your damage taken per death." />
			</Box>
		</TitleCard>
	);
}

export function MatchDamageBreakdown(props: MatchBreakdownProps)
{
	const { match, small } = props;

	return (
		<Box sx={{ width: "325px" }}>
			<Box sx={{ display: "flex", flexDirection: "row", width: "95%", mb: 1,
				".MuiBox-root:first-child": { borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px", mr: "1px" }, 
				".MuiBox-root:last-child": { borderTopRightRadius: "8px", borderBottomRightRadius: "8px", ml: "1px" },
				".MuiBox-root:not(:first-child):not(:last-child)": { ml: "1px", mr: "1px" } }}>
				<BreakdownTile small={small} title="Damage Dealt" value={match.player.damage.dealt} total={match.player.damage.dealt + match.player.damage.taken} borderColor={ArrowheadTheme.good} />
				<BreakdownTile small={small} title="Damage Taken" value={match.player.damage.taken} total={match.player.damage.dealt + match.player.damage.taken} borderColor={ArrowheadTheme.bad} />
			</Box>
		</Box>
	);
}