import { Grid, Paper, Tooltip, Typography } from '@mui/material';
import '../Assets/Styles/Tiles/Medal.css';
import { Medal } from '../Objects/Pieces/Medal';

interface MedalTileProps
{
    /** The medal image */
    medal: Medal;
}

const MedalTile = (props: MedalTileProps) =>
{
    const { medal } = props;

	//#region Content
	return (
        <Grid item xs={6} sm={4} md={2} lg={1}>
            <Paper sx={{ textAlign: "center" }}>
                <Tooltip disableFocusListener arrow title={medal.description}>
                    <div>
                        <img src={medal.images.small} alt={medal.name} width="48px" />
                        <Typography variant="subtitle2" color="inherit" component="div" sx={{ fontWeight: 300, fontSize: "10px" }}>{medal.name}</Typography>
                        <Typography variant="subtitle2" color="inherit" component="div" sx={{ fontWeight: 900, fontSize: "18px" }}>{medal.count}</Typography>
                    </div>
                </Tooltip>
            </Paper>
        </Grid>
	);
	//#endregion
}

export default MedalTile;