import { Box, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { HaloOutcome } from "../../../Database/ArrowheadFirebase";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";
import { Team } from "../../../Objects/Pieces/Team";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { TeamBreakdownChart } from "../Charts/TeamBreakdownChart";
import { BreakdownRowTile } from "./BreakdownRowTile";

import SportsScoreIcon from '@mui/icons-material/SportsScore';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import StarsIcon from '@mui/icons-material/Stars';
import { GetColorForTeam } from "../../../Objects/Helpers/AllTeams";

interface TeamResultBreakdownProps
{
    team: Team;
}

export function TeamResultBreakdown(props: TeamResultBreakdownProps)
{
	const { team } = props;

    const serviceRecord = team.statistics;
    const image = team.details.emblem;
    const background = GetColorForTeam(team.details.name);

    const filtered = team.players.filter(player => player.outcome !== HaloOutcome.Left);

	return (
        <Card sx={{ height: "100%", borderRadius: 3 }}>
            {image ? <CardMedia sx={{ backgroundPosition: "center", backgroundColor: background, objectFit: "contain", pt: 1, pb: 1 }} component="img" height="100px" image={image}  alt="card media" /> : undefined}
            <CardContent sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap", backgroundColor: ArrowheadTheme.box }}>
                <Typography variant="h4">{team.details.name}</Typography>
                <Grid container spacing={8} sx={{ alignItems: "center" }}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                            <BreakdownRowTile title="Points" tooltip="Total points for the team" value={serviceRecord.totalPoints} icon={<SportsScoreIcon fontSize="large" />} isMainStat />
                            <BreakdownRowTile title="Kills" tooltip="Total kills for the team" value={serviceRecord.summary.kills} icon={<ModeStandbyIcon fontSize="large" />} isMainStat />
                            <BreakdownRowTile title="Deaths" tooltip="Total deaths for the team" value={serviceRecord.summary.deaths} icon={<PersonOffOutlinedIcon fontSize="large" />} isMainStat />
                            <BreakdownRowTile title="MMR" tooltip="Average hidden matchmaking rating" value={team.mmr} icon={<StarsIcon fontSize="large" />} isMainStat />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ height: "300px", width: "calc(100% - 16px)", m: "0 8px" }}>
                            {filtered && filtered.length > 0 ? <TeamBreakdownChart players={filtered} /> : undefined}
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
		// <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        //           {image ? 
        //                 <Box sx={{ mt: 2, 
        //                     background: `url(${image}) ${background}`, 
        //                     backgroundBlendMode: "soft-light",
        //                     backgroundRepeat: "no-repeat",
        //                     backgroundPosition: "center",
        //                     backgroundSize: "cover",
        //                     color: "primary.main", 
        //                     borderRadius: 3, 
        //                     p: 2, 
        //                     height: "64px", 
        //                     width: "64px",
        //                     display: "flex",
        //                     justifyContent: "center",
        //                     alignItems: "center",
        //                     textAlign: "center",
        //                     letterSpacing: "8px",
        //                     textIndent: "8px",
        //                     fontWeight: 900 }}>
        //                         {team.details.name.toUpperCase()}
        //                 </Box> 
        //           : undefined}
        //           <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
        //                 <BreakdownTile title="Points" value={serviceRecord.totalPoints} isMainStat />
        //                 <BreakdownTile title="Kills" value={serviceRecord.summary.kills} isMainStat />
        //                 <BreakdownTile title="Deaths" value={serviceRecord.summary.deaths} isMainStat />
        //                 <BreakdownTile title="MMR" value={team.mmr} isMainStat />
        //           </Box>
        //           <Box sx={{ height: "300px", width: "calc(100% - 16px)", m: "0 8px" }}>
        //             {filtered && filtered.length > 0 ? <TeamBreakdownChart players={filtered} blue={team.details.name === "Eagle"} /> : undefined}
        //           </Box>
		// </Box>
	);
}

export function FFAResultBreakdown(props: { winner: MatchPlayer })
{
	const { winner } = props;

    const team = new Team();
    team.details = winner.team;
    team.details.name = winner.gamertag;
    team.statistics = winner.stats;

    return <TeamResultBreakdown team={team} />
}