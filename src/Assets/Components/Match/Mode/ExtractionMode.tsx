import { Box } from "@mui/material";
import { ExtractionSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { ModeLabelValue } from "./ModeLabelValue";
import { TimePlayed } from "../../../../Objects/Pieces/TimePlayed";

interface ExtractionModeProps
{
	mode: ExtractionSchema;
}

export function ExtractionMode(props: ExtractionModeProps)
{
	const { mode } = props;

	return <Box>
		<Box sx={{ display: "flex" }}>
			<Box sx={{ width: "50%", ml: 1 }}>
				<ModeLabelValue label="Initiations Completed" value={mode.extraction_initiations_completed} />
				<ModeLabelValue label="Initiations Denied" value={mode.extraction_initiations_denied} />
				<ModeLabelValue label="Extractions" value={mode.successful_extractions} />
			</Box>
			<Box sx={{ width: "50%", mr: 1 }}>
				<ModeLabelValue label="Conversions Completed" value={mode.extraction_conversions_completed} />
				<ModeLabelValue label="Conversions Denied" value={mode.extraction_conversions_denied} />
			</Box>
		</Box>
	</Box>;
}