import { Box, Typography, TextField, Button } from "@mui/material";

export interface SearchProps
{
    search: string;
    onValueChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onSearch: React.MouseEventHandler<HTMLButtonElement>;
}

export function GamertagSearch(props: SearchProps)
{
    const { search, onValueChanged, onKeyPress, onSearch } = props;
    
    return (
        <Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h3">Halo Infinite Service Record</Typography>
            <Typography variant="h6">Search for a gamertag to see Halo Infinite statistics such as KDA, KDR, and more</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
                <TextField label="Gamertag" variant="outlined" size="small" value={search} onChange={onValueChanged} onKeyPress={onKeyPress} />
                <Button variant="contained" sx={{ ml: 2 }} onClick={onSearch}>Search</Button>
            </Box>
        </Box>
    )
}