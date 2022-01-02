import { useCallback, useEffect, useRef, useState } from 'react';
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { useNavigate } from "react-router-dom";
import { ArrowheadFirebase } from "../Database/ArrowheadFirebase";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Header } from '../Assets/Components/Header';
import { Footer } from '../Assets/Components/Footer';
import { Halo5Converter } from '../Objects/Helpers/Halo5Converter';

enum ArrowheadView
{
	ServiceRecord = "ServiceRecord",
	PerMatch = "PerMatch"
}

interface Data 
{
    gamertag: string;
	spartanRank: string;
    kills: number;
    deaths: number;
    assists: number;
    medals: number;
    kda: number;
    kdr: number;
    matches: number;
    wld: string;
    winRate: string;
    timePlayed: string;
}

function createData(serviceRecord: ServiceRecord): Data 
{
    return {
        gamertag: serviceRecord.gamertag,
		spartanRank: Halo5Converter.GetLevelFromScore(serviceRecord.totalScore),
        kills: serviceRecord.summary.kills,
        deaths: serviceRecord.summary.deaths,
        assists: serviceRecord.summary.assists,
        medals: serviceRecord.summary.medals,
        kda: (Math.round(serviceRecord.kda * 100) / 100),
        kdr: (Math.round(serviceRecord.kdr * 100) / 100),
        matches: serviceRecord.matchesPlayed,
        wld: serviceRecord.breakdowns.matches.wins + "-" + serviceRecord.breakdowns.matches.losses + "-" + serviceRecord.breakdowns.matches.draws,
        winRate: (Math.round(serviceRecord.winRate * 100) / 100).toLocaleString() + "%",
        timePlayed: serviceRecord.ReadableTime()
    };
}

/**
 * Gets the comparator for the specified orderBy
 * @param a generic object #1
 * @param b generic object #2
 * @param orderBy the ordering
 * @returns 1, -1, or 0
 */
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) 
{
	if (b[orderBy] < a[orderBy]) { return -1; }
  	if (b[orderBy] > a[orderBy]) { return 1; }
  	return 0;
}

/** The order by type */
type Order = 'asc' | 'desc';

/**
 * Get the comparator for the current order and orderBy
 * @param order current order
 * @param orderBy order by
 * @returns correct comparator
 */
function getComparator<Key extends keyof any>(order: Order, orderBy: Key): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number 
{
  	return order === 'desc'
    	? (a, b) => descendingComparator(a, b, orderBy)
    	: (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) 
{
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => 
	{
    	const order = comparator(a[0], b[0]);
    	if (order !== 0) { return order; }
    	return a[1] - b[1];
  	});
  	return stabilizedThis.map((el) => el[0]);
}

/** The head cell */
interface HeadCell 
{
  	disablePadding: boolean;
 	id: keyof Data;
  	label: string;
  	numeric: boolean;
}

const headCells: readonly HeadCell[] = 
[
	{
		id: "gamertag",
		numeric: false,
		disablePadding: true,
		label: "Gamertag",
	},
	{
		id: "spartanRank",
		numeric: false,
		disablePadding: true,
		label: "SR",
	},
	{
		id: "kills",
		numeric: true,
		disablePadding: false,
		label: "Kills",
	},
	{
		id: "deaths",
		numeric: true,
		disablePadding: false,
		label: "Deaths",
	},
	{
		id: "assists",
		numeric: true,
		disablePadding: false,
		label: "Assists",
	},
	{
		id: "kda",
		numeric: true,
		disablePadding: false,
		label: "KDA",
	},
	{
		id: "kdr",
		numeric: true,
		disablePadding: false,
		label: "K/D",
	},
	{
		id: "matches",
		numeric: true,
		disablePadding: false,
		label: "Total Matches",
	},
	{
		id: "wld",
		numeric: true,
		disablePadding: false,
		label: "Win-Loss-Tie",
	},
	{
		id: "winRate",
		numeric: true,
		disablePadding: false,
		label: "Win Rate",
	},
	{
		id: "timePlayed",
		numeric: false,
		disablePadding: false,
		label: "Time Played",
	},
];

interface EnhancedTableProps 
{
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	order: Order;
	orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) 
{
  	const { order, orderBy, onRequestSort } = props;
  	const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => 
	{
      	onRequestSort(event, property);
    };

  	return (
    	<TableHead>
			<TableRow>
				{headCells.map((headCell) => 
				(
					<TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false}>
						<TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)}>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
  );
}

