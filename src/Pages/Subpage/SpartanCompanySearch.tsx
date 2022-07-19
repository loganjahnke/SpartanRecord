import { Box, Typography, TextField, Button } from "@mui/material";
import { SearchProps } from "../../Assets/Components/ServiceRecord/GamertagSearch";

export function SpartanCompanySearch(props: SearchProps)
{
	const { search, onValueChanged, onKeyPress, onSearch } = props;

	return (    
		<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
			<Typography variant="h3">Halo Infinite Spartan Company</Typography>
			<Typography variant="h6">Search for a spartan company to see Halo Infinite statistics for a group of spartans</Typography>
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
				<TextField label="Spartan Company" variant="outlined" size="small" value={search} onChange={onValueChanged} onKeyPress={onKeyPress} />
				<Button variant="contained" sx={{ ml: 2 }} onClick={onSearch}>Search</Button>
			</Box>
		</Box>
	);
}