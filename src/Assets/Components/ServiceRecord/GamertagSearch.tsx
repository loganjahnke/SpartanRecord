import { Box, Typography, TextField, Button } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";
import { PlayerChip } from "../PlayerAppearance/PlayerChip";

export interface SearchProps
{
    recentPlayers: Player[];
    search: string;
    onValueChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onSearch: React.MouseEventHandler<HTMLButtonElement>;
    openRecent?: (gamertag: string) => void;
    error?: string;
    showSearchButton?: boolean;
}

export function GamertagSearch(props: SearchProps)
{
    const { recentPlayers, search, onValueChanged, onKeyPress, onSearch, openRecent } = props;
    
    return (
        <Box sx={{ backgroundColor: "secondary.main", display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", pl: 4, pr: 4 }}>
            <Typography variant="h3">Halo Infinite Service Record</Typography>
            <Typography variant="h6">Search for a gamertag to see Halo Infinite statistics such as KDA, KDR, and more</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
                <TextField label="Gamertag" variant="outlined" size="small" value={search} onChange={onValueChanged} onKeyPress={onKeyPress} />
                <Button variant="contained" sx={{ ml: 2 }} onClick={onSearch}>Search</Button>
            </Box>
            {recentPlayers.length > 0 &&
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: "white" }}>Recents: </Typography>
                    {recentPlayers.map(player => <PlayerChip player={player} onClick={openRecent} />)}
                </Box>
            }
        </Box>
    )
}