export function ArrowheadCompany(props: { arrowheadDB: ArrowheadFirebase })
{
	//#region Props and Navigate
    const { arrowheadDB } = props;
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [order, setOrder] = useState<Order>("asc");
	const [orderBy, setOrderBy] = useState<keyof Data>("gamertag");
	const [stats, setStats] = useState<ServiceRecord[]>([]);
	const [rows, setRows] = useState<Data[]>([]);
	const [view, setView] = useState(ArrowheadView.ServiceRecord);
	const [loadingMessage, setLoadingMessage] = useState("");
	//#endregion

	//#region Functions
	/**
	 * Sorts the table
	 * @param _event unused
	 * @param property which property
	 */
	function handleRequestSort(_event: React.MouseEvent<unknown>, property: keyof Data)
	{
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
  	}

	/**
	 * Handles a click on a row
	 * @param _event unused
	 * @param name which name was clicked
	 */
  	function handleClick(_event: React.MouseEvent<unknown>, name: string)
	{
    	navigate(`service_record/${name}`);
	}
	//#endregion

	//#region Callbacks
	const changeView = useCallback((_event: React.MouseEvent<HTMLElement>, newView: ArrowheadView) => 
	{
		if (newView !== null)
		{
			setView(newView);
		}
	}, []);

	const loadData = useCallback(async () => 
    {
		if (!await arrowheadDB.PopulateMembers()) { return; }
		const serviceRecords = [];
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
        // Get last update instant
        await arrowheadDB.GetLastUpdate();
		lastUpdate.current = arrowheadDB.lastUpdate;
		
        if (stats.length === 0)
        {
            // Get service records for all users
            for (const user of arrowheadDB.members)
            {
				setLoadingMessage("Loading " + user);
				const serviceRecord = await arrowheadDB.GetCurrentServiceRecord(user);
				if (!serviceRecord) { continue; }
				serviceRecords.push(serviceRecord);
			}

            setStats(serviceRecords);
        }
		setLoadingMessage("");
    }, [stats, setStats, lastUpdate, arrowheadDB]);
	//#endregion

	//#region Effects
    useEffect(() =>
    {
        loadData();
    }, []);

	useEffect(() =>
	{
		setRows(stats.map(sr => createData(sr)));
	}, [stats, setRows]);
	//#endregion

  	return (
		<Box sx={{ width: "100%", height: "100%", backgroundColor: "primary.dark", paddingTop: 10 }}>
			<Header title="Arrowhead Company" />
			<Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', '& > :not(style) + :not(style)': { mt: 2 }}}>
				<ToggleButtonGroup className="viewToggleButtons" value={view} onChange={changeView} exclusive>
					<ToggleButton value={ArrowheadView.ServiceRecord} key={ArrowheadView.ServiceRecord}>Service Record</ToggleButton>
					<ToggleButton value={ArrowheadView.PerMatch} key={ArrowheadView.PerMatch}>Per Match</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Paper elevation={3} sx={{ width: "90%", mb: 2, margin: "5%", marginTop: "15px", padding: 2 }}>
				<Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={!!loadingMessage}>
					<CircularProgress color="inherit" />
					<div className="loadingMessage">{loadingMessage}</div>
				</Backdrop>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
						<EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort}/>
						<TableBody>
						{/* if you don't need to support IE11, you can replace the `stableSort` call with:
						rows.slice().sort(getComparator(order, orderBy)) */}
						{stableSort(rows, getComparator(order, orderBy)).map((row, index) => 
						{
							return (
								<TableRow
									hover
									onClick={(event) => handleClick(event, row.gamertag)}
									tabIndex={-1}
									key={row.gamertag}
								>
									<TableCell component="th" scope="row" padding="none">{row.gamertag}</TableCell>
									<TableCell component="th" scope="row" padding="none">{row.spartanRank}</TableCell>
									<TableCell align="right">{(view === ArrowheadView.PerMatch ? row.kills / row.matches : row.kills).toLocaleString()}</TableCell>
									<TableCell align="right">{(view === ArrowheadView.PerMatch ? row.deaths / row.matches : row.deaths).toLocaleString()}</TableCell>
									<TableCell align="right">{(view === ArrowheadView.PerMatch ? row.assists / row.matches : row.assists).toLocaleString()}</TableCell>
									<TableCell align="right">{row.kda.toLocaleString()}</TableCell>
									<TableCell align="right">{row.kdr.toLocaleString()}</TableCell>
									<TableCell align="right">{row.matches.toLocaleString()}</TableCell>
									<TableCell align="right">{row.wld}</TableCell>
									<TableCell align="right">{row.winRate}</TableCell>
									<TableCell align="left">{row.timePlayed}</TableCell>
								</TableRow>
							);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			<Footer lastUpdate={lastUpdate.current?.toLocaleString() ?? "N/A"} />
		</Box>
	);
}