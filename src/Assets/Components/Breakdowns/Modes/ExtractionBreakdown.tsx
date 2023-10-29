import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "../BreakdownTile";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";

export function ExtractionBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Successful Extractions" value={serviceRecord.extraction.successful_extractions} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Initiations Completed" value={showPerMatch ? serviceRecord.extraction.extraction_initiations_completed / serviceRecord.matchesPlayed : serviceRecord.extraction.extraction_initiations_completed} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Initiations Denied" value={showPerMatch ? serviceRecord.extraction.extraction_initiations_denied / serviceRecord.matchesPlayed : serviceRecord.extraction.extraction_initiations_denied} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Conversions Completed" value={showPerMatch ? serviceRecord.extraction.extraction_conversions_completed / serviceRecord.matchesPlayed : serviceRecord.extraction.extraction_conversions_completed} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Conversions Denied" value={showPerMatch ? serviceRecord.extraction.extraction_conversions_denied / serviceRecord.matchesPlayed : serviceRecord.extraction.extraction_conversions_denied} small isMainStat backgroundColor={ArrowheadTheme.box} />
			</Box>
		</>
	);
}