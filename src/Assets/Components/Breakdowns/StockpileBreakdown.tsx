import { Box } from "@mui/material";
import { TitleCard } from "../Cards/TitleCard";
import { BreakdownRowTile } from "./BreakdownRowTile";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function StockpileBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<TitleCard title="Stockpile">
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Deposits" value={showPerMatch ? serviceRecord.stockpile.powerSeedsDeposited / serviceRecord.matchesPlayed : serviceRecord.stockpile.powerSeedsDeposited} isMainStat />
				<BreakdownTile title="Steals" value={showPerMatch ? serviceRecord.stockpile.powerSeedsStolen / serviceRecord.matchesPlayed : serviceRecord.stockpile.powerSeedsStolen} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownRowTile title="Carrier Kills" value={showPerMatch ? serviceRecord.stockpile.powerSeedCarriersKilled / serviceRecord.matchesPlayed : serviceRecord.stockpile.powerSeedCarriersKilled} isMainStat  />
				<BreakdownRowTile title="Kills as Carrier" value={showPerMatch ? serviceRecord.stockpile.killsAsPowerSeedCarrier / serviceRecord.matchesPlayed : serviceRecord.stockpile.killsAsPowerSeedCarrier} isMainStat  />
				<BreakdownRowTile title="Power Seed Carrier Time" value={serviceRecord.stockpile.timeAsPowerSeedCarrier} isMainStat  />
				<BreakdownRowTile title="Power Seed Driver Time" value={serviceRecord.stockpile.timeAsPowerSeedDriver} isMainStat  />
			</Box>
		</TitleCard>
	);
}