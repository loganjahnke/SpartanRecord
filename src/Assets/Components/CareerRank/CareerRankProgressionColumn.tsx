import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { CareerRankProgressionColumnTile } from "./CareerRankProgressionColumnTile";
import { CareerRankProgressionExpansionProps } from "./CareerRankProps";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function CareerRankProgressionColumn(props: CareerRankProgressionExpansionProps)
{
	const { allRanks, type, current, avgScore, expanded, setExpanded } = props;

	return (
		<Accordion expanded={expanded} onClick={() => setExpanded(expanded ? "" : type)} className="progressionRow" sx={{ background: "transparent" }}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Box className="progressionRowTitleContainer">
					<Typography variant="h3" className="progressionRowTitle" sx={{
						fontSize: { lg: "24px !important", xl: "32px !important" },
						mb: { lg: "0px !important", xl: "-25px !important" },
						backgroundImage: 
							type === "Bronze" 
								? "-webkit-linear-gradient(0deg, #a16447 0%, #a16447 40%, #633522 100%)" :
							type === "Silver" 
								? "-webkit-linear-gradient(0deg, #d3d3d3 0%, #d3d3d3 40%, #a6a6a6 100%)" :
							type === "Gold" 
								? "-webkit-linear-gradient(0deg, #b9aa57 0%, #b9aa57 40%, #583e1b 100%)" :
							type === "Platinum" 
								? "-webkit-linear-gradient(0deg, #8e93cc 0%, #8e93cc 40%, #c1d0d0 100%)" :
							type === "Diamond" 
								? "-webkit-linear-gradient(0deg, #88c6f9 0%, #88c6f9 40%, #58beed 100%)" :
							type === "Onyx" 
								? "-webkit-linear-gradient(0deg, #bb8c41 0%, #bb8c41 40%, #8c6e34 100%)"
							/* Unranked */ 
								: "-webkit-linear-gradient(0deg, #FFFFFF 0%, #ffffda 40%, #EFEFEF 100%)" 
					}}>
						{type}
					</Typography>
				</Box>
			</AccordionSummary>
			<AccordionDetails>
				{allRanks
					.filter(rank => rank.properties.type === type)
					.filter(rank => rank.attributes.grade === 1)
					.map(rank => <CareerRankProgressionColumnTile rank={rank} current={current} avgScore={avgScore} />)
				}
			</AccordionDetails>
		</Accordion>
	);
}