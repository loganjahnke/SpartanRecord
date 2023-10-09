import { Box, Typography } from "@mui/material";
import { Grow } from "../Common/Grow";
import { CompareBar } from "./CompareBar";
import { CareerRankSchema, EmptyCareerRank } from "../../../Database/Schemas/CareerRankSchema";
import { CareerRankBackground, CareerRankTitle } from "../../../Objects/Helpers/AllCareerRanks";
import { CompareProps } from "./Compare";

interface CompareCareerRankProps
{
	category?: string;
	value1?: CareerRankSchema;
	value2?: CareerRankSchema;
	display1?: string;
	display2?: string;
	lessIsBetter?: boolean;
	isPercent?: boolean;
	background?: string;
	value1back?: string;
	value2back?: string;
}

export function CompareCareerRank(props: CompareCareerRankProps)
{
	const { category, value1 = EmptyCareerRank(), value2 = EmptyCareerRank(), display1, display2, isPercent } = props;

	const regularCareerRankProps = {...props as CompareProps};
	regularCareerRankProps.value1 = value1.data.level.total_xp;
	regularCareerRankProps.value2 = value2.data.level.total_xp;
	regularCareerRankProps.background = regularCareerRankProps.value1 > regularCareerRankProps.value2 ? CareerRankBackground(value1) : CareerRankBackground(value2);

	return (
		<Box sx={{ p: 2 }}>
			<Box sx={{ width: "100%", display: "flex" }}>
				<Grow />
				<Typography variant="body2">{category}</Typography>
				<Grow />
			</Box>
			<Box sx={{ width: "100%", display: "flex" }}>
				<Typography variant="h5" sx={{ textAlign: "right", width: "calc(50% - 16px)", pr: 2 }}>{CareerRankTitle(value1)}</Typography>
				<Typography variant="h5" sx={{ textAlign: "left", width: "calc(50% - 16px)", pl: 2 }}>{CareerRankTitle(value2)}</Typography>
			</Box>
			<CompareBar {...regularCareerRankProps} />
		</Box>
	);
}