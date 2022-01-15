import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { ArrowheadUser } from "../../Objects/Model/ArrowheadUser";

import GroupsIcon from '@mui/icons-material/Groups';
import TimelineIcon from '@mui/icons-material/Timeline';
import MapIcon from '@mui/icons-material/Map';

export function CreateAccountBenefits(props: { loggedInUser: ArrowheadUser })
{
    const { loggedInUser } = props;

    return (
        <Box sx={{ p: 2, pl: 8, pt: 8, backgroundColor: "secondary.main", pb: 8 }}>
            {loggedInUser?.user ? <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>Welcome <span className="skinny">{loggedInUser?.user.displayName}</span></Typography>
            : <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>Get extra features <span className="skinny">by creating an account</span></Typography>}
            <List>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar><TimelineIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Track your service record over time." />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar><MapIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Filter your service record by map, mode, match outcome, and ranked." />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar><GroupsIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Join or create a Spartan Company and compare your stats." />
                </ListItem>
            </List>
        </Box>
    );
}