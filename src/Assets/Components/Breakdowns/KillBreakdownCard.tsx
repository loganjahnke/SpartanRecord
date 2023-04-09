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
					tooltip="You can call me Joe Louis" 
					icon={<img src="https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/medals/small/boxer.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.melee / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.melee} 
					isMainStat />
				<BreakdownRowTile title="Headshots" 
					tooltip="Last shot to the head" 
					icon={<img src="https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/medals/small/marksman.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.headshots / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.headshots} 
					isMainStat />
				<BreakdownRowTile title="Power Weapons" 
					tooltip="Rockets, snipers, swords, and other power weapons" 
					icon={<img src="https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/medals/small/bomber.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.powerWeapons / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.powerWeapons} 
					isMainStat />
				<BreakdownRowTile title="Grenades" 
					tooltip="Let's throw some pineapples" 
					icon={<img src="https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/medals/small/grenadier.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.grenades / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.grenades} 
					isMainStat />
				<BreakdownRowTile title="Fusion Coils" 
					tooltip="Kong!" 
					icon={<img src="https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/medals/small/kong.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.fusionCoil / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.fusionCoil} 
					isMainStat />
				<BreakdownRowTile title="Assassinations" 
					tooltip="Melee kill in the back" 
					icon={<img src="https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/medals/small/back-smack.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.assassinations / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.assassinations} 
					isMainStat />
				<BreakdownRowTile title="Splatters" 
					tooltip="Vroom!" 
					icon={<img src="https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/medals/small/driver.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.splatters / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.splatters} 
					isMainStat />
				<BreakdownRowTile title="Sticks" 
					tooltip="I bet ya can't stick it" 
					icon={<img src="https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/medals/3655682764.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.sticks / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.sticks} 
					isMainStat />
				<BreakdownRowTile title="Repulsor" 
					tooltip="Mind the Gap and Pancake" 
					icon={<img src="https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/medals/small/mind-the-gap.png" alt="Medal" height="48px" width="48px" />} 
					value={showPerMatch ? serviceRecord.breakdowns.kills.repulsor / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.repulsor} 
					isMainStat />
			</Box>
		</TitleCard>
	);
}