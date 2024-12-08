import { Box, Button, Divider, Toolbar, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { Grow } from "../Assets/Components/Common/Grow";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";

interface UhOhProps
{
    ignoreHelmet?: boolean;
    primaryMessage?: string;
    secondaryMessage?: string;
    switchTab: (url?: string, tab?: SRTabs) => void;
}

export function UhOh(props: UhOhProps)
{
    const { ignoreHelmet, primaryMessage, secondaryMessage, switchTab } = props;

    return <Box component="main" className="pageContainer">
        {!ignoreHelmet &&
            <Helmet>
                <title>{`Spartan Record | Page Not Found`}</title>
                <meta name="description" content={`Halo Infinite statistics such as KDA, KDR, and more`} />
                <meta property="og:title" content="Spartan Record" />
                <meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
                <link rel="canonical" href={`https://spartanrecord.com/`} />
            </Helmet>
        }
        <Toolbar />
        <Divider />
        <Box className="underToolbarContainerNoPadding" sx={{ 
            height: "100%", 
            backgroundPosition: "center", 
            overflow: "hidden",
            backgroundSize: "cover", 
            backgroundImage: `url(https://blobs-infiniteugc.svc.halowaypoint.com/ugcstorage/playlist/73b48e1e-05c4-4004-927d-965549b28396/17b616fb-f128-46c9-b966-7850b38445f9/images/hero.png)`
        }}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "rgba(1,64,82, 0.8)", textAlign: "center", overflow: "auto" }}>
                <Grow />
                <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", pl: 4, pr: 4 }}>
                    <Typography variant="h3">{primaryMessage || "Wake up John"}</Typography>
                    <Typography variant="h6">{secondaryMessage || "This page doesn't exist"}</Typography>
                    <Button sx={{ mt: 4 }} onClick={() => switchTab("/", SRTabs.Search)} variant="contained">Back to Search</Button>
                </Box>
                <Grow />
            </Box>
        </Box>
    </Box>
}