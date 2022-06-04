import { Box, Typography } from "@mui/material";
import { SpartanCompany } from "../../../Objects/Model/SpartanCompany";

interface CompanyCardProps
{
	company: SpartanCompany;
    noImages?: boolean;
}

export function CompanyCard(props: CompanyCardProps)
{
	const { company, noImages } = props;

	return (
        <Box className="companyCard" sx={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: noImages ? "center" : "flex-start", width: "100%" }}>
            {!noImages && company.emblem ? <img src={company.emblem} alt="emblem" height="48px" /> : undefined}
            <Box sx={{ display: "flex", flexDirection: "column", ml: noImages ? 0 : 1, flexGrow: 1, textAlign: noImages ? "center" : "left" }}>
                <Typography variant="body1">{company.name} Company</Typography>
                <Typography variant="body2" sx={{ fontWeight: 100 }}>{company.players.length} members</Typography>
            </Box>
        </Box>
	);
}