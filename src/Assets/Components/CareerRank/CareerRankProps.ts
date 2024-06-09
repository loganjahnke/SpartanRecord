import { CareerRankMetadata } from "../../../Database/Schemas/AutocodeMetadata";
import { CareerRankSchema } from "../../../Database/Schemas/CareerRankSchema";

interface CareerRankProps
{
	current: CareerRankSchema;
	avgScore: number;
}

export interface CareerRankProgressionProps extends CareerRankProps
{
	allRanks: CareerRankMetadata[];
	type: string;
}

export interface CareerRankProgressionExpansionProps extends CareerRankProgressionProps
{
	expanded: boolean;
	setExpanded?: (type: string) => void;
}

export interface CareerRankTileProps extends CareerRankProps
{
	rank: CareerRankMetadata;
}