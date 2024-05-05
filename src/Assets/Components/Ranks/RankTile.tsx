import { Box, Button, Divider, Typography } from "@mui/material";
import { GetColorForTeam } from "../../../Objects/Helpers/AllTeams";
import { Leader } from "../../../Objects/Model/Leader";
import { Player } from "../../../Objects/Model/Player";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";

import ArrowheadImg from "../../Images/Secondary/Spartan-Record-Logo-Secondary-White.png";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { Leader343 } from "../../../Objects/Model/Leaderboard343";

export function RankTile(props: { player: Player, myGamertag?: string, value: number, isPercent?: boolean, goToMember: Function })
{
	const { player, value, myGamertag, isPercent, goToMember } = props;

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 0, height: "48px" }}>
			<Button onClick={() => goToMember(player.gamertag)} sx={{ width: "100%", height: "100%", justifyContent: "flex-start", p: 0, borderRadius: 2, textTransform: "none", textAlign: "left", backgroundColor: myGamertag === player.gamertag ? ArrowheadTheme.good : "" }}>
				<img src={player.appearance.emblemURL === "" ? ArrowheadImg : player.appearance.emblemURL} alt="emblem" width="48px" />
				<Box sx={{ ml: 1, display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
					<Typography variant="h6">{player.gamertag}</Typography>
				</Box>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "right", mr: 2 }}>{(Math.round(value * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
			</Button>
		</Box>
	);
}

export function LeaderRankTile(props: { leader: Leader, myGamertag?: string, isPercent?: boolean, goToMember: Function, rank: number })
{
	const { leader, myGamertag, isPercent, goToMember, rank } = props;

	return (
		<Button onClick={() => goToMember(leader.gamertag)} sx={{ 
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			width: "90%", 
			height: "48px", 
			justifyContent: "flex-start", 
			margin: 1, pl: 1, pr: 1, pt: 4, pb: 4,
			borderRadius: 2, 
			textTransform: "none", 
			textAlign: "left", 
			backgroundColor: myGamertag === leader.gamertag ? ArrowheadTheme.good : "secondary.main" 
		}}>
			{leader.appearance.emblemURL === "" ? 
				<Box sx={{ p: "4px", display: "flex", alignItems: "center" }}><img src={ArrowheadImg} alt="emblem" width="40px" /></Box> :
				<img src={leader.appearance.emblemURL} alt="emblem" width="48px" />
			}
			
			<Box sx={{ ml: 1, display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
				<Typography variant="h6">{leader.gamertag}</Typography>
				<Box sx={{ display: "flex", flexDirection: "row", fontSize: "0.75rem" }}>
					<Typography variant="caption" sx={{ color: ArrowheadTheme.text_primary, mr: 1 }}>#{rank}</Typography>
					<Divider flexItem orientation="vertical" sx={{ borderColor: myGamertag === leader.gamertag ? ArrowheadTheme.text_primary : ArrowheadTheme.thin_border }}/>
					<Typography variant="caption" sx={{ color: myGamertag === leader.gamertag ? ArrowheadTheme.text_primary : ArrowheadTheme.text_secondary, ml: 1 }}>{leader.matchesPlayed.toLocaleString()} matches</Typography>
				</Box>
			</Box>
			<Typography variant="h5" sx={{ flexGrow: 1, textAlign: "right", mr: 2 }}>{(Math.round(leader.value * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
		</Button>
	);
}

export function Leader343RankTile(props: { leader: Leader343, goToMember: Function, rank: number })
{
	const { leader, goToMember, rank } = props;

	return (
		<Button onClick={() => goToMember(leader.gamertag)} sx={{ 
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			width: "90%", 
			height: "48px", 
			justifyContent: "flex-start", 
			margin: 1, pl: 1, pr: 1, pt: 4, pb: 4,
			borderRadius: 2, 
			textTransform: "none", 
			textAlign: "left", 
			backgroundColor: "secondary.main" 
		}}>
			{leader.iconUrl === "" ? 
				<Box sx={{ p: "4px", display: "flex", alignItems: "center" }}><img src={ArrowheadImg} alt="emblem" width="40px" /></Box> :
				<img src={leader.iconUrl} alt="emblem" width="48px" />
			}
			
			<Box sx={{ ml: 1, display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
				<Typography variant="h6">{leader.gamertag}</Typography>
				<Box sx={{ display: "flex", flexDirection: "row", fontSize: "0.75rem", alignItems: "center" }}>
					<Typography variant="caption" sx={{ color: ArrowheadTheme.text_primary, mr: 1 }}>#{rank}</Typography>
					<Divider flexItem orientation="vertical" sx={{ borderColor: ArrowheadTheme.thin_border, mr: 1 }}/>
					<img src="https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/csrs/onyx-1.png" alt= "onyx" height="16px" />
				</Box>
			</Box>
			<Box sx={{ flexGrow: 1, textAlign: "right", mr: 2 }}>
				<Typography variant="h5">{leader.csr.toLocaleString()}</Typography>
				<Typography variant="caption">CSR</Typography>
			</Box>
		</Button>
	);
}

export function MatchRankTile(props: { player: MatchPlayer, value: number, myGamertag?: string, isPercent?: boolean, goToMember: Function, isCSR?: boolean, isSpree?: boolean })
{
	const { player, value, myGamertag, isPercent, goToMember, isCSR, isSpree } = props;

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 0, height: "48px", border: myGamertag === player.gamertag ? `1px solid ${ArrowheadTheme.halo_grass}` : "none" }}>
			<Button disabled={player.type === "bot"} onClick={() => goToMember(player.gamertag)} sx={{ width: "100%", height: "100%", justifyContent: "flex-start", p: 0, borderRadius: 2, textTransform: "none", textAlign: "left" }}>
				{player.team.emblem && <Box sx={{ 
					backgroundImage: `url(${player.team.emblem})`, 
					backgroundColor: GetColorForTeam(player.team.name), 
					backgroundSize: "80%",
					backgroundRepeat: "no-repeat",
					width: "48px", 
					height: "48px", 
					backgroundPosition: "center", 
					objectFit: "contain", 
					borderRadius: "12px 0px 0px 12px" }} />}
				<Box sx={{ ml: 1, display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
					<Typography sx={{ fontWeight: myGamertag === player.gamertag ? 900 : 500, color: myGamertag === player.gamertag ? ArrowheadTheme.halo_grass : ArrowheadTheme.text_primary }} variant="h6">{player.gamertag}</Typography>
				</Box>
				<Box sx={{ flexGrow: 1 }} />
				{isCSR && <img alt={player.csr.post.GetTitle()} height="32px" src={player.csr.post.tierImageUrl} />}
				{isSpree && value >=5 && <HighestSpreeMedal maxSpree={value} />}
                <Typography variant="h5" sx={{ textAlign: "right", ml: 2, mr: 2, fontWeight: myGamertag === player.gamertag ? 900 : 500, color: myGamertag === player.gamertag ? ArrowheadTheme.halo_grass : ArrowheadTheme.text_primary }}>{(Math.round(value * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
			</Button>
		</Box>
	);
}

function HighestSpreeMedal(props: { maxSpree: number })
{
	const { maxSpree } = props;

	return <img alt="Highest Spree Medal" height="32px" src={
		maxSpree >= 40 
			? "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/render/image/public/assets/games/halo-infinite/metadata/multiplayer/medals/2875941471.png" :
		maxSpree >= 35
			? "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/render/image/public/assets/games/halo-infinite/metadata/multiplayer/medals/2567026752.png" :
		maxSpree >= 30
			? "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/render/image/public/assets/games/halo-infinite/metadata/multiplayer/medals/1720896992.png" :
		maxSpree >= 25
			? "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/render/image/public/assets/games/halo-infinite/metadata/multiplayer/medals/710323196.png" :
		maxSpree >= 20
			? "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/render/image/public/assets/games/halo-infinite/metadata/multiplayer/medals/1486797009.png" :
		maxSpree >= 15
			? "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/render/image/public/assets/games/halo-infinite/metadata/multiplayer/medals/418532952.png" :
		maxSpree >= 10
			? "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/render/image/public/assets/games/halo-infinite/metadata/multiplayer/medals/4261842076.png" :
		maxSpree >= 5
			? "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/render/image/public/assets/games/halo-infinite/metadata/multiplayer/medals/2780740615.png" : ""
	} />
}