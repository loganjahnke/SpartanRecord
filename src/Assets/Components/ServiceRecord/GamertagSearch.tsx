import { Box, Typography, TextField, Button } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";
import { PlayerChip } from "../PlayerAppearance/PlayerChip";
import { ServiceRecordIcon } from "../../Icons/CustomIcons";
import { CalendarMonth } from "@mui/icons-material";

export interface SearchProps
{
    recentPlayers: Player[];
    search: string;
    onValueChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onSearch: React.MouseEventHandler<HTMLButtonElement>;
    onYearInReviewClick?: React.MouseEventHandler<HTMLButtonElement>;
    openRecent?: (gamertag: string) => void;
    openRecentSecondaryAction?: (gamertag: string) => void;
    error?: string;
    showSearchButton?: boolean;
    favoritePlayers: Player[];
}

export function GamertagSearch(props: SearchProps)
{
    const { recentPlayers, search, favoritePlayers, onValueChanged, onKeyPress, onSearch, openRecent, onYearInReviewClick, openRecentSecondaryAction } = props;
    
    return (
        <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", pl: 4, pr: 4 }}>
            <Typography variant="h3">Halo Infinite Service Record</Typography>
            <Typography variant="h6">Search for a gamertag to see Halo Infinite statistics such as KDA, KDR, and more</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
                <TextField label="Gamertag" variant="outlined" size="small" value={search} onChange={onValueChanged} onKeyPress={onKeyPress} />
                <Button variant="contained" sx={{ ml: 2 }} onClick={onSearch} startIcon={<ServiceRecordIcon />}>Search</Button>
                {onYearInReviewClick && <Button variant="contained" sx={{ ml: 2 }} onClick={onYearInReviewClick} startIcon={<CalendarMonth />}>Year in Review</Button>}
            </Box>
            {favoritePlayers.length > 0 &&
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: "white" }}>Favorites: </Typography>
                    {favoritePlayers.map(player => <PlayerChip player={player} onClick={openRecent} onSecondaryClick={openRecentSecondaryAction} />)}
                </Box>
            }
            {favoritePlayers.length === 0 && recentPlayers.length > 0 &&
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: "white" }}>Recents: </Typography>
                    {recentPlayers.map(player => <PlayerChip player={player} onClick={openRecent} onSecondaryClick={openRecentSecondaryAction} />)}
                </Box>
            }
        </Box>
    )
}