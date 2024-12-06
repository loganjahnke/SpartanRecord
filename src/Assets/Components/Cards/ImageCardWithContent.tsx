import { Card, CardContent, CardMedia } from "@mui/material";

interface TitleCardProps
{
	image?: string;
	children?: JSX.Element | JSX.Element[];
	autoHeight?: boolean;
}

export function ImageCardWithContent(props: TitleCardProps)
{
	const { image, children, autoHeight } = props;

	return (
		<Card sx={{ height: "100%", borderRadius: 3 }}>
			{image && <CardMedia sx={{ objectFit: "contain" }} component="img" image={image} alt="card media" height={autoHeight ? "auto" : "250px"} />}
			<CardContent>
				{children}
			</CardContent>
		</Card>
	);
}