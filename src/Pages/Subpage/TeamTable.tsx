import { TableContainer, Box, Table, TableHead, TableCell, TableRow, TableBody } from "@mui/material";
import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";
import { Arrowhead } from "../../Database/Arrowhead";
import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { Team } from "../../Objects/Pieces/Team";

interface TeamTableProps
{
    team: Team;
    best: { score: number, points: number, kills: number, deaths: number, assists: number };
}

export function TeamTable(props: TeamTableProps)
{
    const { team, best } = props;

    return (
        <TableContainer component={Box} sx={{ backgroundColor: "secondary.main", borderRadius: 3, mt: 2 }}>
            <Table>
                <TableHead sx={{ backgroundColor: team.details.name === "Cobra" ? ArrowheadTheme.cobra : ArrowheadTheme.eagle }}>
                    <TableRow>
                        <TableCell sx={{ pl: 2, pr: 2, position: "sticky", left: 0, backgroundColor: team.details.name === "Cobra" ? ArrowheadTheme.cobra : ArrowheadTheme.eagle }}>Gamertag</TableCell>
                        <TableCell sx={{ pl: 2, pr: 2 }} align="right">Total Score</TableCell>
                        {team.statistics.totalPoints !== team.statistics.summary.kills ? <TableCell sx={{ pl: 2, pr: 2 }} align="right">Points</TableCell> : undefined}
                        <TableCell sx={{ pl: 2, pr: 2 }} align="right">Kills</TableCell>
                        <TableCell sx={{ pl: 2, pr: 2 }} align="right">Deaths</TableCell>
                        <TableCell sx={{ pl: 2, pr: 2 }} align="right">Assists</TableCell>
                        <TableCell sx={{ pl: 2, pr: 2 }} align="right">KDA</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {team.players.sort((a, b) => b.stats.totalScore - a.stats.totalScore).map(player => (
                        <TableRow key={player.gamertag} sx={{ ".MuiTableCell-body": { color: player.outcome === HaloOutcome.Left ? ArrowheadTheme.leftEarlyText : ArrowheadTheme.text_primary } }}>
                            <TableCell sx={{ pl: 2, pr: 2, position: "sticky", left: 0, backgroundColor: "secondary.main" }} component="th" scope="row">{player.gamertag}</TableCell>
                            <TableCell sx={{ pl: 2, pr: 2, color: player.stats.totalScore === best?.score ? ArrowheadTheme.good + " !important" : "" }} align="right">{player.stats.totalScore}</TableCell>
                            {team.statistics.totalPoints !== team.statistics.summary.kills ? <TableCell sx={{ pl: 2, pr: 2, color: player.stats.totalPoints === best?.points ? ArrowheadTheme.good + " !important" : "" }} align="right">{player.stats.totalPoints}</TableCell> : undefined}
                            <TableCell sx={{ pl: 2, pr: 2, color: player.stats.summary.kills === best?.kills ? ArrowheadTheme.good + " !important" : "" }} align="right">{player.stats.summary.kills}</TableCell>
                            <TableCell sx={{ pl: 2, pr: 2, color: player.stats.summary.deaths === best?.deaths ? ArrowheadTheme.good + " !important" : "" }} align="right">{player.stats.summary.deaths}</TableCell>
                            <TableCell sx={{ pl: 2, pr: 2, color: player.stats.summary.assists === best?.assists ? ArrowheadTheme.good + " !important" : "" }} align="right">{player.stats.summary.assists}</TableCell>
                            <TableCell sx={{ pl: 2, pr: 2 }} align="right">{player.stats.kda}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}