import { Box } from "@mui/material";
import { HaloOutcome } from "../../../Database/ArrowheadFirebase";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";
import { Team } from "../../../Objects/Pieces/Team";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { TeamBreakdownChart } from "../Charts/TeamBreakdownChart";
import { BreakdownTile } from "./BreakdownTile";

interface TeamResultBreakdownProps
{
    team: Team;
}

export function TeamResultBreakdown(props: TeamResultBreakdownProps)
{
	const { team } = props;

    const serviceRecord = team.statistics;
    const image = team.details.emblem;
    const background = team.details.name === "Cobra" ? ArrowheadTheme.cobra : ArrowheadTheme.eagle;

    const total = serviceRecord.summary.kills;
    const filtered = team.players.filter(player => player.outcome !== HaloOutcome.Left);

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  {image ? 
                        <Box sx={{ mt: 2, 
                            background: `url(${image}) ${background}`, 
                            backgroundBlendMode: "soft-light",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            color: "primary.main", 
                            borderRadius: 3, 
                            p: 2, 
                            height: "64px", 
                            width: "64px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            letterSpacing: "8px",
                            textIndent: "8px",
                            fontWeight: 900 }}>
                                {team.details.name.toUpperCase()}
                        </Box> 
                  : undefined}
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                        <BreakdownTile title="Points" value={serviceRecord.totalPoints} isMainStat />
                        <BreakdownTile title="Kills" value={serviceRecord.summary.kills} isMainStat />
                        <BreakdownTile title="Deaths" value={serviceRecord.summary.deaths} isMainStat />
                        <BreakdownTile title="MMR" value={team.mmr} isMainStat />
                  </Box>
                  <Box sx={{ height: "300px", width: "calc(100% - 16px)", m: "0 8px" }}>
                    {filtered && filtered.length > 0 ? <TeamBreakdownChart players={filtered} blue={team.details.name === "Eagle"} /> : undefined}
                  </Box>
		</Box>
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