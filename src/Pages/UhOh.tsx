import { Box, Divider, Toolbar, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { Grow } from "../Assets/Components/Common/Grow";

export function UhOh()
{
    return <Box component="main" sx={{ flexGrow: 1, height: {xs: "calc(100% - 24px)", md: "calc(100% - 32px)"}}}>
        <Helmet>
            <title>{`Spartan Record | Page Not Found`}</title>
            <meta name="description" content={`Halo Infinite statistics such as KDA, KDR, and more`} />
            <meta property="og:title" content="Spartan Record" />
            <meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
            <link rel="canonical" href={`https://spartanrecord.com/`} />
        </Helmet>
        <Toolbar />
        <Divider />
        <Box sx={{ 
            height: "100%", 
            backgroundPosition: "center", 
            overflow: "hidden",
            backgroundSize: "cover", 
            backgroundImage: `url(https://blobs-infiniteugc.svc.halowaypoint.com/ugcstorage/playlist/73b48e1e-05c4-4004-927d-965549b28396/17b616fb-f128-46c9-b966-7850b38445f9/images/hero.png)`
        }}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "rgba(1,64,82, 0.8)", textAlign: "center", overflow: "auto" }}>
                <Grow />
                <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", pl: 4, pr: 4 }}>
                    <Typography variant="h3">Wake up John</Typography>
                    <Typography variant="h6">This page doesn't exist</Typography>
                </Box>
                <Grow />
            </Box>
        </Box>
    </Box>
}