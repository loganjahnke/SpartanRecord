import { useState } from "react";
import { Box, Grid } from "@mui/material";
import { CareerRankSchema } from "../../../Database/Schemas/CareerRankSchema";
import { GetCareerRankMetadata } from "../../../Objects/Helpers/AllCareerRanks";
import { CareerRankMetadata } from "../../../Database/Schemas/AutocodeMetadata";

import "../../Styles/Components/CareerRankProgression.css";
import { CareerRankBreakdown } from "./CareerRankBreakdown";
import { CareerRankProgressionRow } from "./CareerRankProgressionRow";
import { CareerRankProgressionColumn } from "./CareerRankProgressionColumn";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";

export function CareerRankProgression(props: { current: CareerRankSchema, serviceRecord: ServiceRecord })
{
	const { current, serviceRecord } = props;

	const [expandedType, setExpandedType] = useState(current?.data?.current?.properties?.type ?? "");

	const previous = GetCareerRankMetadata(current.data.current.rank - 1);

	if (!previous) { return <></>; }
	if (!current.data.level) { return <></>; }

	const levelAmount = (current.data.current.properties.threshold - previous.properties.threshold);
	const progress = (levelAmount - current.data.level.remaining_xp_to_next_level) * 100 / levelAmount;
	const color = current.data.current.properties.type;

	// Get all ranks into an array
	const allRanks: CareerRankMetadata[] = [];
	for (let i = 2; i <= 272; i++)
	{
		allRanks.push(GetCareerRankMetadata(i));
	}

	// Get average score
	const avgScore = serviceRecord.totalScore / serviceRecord.matchesPlayed;

	const currentDesc = current.data.current.title + current.data.current.subtitle;

	return (
		<Box>
			<Grid container className="currentProgressionGrid">
				<Grid item xs={0} sm={1} md={2} lg={3} xl={4} />
				<Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
					<CareerRankBreakdown careerRank={current} />
				</Grid>
				<Grid item xs={0} sm={1} md={2} lg={3} xl={4} />
			</Grid>
			<Box sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block", xl: "block" }}}>
				<CareerRankProgressionRow allRanks={allRanks} type="Bronze" currentDesc={currentDesc} />
				<CareerRankProgressionRow allRanks={allRanks} type="Silver" currentDesc={currentDesc} />
				<CareerRankProgressionRow allRanks={allRanks} type="Gold" currentDesc={currentDesc} />
				<CareerRankProgressionRow allRanks={allRanks} type="Platinum" currentDesc={currentDesc} />
				<CareerRankProgressionRow allRanks={allRanks} type="Diamond" currentDesc={currentDesc} />
				<CareerRankProgressionRow allRanks={allRanks} type="Onyx" currentDesc={currentDesc} />
				<Box sx={{ height: "20px" }} />
			</Box>
			<Box sx={{ display: { xs: "block", sm: "block", md: "block", lg: "none", xl: "none" }}}>
				<CareerRankProgressionColumn allRanks={allRanks} type="Bronze" expanded={expandedType === "Bronze"} current={current} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Silver" expanded={expandedType === "Silver"} current={current} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Gold" expanded={expandedType === "Gold"} current={current} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Platinum" expanded={expandedType === "Platinum"} current={current} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Diamond" expanded={expandedType === "Diamond"} current={current} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Onyx" expanded={expandedType === "Onyx"} current={current} avgScore={avgScore} setExpanded={setExpandedType} />
			</Box>
		</Box>
	);
}