import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { CareerRankProgressionColumnTile } from "./CareerRankProgressionColumnTile";
import { CareerRankProgressionExpansionProps } from "./CareerRankProps";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CareerRankBackground } from "../../../Objects/Helpers/AllCareerRanks";

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
						backgroundImage: CareerRankBackground(current)
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