import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Grid } from "@mui/material";
import { CareerRankSchema } from "../../../Database/Schemas/CareerRankSchema";
import { GetCareerRankMetadata, LifetimeRank } from "../../../Objects/Helpers/AllCareerRanks";
import { CareerRankMetadata } from "../../../Database/Schemas/AutocodeMetadata";
import { CareerRankBreakdown } from "./CareerRankBreakdown";
import { CareerRankProgressionRow } from "./CareerRankProgressionRow";
import { CareerRankProgressionColumn } from "./CareerRankProgressionColumn";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { ShowLifetimeToggle } from "./ShowLifetimeToggle";

import "../../Styles/Components/CareerRankProgression.css";

export function CareerRankProgression(props: { current: CareerRankSchema, serviceRecord: ServiceRecord })
{
	//#region Props
	const { current, serviceRecord } = props;
	//#endregion

	//#region State
	const [expandedType, setExpandedType] = useState(current?.data?.current?.properties?.type ?? "");
	const [rank, setRank] = useState(current);
	//#endregion

	//#region Refs
	const lifetimeShown = useRef(false);
	//#endregion

	//#region Callbacks
	/** Sets the appropriate career rank */
	const setShowLifetimeCallback = useCallback((show: boolean) =>
	{
		const rankToShow = show ? LifetimeRank(serviceRecord) : current;
		setRank(rankToShow);
		setExpandedType(rankToShow?.data?.current?.properties?.type ?? "");
	}, [current, serviceRecord, setRank, setExpandedType]);
	//#endregion

	//#region Effects
	// useEffect(() =>
	// {
	// 	setShowLifetimeCallback(lifetimeShown.current);
	// }, [current, serviceRecord]);
	//#endregion

	//#region Calculated Properties
	const previous = GetCareerRankMetadata((current?.data?.current?.rank ?? 1) - 1);

	if (!previous) { return <></>; }
	if (!current?.data?.level) { return <></>; }

	// Get all ranks into an array
	const allRanks: CareerRankMetadata[] = [];
	for (let i = 2; i <= 272; i++)
	{
		allRanks.push(GetCareerRankMetadata(i));
	}

	// Get average score
	const avgScore = serviceRecord.totalScore / serviceRecord.matchesPlayed;
	//#endregion

	return (
		<Box>
			<Grid container className="currentProgressionGrid">
				{/* Top */}
				<Grid item xs={12}>
					<Box sx={{ display: "flex", alignItems: "center", ml: 1, mb: 1 }}>
						<Box sx={{ flexGrow: 1 }}></Box>
						<ShowLifetimeToggle setShowLifetime={setShowLifetimeCallback} />
					</Box>
				</Grid>
				<Grid item xs={0} sm={1} md={2} lg={3} xl={4} />
				<Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
					<CareerRankBreakdown careerRank={rank} />
				</Grid>
				<Grid item xs={0} sm={1} md={2} lg={3} xl={4} />
			</Grid>
			<Box sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block", xl: "block" }}}>
				<CareerRankProgressionRow allRanks={allRanks} type="Bronze" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Silver" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Gold" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Platinum" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Diamond" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Onyx" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Hero" current={rank} avgScore={avgScore} />
				<Box sx={{ height: "20px" }} />
			</Box>
			<Box sx={{ display: { xs: "block", sm: "block", md: "block", lg: "none", xl: "none" }}}>
				<CareerRankProgressionColumn allRanks={allRanks} type="Bronze" expanded={expandedType === "Bronze"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Silver" expanded={expandedType === "Silver"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Gold" expanded={expandedType === "Gold"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Platinum" expanded={expandedType === "Platinum"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Diamond" expanded={expandedType === "Diamond"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Onyx" expanded={expandedType === "Onyx"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Hero" expanded={expandedType === "Hero"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
			</Box>
		</Box>
	);
}