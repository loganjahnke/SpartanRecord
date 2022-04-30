import { Box } from "@mui/material";
import { HaloOutcome } from "../../../Database/ArrowheadFirebase";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";
import { Team } from "../../../Objects/Pieces/Team";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
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
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row", width: "95%", mb: 1,
                    ".MuiBox-root:first-child": { borderRadius: "8px 0 0 8px", mr: "1px" }, 
                    ".MuiBox-root:last-child": { borderRadius: "0 8px 8px 0", ml: "1px" },
                    ".MuiBox-root:not(:first-child):not(:last-child)": { ml: "1px", mr: "1px" }}}>
                        {filtered.length > 0 ? filtered.map(player => <BreakdownTile title={player.gamertag} value={player.stats.summary.kills} total={total} />) : undefined}
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