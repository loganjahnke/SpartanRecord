import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import ArrowheadImg from "../Images/arrowhead.png";

interface HeaderProps
{
    /** The title of the header */
    title: string;
    /** Spartan rank (optional) */
    spartanRank?: string;
    /** Subtitle */
    subtitle?: string;
    /** Callback for the arrowhead icon button */
    onArrowheadButtonClick?: Function;
    /** The image to display in the header on the left, by default it is the arrowhead icon */
    leftImage?: string;
    /** The image to display in the header on the right, by default there is no image */
    backdrop?: string;
}

export function Header(props: HeaderProps)
{
    const { title, spartanRank, subtitle, onArrowheadButtonClick, leftImage, backdrop } = props;

    return (
        <AppBar position="fixed" color="secondary">
            <Toolbar>
                <IconButton onClick={() => onArrowheadButtonClick && onArrowheadButtonClick()} sx={{ mr: 2 }}>
                    <img className={leftImage ? "" : "arrowheadIcon"} src={leftImage ?? ArrowheadImg} alt="" height={64} width={64} />
                </IconButton>
                <Typography variant="h5" color="inherit" component="div" sx={{ fontWeight: 300, mr: 1.5 }}>{spartanRank}</Typography>
                <Typography variant="h5" color="inherit" component="div" sx={{ flexGrow: 1 }}>{title}</Typography>
                <Typography variant="h6" color="inherit" component="div" sx={{ float: "right", mr: 2 }}>{subtitle}</Typography>
                {backdrop ? <img className={backdrop ? "" : "arrowheadIcon"} src={backdrop} alt="" height={64} /> : undefined}
            </Toolbar>
        </AppBar>
    );
}