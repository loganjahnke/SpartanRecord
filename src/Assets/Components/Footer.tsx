import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import "../Styles/Footer.css";

interface FooterProps
{
    /** The last time the HaloDotAPI was queried in string form */
    lastUpdate: string;
}

export function Footer(props: FooterProps)
{
    const { lastUpdate } = props;

    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (<Tooltip {...props} classes={{ popper: className }} />))(({ theme }) => ({
		[`& .${tooltipClasses.arrow}`]: {
			color: theme.palette.common.black,
		},
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: theme.palette.common.black,
			color: "white",
			maxWidth: 220,
			fontSize: theme.typography.pxToRem(12)
		},
	}));

    return (
        <AppBar position="fixed" color="secondary" sx={{ top: "auto", bottom: 0, height: "30px" }}>
            <Toolbar>
                <Typography variant="subtitle1" color="inherit" component="div" sx={{ flexGrow: 1, fontSize: "8px", marginTop: "-30px" }}>Last Update: {lastUpdate}</Typography>
                <HtmlTooltip disableFocusListener arrow placement="top" enterTouchDelay={0} title={
                    <div className="versionTooltipDiv">
                        <h2>January 1, 2022</h2>
                        <ul>
                            <li>Switch to daily processing hosted by server</li>
                            <li>Added artificial Spartan Rank using Halo 5's ranking system</li>
                        </ul>
                        <h2>December 31, 2021</h2>
                        <ul>
                            <li>Added loading screen</li>
                            <li>Added emblem, backdrop, and service tag</li>
                            <li>Added last update timestamp</li>
                            <li>Added revision history</li>
                            <li>Made the Per Match switch into a toggle button rather than a single button</li>
                            <li>Improved performance by storing things locally rather than always grabbing from Firebase</li>
                        </ul>
                        <h2>December 19, 2021</h2>
                        <ul>
                            <li>Compare service records with the rest of Arrowhead</li>
                            <li>Drilldown into service records</li>
                            <li>Compare with others in drilldown view</li>
                            <li>View your stats per match or overall service record</li>
                        </ul>
                    </div>
                }>
                    <Typography variant="subtitle1" color="inherit" component="div" sx={{ float: "right", fontSize: "8px", marginTop: "-30px" }}>Version {process.env.REACT_APP_VERSION}</Typography>
                </HtmlTooltip>
            </Toolbar>
        </AppBar>
    );
}