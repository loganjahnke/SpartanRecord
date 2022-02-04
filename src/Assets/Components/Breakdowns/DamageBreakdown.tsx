import { Box, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function DamageBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch, small } = props;

	return (
		<Box sx={{ backgroundColor: small ? ArrowheadTheme.secondary : ArrowheadTheme.box, borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
				<BreakdownTile small={small} title="Damage Dealt" value={showPerMatch ? serviceRecord.damage.dealt / serviceRecord.matchesPlayed : serviceRecord.damage.dealt} isMainStat />
				<BreakdownTile small={small} title="Damage Taken" value={showPerMatch ? serviceRecord.damage.taken / serviceRecord.matchesPlayed : serviceRecord.damage.taken} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
				<BreakdownTile small={small} title="Damage Efficiency" value={100 * serviceRecord.damageEfficiency} isMainStat isPercent tooltip="Damage efficiency is the ratio of the exact amount of damage needed to kill an enemy over your damage dealt per kill." />
				<BreakdownTile small={small} title="Enemy Efficiency" value={100 * serviceRecord.enemyDamageEfficiency} isMainStat isPercent tooltip="Enemy efficiency is the ratio of the exact amount of damage needed to kill an enemy over your damage taken per death." />
			</Box>
		</Box>
	);
}