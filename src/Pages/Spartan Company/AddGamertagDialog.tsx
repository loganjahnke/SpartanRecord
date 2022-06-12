import { LoadingButton } from "@mui/lab";
import { Box, TextField, Button, Typography, Chip, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";
import { Player } from "../../Objects/Model/Player";
import { SearchProps } from "../Subpage/GamertagSearch";

export function AddGamertag(props: SearchProps)
{
	const { search, onValueChanged, onKeyPress, onSearch } = props;
	
	return (
		<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column", textAlign: "left", alignItems: "flex-start", p: 4 }}>
			<Typography variant="h3">You don't have a spartan company yet!</Typography>
			<Typography variant="h6">Get started by adding a gamertag</Typography>
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
				<TextField label="Gamertag" variant="outlined" size="small" value={search} onChange={onValueChanged} onKeyPress={onKeyPress} />
				<Button variant="contained" sx={{ ml: 2 }} onClick={onSearch}>Search</Button>
			</Box>
		</Box>
	);
}

function AddGamertagInline(props: SearchProps & { loading?: boolean })
{
	const { search, onValueChanged, onKeyPress, openRecent, error, loading, recentPlayers } = props;
	
	return (
		<Box sx={{ backgroundColor: "transparent", height: "100%", display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", p: 1 }}>
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
				<TextField label="Gamertag" variant="outlined" size="small" value={search} onChange={onValueChanged} onKeyPress={onKeyPress} disabled={loading} error={!!error} />
			</Box>
			{recentPlayers.length === 0 ? undefined :
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: "white" }}>Recents: </Typography>
                    {recentPlayers.map(player => <Chip sx={{ margin: "4px 4px" }} icon={<img  height="24px" src={player.appearance.emblemURL} alt="Emblem" />} label={player.gamertag} onClick={openRecent ? () => openRecent(player.gamertag) : undefined} />)}
                </Box>
            }
			{!!error && <Typography variant="caption" sx={{ mt: 1, color: ArrowheadTheme.text_primary }}>{error}</Typography>}
		</Box>
	);
}

interface AddGamertagDialogProps
{
	open: boolean;
	loading: boolean;
	gamertag: string;
	error: string;
	cancel: () => void;
	accept: () => void;
	searchViaEnter: (event: React.KeyboardEvent<HTMLDivElement>) => void;
	search: React.MouseEventHandler<HTMLButtonElement>;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    addRecent?: (gamertag: string) => void;
	recentPlayers: Player[];
}

export function AddGamertagDialog(props: AddGamertagDialogProps)
{
	const { open, loading, gamertag, error, cancel, accept, search, searchViaEnter, onChange, addRecent, recentPlayers } = props;

	return (
		<Dialog open={!!open} onClose={cancel}>
			<DialogTitle sx={{ color: ArrowheadTheme.text_primary, backgroundColor: ArrowheadTheme.secondary }}>Add a Gamertag to your Spartan Company</DialogTitle>		
			<DialogContent sx={{ backgroundColor: ArrowheadTheme.box }}>
				<AddGamertagInline search={gamertag} onKeyPress={searchViaEnter} onSearch={search} onValueChanged={onChange} openRecent={addRecent} loading={loading} error={error} recentPlayers={recentPlayers} />
			</DialogContent>
			<DialogActions sx={{ backgroundColor: ArrowheadTheme.box }}>
				<Button onClick={cancel}>Cancel</Button>
				<LoadingButton loading={loading} onClick={() => accept()} autoFocus>Add</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}