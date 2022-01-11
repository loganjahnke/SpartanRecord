import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface ImageCardProps
{
	image?: string;
    title: string;
}

export function ImageCard(props: ImageCardProps)
{
	const { image, title } = props;

	return (
        <Card>
            {image ? <CardMedia component="img" height="200" image={image} alt={title} /> : undefined}
            <CardContent>
                <Typography variant="h5" component="div" sx={{ textAlign: "center", pt: 1 }}>{title}</Typography>
            </CardContent>
        </Card>
	);
}