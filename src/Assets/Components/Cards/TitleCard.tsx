import { Box, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

interface TitleCardProps
{
	title?: string;
	stretch?: boolean;
	secondary?: boolean;
	children?: JSX.Element | JSX.Element[];
}

export function TitleCard(props: TitleCardProps)
{
	const { title, stretch, secondary, children } = props;

	return (
		<Box sx={{ backgroundColor: secondary ? ArrowheadTheme.secondary : "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: stretch ? "" : "center" }}>
			{title &&
				<Box sx={{ borderRadius: "12px 12px 0 0", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%", pt: 2, pb: 2, backgroundColor: !!children ? "secondary.main" : "transparent" }}>
					<Typography className="cardTitle" variant="h5">{title}</Typography>
				</Box>
			}
			{children}
		</Box>
	);
}