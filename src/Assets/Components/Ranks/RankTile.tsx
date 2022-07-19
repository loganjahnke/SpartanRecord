import { Box, Button, Divider, Typography } from "@mui/material";
import { GetColorForTeam } from "../../../Objects/Helpers/AllTeams";
import { Leader } from "../../../Objects/Model/Leader";
import { Player } from "../../../Objects/Model/Player";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";

import ArrowheadImg from "../../Images/Secondary/Spartan-Record-Logo-Secondary-White.png";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

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

export function MatchRankTile(props: { player: MatchPlayer, value: number, myGamertag?: string, isPercent?: boolean, goToMember: Function, isSpree?: boolean })
{
	const { player, value, myGamertag, isPercent, goToMember, isSpree } = props;

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 0, height: "48px" }}>
			<Button disabled={player.type === "bot"} onClick={() => goToMember(player.gamertag)} sx={{ width: "100%", height: "100%", justifyContent: "flex-start", p: 0, borderRadius: 2, textTransform: "none", textAlign: "left", backgroundColor: myGamertag === player.gamertag ? ArrowheadTheme.good : "" }}>
				{player.team.emblem && <Box sx={{ 
					backgroundImage: `url(${player.team.emblem})`, 
					backgroundColor: GetColorForTeam(player.team.name), 
					backgroundSize: "80%",
					backgroundRepeat: "no-repeat",
					width: "48px", 
					height: "48px", 
					backgroundPosition: "center", 
					objectFit: "contain", 
					borderRadius: "8px 0px 0px 8px" }} />}
				<Box sx={{ ml: 1, display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
					<Typography variant="h6">{player.gamertag}</Typography>
				</Box>
				<Box sx={{ flexGrow: 1 }} />
				{isSpree && value >=5 && <HighestSpreeMedal maxSpree={value} />}
                <Typography variant="h5" sx={{ textAlign: "right", ml: 2, mr: 2 }}>{(Math.round(value * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
			</Button>
		</Box>
	);
}

function HighestSpreeMedal(props: { maxSpree: number })
{
	const { maxSpree } = props;

	return <img alt="Highest Spree Medal" height="32px" src={
		maxSpree >= 40 
			? "https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/demon.png" :
		maxSpree >= 35
			? "https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/grim-reaper.png" :
		maxSpree >= 30
			? "https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/boogeyman.png" :
		maxSpree >= 25
			? "https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/nightmare.png" :
		maxSpree >= 20
			? "https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/rampage.png" :
		maxSpree >= 15
			? "https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/running-riot.png" :
		maxSpree >= 10
			? "https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/killing-frenzy.png" :
		maxSpree >= 5
			? "https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/small/killing-spree.png" : ""
	} />
}