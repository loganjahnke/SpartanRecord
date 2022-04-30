import { Box, Typography, TextField, Button, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { Cookie } from "../../Objects/Helpers/Cookie";

export interface SearchProps
{
    search: string;
    onValueChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onSearch: React.MouseEventHandler<HTMLButtonElement>;
    openRecent: (gamertag: string) => void;
}

export function GamertagSearch(props: SearchProps)
{
    const { search, onValueChanged, onKeyPress, onSearch, openRecent } = props;

    const recents = Cookie.getRecents();
    
    return (
        <Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column", textAlign: "left", alignItems: "flex-start", pt: 4, pl: 4 }}>
            <Typography variant="h3">Halo Infinite Service Record</Typography>
            <Typography variant="h6">Search for a gamertag to see Halo Infinite statistics such as KDA, KDR, and more</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
                <TextField label="Gamertag" variant="outlined" size="small" value={search} onChange={onValueChanged} onKeyPress={onKeyPress} />
                <Button variant="contained" sx={{ ml: 2 }} onClick={onSearch}>Search</Button>
            </Box>
            {recents.length === 0 ? undefined :
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: "white" }}>Recents: </Typography>
                    {recents.map(gamertag => <Chip sx={{ margin: "4px 4px" }} label={gamertag} onClick={() => openRecent(gamertag)} />)}
                </Box>
            }
        </Box>
    )
}