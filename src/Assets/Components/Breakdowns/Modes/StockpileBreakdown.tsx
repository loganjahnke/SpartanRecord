import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "../BreakdownTile";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";

export function StockpileBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Deposits" value={showPerMatch ? serviceRecord.stockpile.powerSeedsDeposited / serviceRecord.matchesPlayed : serviceRecord.stockpile.powerSeedsDeposited} isMainStat />
				<BreakdownTile title="Steals" value={showPerMatch ? serviceRecord.stockpile.powerSeedsStolen / serviceRecord.matchesPlayed : serviceRecord.stockpile.powerSeedsStolen} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Carrier Kills" value={showPerMatch ? serviceRecord.stockpile.powerSeedCarriersKilled / serviceRecord.matchesPlayed : serviceRecord.stockpile.powerSeedCarriersKilled} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Kills as Carrier" value={showPerMatch ? serviceRecord.stockpile.killsAsPowerSeedCarrier / serviceRecord.matchesPlayed : serviceRecord.stockpile.killsAsPowerSeedCarrier} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Power Seed Carrier Time" value={serviceRecord.stockpile.timeAsPowerSeedCarrier} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Power Seed Driver Time" value={serviceRecord.stockpile.timeAsPowerSeedDriver} small isMainStat backgroundColor={ArrowheadTheme.box}  />
			</Box>
		</>
	);
}