import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

interface ImageCardProps
{
	image?: string;
    title?: string;
    header?: string;
    titles?: string[];
    headers?: string[];
}

export function ImageCard(props: ImageCardProps)
{
	const { image, title, header, titles, headers } = props;

    interface HeaderTitle
    {
        title: string;
        header?: string;
    }

    const allHeaderTitles: HeaderTitle[] = title ? [{ title: title, header: header }] : [];

    if (titles)
    {
        for (let i = 0; i < titles.length; i++)
        {
            allHeaderTitles.push({ 
                title: titles[i], 
                header: headers && headers.length > i ? headers[i] : undefined 
            });
        }
    }

	return (
        <Card sx={{ height: "100%", borderRadius: 3 }}>
            {image ? <CardMedia component="img" height="225px" image={image} alt="card media" /> : undefined}
            <CardContent sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}>
                {allHeaderTitles.map(ht => (
                    <Box sx={{ m: 2 }}>
                        {ht.header ? <Typography variant="caption" component="div" sx={{ textAlign: "center" }}>{ht.header}</Typography> : undefined}
                        <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>{ht.title}</Typography>
                    </Box>
                ))}
            </CardContent>
        </Card>
	);
}