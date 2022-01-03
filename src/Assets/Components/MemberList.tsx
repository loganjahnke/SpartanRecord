import { Box, Typography } from "@mui/material";
import { Company } from "../../Objects/Model/Company";

import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import { Player } from "../../Objects/Model/Player";
import { Halo5Converter } from "../../Objects/Helpers/Halo5Converter";

import ArrowheadImg from "../Images/arrowhead.png";

export function MemberList(props: { company: Company })
{
    const { company } = props;

    return (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <ModeStandbyIcon sx={{ fontSize: "160px", padding: 2 }} />
            {company.players.map(player => <MemberComponent player={player} />)}
        </Box>
    );
}

function MemberComponent(props: { player: Player })
{
    const { player } = props;

    return (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 1 }}>
            <img src={player.appearance.emblemURL === "" ? ArrowheadImg : player.appearance.emblemURL} alt="emblem" height="48px" />
            <Typography variant="body1" sx={{ flexGrow: 1, ml: 1 }}>{player.gamertag}</Typography>
            <Typography variant="body1" sx={{ mr: 1, fontWeight: 100 }}>{Halo5Converter.GetLevelFromScore(player.serviceRecord.totalScore)}</Typography>
        </Box>
    );
}