import { Box, Button, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { SpartanCompany, UID2Gamertag } from "../../../Objects/Model/SpartanCompany";

import { Player } from "../../../Objects/Model/Player";
import { Halo5Converter } from "../../../Objects/Helpers/Halo5Converter";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

import ArrowheadImg from "../../Images/arrowhead.png";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

export function SCMembersAdmin(props: { company: SpartanCompany, deleteExistingMember: Function })
{
	const { company, deleteExistingMember } = props;

	return (
		<Card sx={{ borderRadius: 3 }}>
            <CardMedia component="img" height="200" image={"https://assets.halo.autocode.gg/static/infinite/images/multiplayer/playlists/ffa-slayer.jpg"} alt="Members" />
            <CardContent sx={{ backgroundColor: "divider", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
				<Typography variant="h6" sx={{ mb: 1 }}>Company Members</Typography>
				{company.members.map(member => <SCMemberAdminComponent member={member} deleteMember={deleteExistingMember} />)}
            </CardContent>
        </Card>
	);
}

export function SCRequestedAdmin(props: { company: SpartanCompany, declineRequest: Function, acceptRequest: Function })
{
	const { company, declineRequest, acceptRequest } = props;

	return (
		<Card sx={{ borderRadius: 3 }}>
            <CardMedia component="img" height="200" image={"https://assets.halo.autocode.gg/static/infinite/images/multiplayer/playlists/team-slayer.jpg"} alt="Members" />
            <CardContent sx={{ backgroundColor: "divider", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
				<Typography variant="h6" sx={{ mb: 1 }}>Pending Requests</Typography>
				{company.requested.length === 0 ? <Typography variant="body1" sx={{ mt: 2 }}>No pending requests!</Typography>
                : company.requested.map(member => <SCMemberAdminComponent member={member} deleteMember={declineRequest} acceptMember={acceptRequest} />)}
            </CardContent>
        </Card>
	);
}

function SCMemberAdminComponent(props: { member: UID2Gamertag, deleteMember?: Function, acceptMember?: Function })
{
	const { member, deleteMember, acceptMember } = props;

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 1.5 }}>
            <Box sx={{ ml: 1, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="body1">{member.gamertag}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 100 }}>{member.IsGuest() ? "Guest" : "Logged in"}</Typography>
            </Box>
            { acceptMember ? <IconButton sx={{ color: ArrowheadTheme.text_primary }} onClick={() => acceptMember(member.gamertag)}><CheckIcon /></IconButton> : undefined }
            { deleteMember ? <IconButton sx={{ color: ArrowheadTheme.text_primary }} onClick={() => deleteMember(member.gamertag)}><ClearIcon /></IconButton> : undefined }
		</Box>
	);
}