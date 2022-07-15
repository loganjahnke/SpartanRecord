import { Card, CardContent, CardMedia } from "@mui/material";

interface TitleCardProps
{
	image?: string;
	children?: JSX.Element | JSX.Element[];
}

export function ImageCardWithContent(props: TitleCardProps)
{
	const { image, children } = props;

	return (
		<Card sx={{ height: "100%", borderRadius: 3 }}>
			{image && <CardMedia sx={{ backgroundPosition: "center" }} component="img" image={image} alt="card media" height="250px" />}
			<CardContent>
				{children}
			</CardContent>
		</Card>
	);
}