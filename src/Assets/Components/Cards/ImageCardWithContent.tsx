import { Card, CardContent, CardMedia } from "@mui/material";

interface TitleCardProps
{
	image?: string;
	children?: JSX.Element | JSX.Element[];
	autoHeight?: boolean;
	maxWidth?: boolean;
}

export function ImageCardWithContent(props: TitleCardProps)
{
	const { image, children, autoHeight, maxWidth } = props;

	return (
		<Card sx={{ height: "100%", borderRadius: 3, width: maxWidth ? "100%" : "auto" }}>
			{image && <CardMedia sx={{ objectFit: "contain" }} component="img" image={image} alt="card media" height={autoHeight ? "auto" : "250px"} />}
			<CardContent>
				{children}
			</CardContent>
		</Card>
	);
}