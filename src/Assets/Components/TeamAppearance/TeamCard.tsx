import { Box, Typography } from "@mui/material";
import { GetColorForTeam, ShouldInvertTextColorForTeam } from "../../../Objects/Helpers/AllTeams";
import { Team } from "../../../Objects/Pieces/Team";

import '../../Styles/Components/TeamCard.css';

interface TeamCardProps
{
	team?: Team;
    noImages?: boolean;
    rightAlign?: boolean;
    showNameplate?: boolean;
    topDown?: boolean;
    noMargin?: boolean;
    loading?: boolean;
	winner?: boolean;
}

export function DynamicTeamCard(props: TeamCardProps)
{
    const { loading } = props;
    return <>
        <Box sx={{ display: { xs: "none", sm: "block" }, position: "relative" }}><TeamCard {...props} showNameplate={true} /></Box>
        {!loading && <Box sx={{ display: { sm: "none" }, position: "relative" }}><TeamCard {...props} showNameplate={false} /></Box>}
    </>;
}

export function TeamCard(props: TeamCardProps)
{
	const { team, noImages, rightAlign, showNameplate, topDown, noMargin, winner } = props;

	const teamColor = GetColorForTeam(team?.details.name ?? "");

    if (!team) { return <></>; }
	return showNameplate ? (
        <Box className="midflex teamCardWrapper" sx={{ justifyContent: rightAlign ? "flex-end" : "flex-start", mr: noMargin ? 0 : -1, position: "relative" }}>
            <Box className="midflex" sx={{ position: "relative" }}>
                {!noImages && teamColor && 
					<>
						<Box className={ winner ? "teamCard winner" : "teamCard"} sx={{ backgroundColor: teamColor }} />
						<Box className="teamCard teamCardBackground" />
					</>
				}
                <Box className="midflex teamEmblem" sx={{ ml: rightAlign ? "202px" : 1, filter: ShouldInvertTextColorForTeam(team?.details.name) ? "invert(0.7)" : "" }}>{!noImages && team.details.emblem && <img src={team.details.emblem} alt="emblem" height="44px" crossOrigin="anonymous" />}</Box>
                <Box className="teamName" sx={{ ml: rightAlign ? "0px" : "72px" }}>
                    <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "1.32rem !important", color: ShouldInvertTextColorForTeam(team?.details.name) ? "#000" : "#FFF", textAlign: rightAlign ? "right" : "left" }}>{team.details.name}</Typography>
                </Box>
				{winner && <Box className="winnerSVG" sx={{ ml: rightAlign ? 1 : "224px" }} />}
            </Box>
        </Box>
    )
    : !topDown ? (
        <Box className="midflex teamCardWrapper" sx={{ textAlign: rightAlign ? "right" : noImages ? "center" : "left", position: "relative" }}>
            {!rightAlign && !noImages && team.details.emblem && <img src={team.details.emblem} alt="emblem" height="48px" crossOrigin="anonymous" />}
            <Box sx={{ display: "flex", flexDirection: "column", mr: rightAlign && !noImages ? 1 : 0, ml: rightAlign || noImages ? 0 : 1, flexGrow: 1 }}>
				<Typography variant="body1">{team.details.name}</Typography>
            </Box>
            {rightAlign && !noImages && team.details.emblem && <img src={team.details.emblem} alt="emblem" height="48px" crossOrigin="anonymous" />}
        </Box>
    ) : (
		<Box className={`midflex teamCardWrapper topdown ${winner ? "topdownWinner" : ""}`} sx={{ textAlign: rightAlign ? "right" : noImages ? "center" : "left", position: "relative" }}>
			{winner && <Box className="topdownWinnerSVG" sx={{ WebkitMask: `url(${team.details.emblem}) center/contain` }} />}
			{!noImages && team.details.emblem && <img src={team.details.emblem} alt="emblem" height="48px" crossOrigin="anonymous" />}
            <Box sx={{ mt: 1 }} />
            <Typography className="teamNameLabel" variant="body1">{team.details.name}</Typography>
        </Box>
    );
}