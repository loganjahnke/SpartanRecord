import { Box, TextField, Button, Typography } from "@mui/material";
import { SearchProps } from "../Subpage/GamertagSearch";

export function AddGamertag(props: SearchProps)
{
	const { search, onValueChanged, onKeyPress, onSearch } = props;
	
	return (
		<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column", textAlign: "left", alignItems: "flex-start", p: 4 }}>
			<Typography variant="h3">You don't have a spartan company yet!</Typography>
			<Typography variant="h6">Get started by adding a gamertag</Typography>
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
				<TextField label="Gamertag" variant="outlined" size="small" value={search} onChange={onValueChanged} onKeyPress={onKeyPress} />
				<Button variant="contained" sx={{ ml: 2 }} onClick={onSearch}>Search</Button>
			</Box>
		</Box>
	);
}