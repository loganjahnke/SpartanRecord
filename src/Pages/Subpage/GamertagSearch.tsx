import { Box, Typography, TextField, Button, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { Cookie } from "../../Objects/Helpers/Cookie";
import { Player } from "../../Objects/Model/Player";

export interface SearchProps
{
    recentPlayers: Player[];
    search: string;
    onValueChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onSearch: React.MouseEventHandler<HTMLButtonElement>;
    openRecent?: (gamertag: string) => void;
    error?: string;
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
                    {recentPlayers.map(player => <Chip sx={{ margin: "4px 4px", p: 0.5, height: "36px" }} icon={<img  height="24px" src={player.appearance.emblemURL} />} onClick={openRecent ? () => openRecent(player.gamertag) : undefined} 
                        label={
                            <Box sx={{ textAlign: "left", mt: 0.5 }}>
                                <Typography variant="subtitle1" sx={{ lineHeight: 1 }}>{player.gamertag}</Typography>
                                <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>{player.appearance.serviceTag}</Typography>
                            </Box>
                        } />)}
                </Box>
            }
        </Box>
    )
}