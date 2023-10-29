import { CTFSchema, OddballSchema, ZoneSchema, EliminationSchema, StockpileSchema, ExtractionSchema, InfectionSchema, ZoneServiceRecordSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { CTFMode } from "./CTFMode";
import { OddballMode } from "./OddballMode";
import { ZoneMode } from "./ZoneMode";
import { ExtractionMode } from "./ExtractionMode";
import { InfectionMode } from "./InfectionMode";

interface MatchModeProps
{
	mode?: CTFSchema | OddballSchema | ZoneSchema | EliminationSchema | StockpileSchema | ExtractionSchema | InfectionSchema | ZoneServiceRecordSchema;
}

export function MatchMode(props: MatchModeProps)
{
	const { mode } = props;

	if (!mode) { return <></>; }

	if (mode.hasOwnProperty("flag_captures"))
	{
		return <CTFMode mode={mode as CTFSchema} />
	}

	if (mode.hasOwnProperty("kills_as_skull_carrier"))
	{
		return <OddballMode mode={mode as OddballSchema} />
	}

	if (mode.hasOwnProperty("stronghold_occupation_time"))
	{
		return <ZoneMode mode={mode as ZoneSchema} />
	}

	if (mode.hasOwnProperty("successful_extractions"))
	{
		return <ExtractionMode mode={mode as ExtractionSchema} />
	}

	if (mode.hasOwnProperty("infected_killed"))
	{
		return <InfectionMode mode={mode as InfectionSchema} />
	}

	return <></>;
}