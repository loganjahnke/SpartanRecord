import { Box } from "@mui/material";
import { TitleCard } from "../Cards/TitleCard";
import { KillBreakdownChart } from "../Charts/KillBreakdownChart";
import { BreakdownRowTile } from "./BreakdownRowTile";
import { BreakdownProps } from "./BreakdownTile";

export function KillBreakdownCard(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<TitleCard title="Kills">
			<Box sx={{ width: "100%", pb: 1 }}>
				<KillBreakdownChart currentSR={serviceRecord} />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownRowTile title="Melee" 
					tooltip="Melee kills, swords, hammers, assassinations" 
					icon={<img src="https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/boxer.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.melee / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.melee} 
					isMainStat />
				<BreakdownRowTile title="Headshots" 
					tooltip="Last shot to the head" 
					icon={<img src="https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/marksman.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.headshots / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.headshots} 
					isMainStat />
				<BreakdownRowTile title="Power Weapons" 
					tooltip="Rockets, snipers, swords, and other power weapons" 
					icon={<img src="https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/bomber.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.powerWeapons / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.powerWeapons} 
					isMainStat />
				<BreakdownRowTile title="Grenades" 
					tooltip="Sticks and bounces, all thrown explosives" 
					icon={<img src="https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/grenadier.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.grenades / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.grenades} 
					isMainStat />
				<BreakdownRowTile title="Fusion Coils" 
					tooltip="Kong!" 
					icon={<img src="https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/kong.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.fusionCoil / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.fusionCoil} 
					isMainStat />
				<BreakdownRowTile title="Assassinations" 
					tooltip="Melee kill in the back" 
					icon={<img src="https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/back-smack.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.assassinations / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.assassinations} 
					isMainStat />
				<BreakdownRowTile title="Splatters" 
					tooltip="Vroom!" 
					icon={<img src="https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/driver.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.splatters / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.splatters} 
					isMainStat />
				<BreakdownRowTile title="Repulsor" 
					tooltip="Mind the Gap and Pancake" 
					icon={<img src="https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/mind-the-gap.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.repulsor / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.repulsor} 
					isMainStat />
			</Box>
		</TitleCard>
	);
}