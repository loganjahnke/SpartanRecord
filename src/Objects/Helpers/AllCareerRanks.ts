import { CareerRankMetadata } from "../../Database/Schemas/AutocodeMetadata";
import { CareerRankSchema } from "../../Database/Schemas/CareerRankSchema";
import { ServiceRecord } from "../Model/ServiceRecord";

/**
 * Get the career rank metadata for the rank number
 * @param rank the rank number
 */
export function GetCareerRankMetadata(rank: number): CareerRankMetadata
{
	const cr = (AllCareerRanks as any)[rank];
	return cr;
}

/**
 * Get the string version of the career rank title
 * @param rank the career rank
 */
export function CareerRankTitle(rank: CareerRankSchema): string
{
    if (!rank?.data?.current) { return ""; }
    if (rank.data.current.title === "Hero") { return "Hero"; }
    return `${rank.data.current.properties.type} ${rank.data.current.title} ${CurrentGrade(rank)}`
}

/**
 * Get the string version of the grade
 * @param rank the career rank
 */
export function CurrentGrade(rank: CareerRankSchema): string
{
    if (!rank?.data?.current) { return ""; }
    if (rank.data.current.title === "Hero") { return ""; }
	if (rank.data.current.attributes.grade === 1) { return "I"; }
	if (rank.data.current.attributes.grade === 2) { return "II"; }
	if (rank.data.current.attributes.grade === 3) { return "III"; }
	return "";
}

/**
 * Get the string version of the grade
 * @param rank the career rank
 */
export function NextGrade(rank: CareerRankSchema): string
{
    if (!rank?.data?.current) { return ""; }
    if (rank.data.current.title === "Hero") { return ""; }
    if (rank.data.next.title === "Hero") { return ""; }
	if (rank.data.next.attributes.grade === 1) { return "I"; }
	if (rank.data.next.attributes.grade === 2) { return "II"; }
	if (rank.data.next.attributes.grade === 3) { return "III"; }
	return "";
}

/** Gets the background gradient for a career rank */
export function CareerRankBackground(rank: CareerRankSchema): string
{
    if (!rank?.data?.current) { return ""; }
    return rank.data.current.properties.type === "Bronze" 
            ? "-webkit-linear-gradient(0deg, #a16447 0%, #a16447 40%, #633522 100%)" :
        rank.data.current.properties.type === "Silver" 
            ? "-webkit-linear-gradient(0deg, #d3d3d3 0%, #d3d3d3 40%, #a6a6a6 100%)" :
        rank.data.current.properties.type === "Gold" 
            ? "-webkit-linear-gradient(0deg, #b9aa57 0%, #b9aa57 40%, #583e1b 100%)" :
        rank.data.current.properties.type === "Platinum" 
            ? "-webkit-linear-gradient(0deg, #8e93cc 0%, #8e93cc 40%, #c1d0d0 100%)" :
        rank.data.current.properties.type === "Diamond" 
            ? "-webkit-linear-gradient(0deg, #88c6f9 0%, #88c6f9 40%, #58beed 100%)" :
        rank.data.current.properties.type === "Onyx" 
            ? "-webkit-linear-gradient(0deg, #bb8c41 0%, #bb8c41 40%, #8c6e34 100%)"
        /* Unranked */ 
            : "-webkit-linear-gradient(0deg, #FFFFFF 0%, #ffffda 40%, #EFEFEF 100%)" 
}

/**
 * Gets the lifetime rank of a service record
 * @param serviceRecord the service record
 * @param current the current career rank
 */
export function LifetimeRank(serviceRecord: ServiceRecord, current?: CareerRankSchema): CareerRankSchema
{
    if (current && current.data.level.total_xp > serviceRecord.totalScore) { return current; }
    const rank = GetRankFromScore(serviceRecord.totalScore);
    const currMetadata = GetCareerRankMetadata(rank);
    const nextMetadata = GetCareerRankMetadata(rank + 1) ?? currMetadata;

    const schema = {
		data: {
			level: {
				next_level_threshold: nextMetadata.properties.threshold,
				remaining_xp_to_next_level: nextMetadata.properties.threshold - serviceRecord.totalScore,
				total_xp: serviceRecord.totalScore,
			},
			current: {
				rank: rank,
				title: currMetadata.title,
				subtitle: currMetadata.subtitle,
				image_urls: currMetadata.image_urls,
				attributes: currMetadata.attributes,
				properties: currMetadata.properties
			},
			next: {
				rank: rank,
				title: nextMetadata.title,
				subtitle: nextMetadata.subtitle,
				image_urls: nextMetadata.image_urls,
				attributes: nextMetadata.attributes,
				properties: nextMetadata.properties
            }
        }
    };

    return schema;
}

/**
 * Get the rank number from the score number
 * @param score the total score
 * @returns the rank number
 */
function GetRankFromScore(score: number): number
{
    if (score >= 9319350) { return 272; }
    if (score >= 9069350) { return 271; }
    if (score >= 8894350) { return 270; }
    if (score >= 8744350) { return 269; }
    if (score >= 8519350) { return 268; }
    if (score >= 8344350) { return 267; }
    if (score >= 8194350) { return 266; }
    if (score >= 7994350) { return 265; }
    if (score >= 7844350) { return 264; }
    if (score >= 7719350) { return 263; }
    if (score >= 7544350) { return 262; }
    if (score >= 7394350) { return 261; }
    if (score >= 7269350) { return 260; }
    if (score >= 7094350) { return 259; }
    if (score >= 6969350) { return 258; }
    if (score >= 6869350) { return 257; }
    if (score >= 6719350) { return 256; }
    if (score >= 6594350) { return 255; }
    if (score >= 6494350) { return 254; }
    if (score >= 6344350) { return 253; }
    if (score >= 6244350) { return 252; }
    if (score >= 6154350) { return 251; }
    if (score >= 6029350) { return 250; }
    if (score >= 5929350) { return 249; }
    if (score >= 5846850) { return 248; }
    if (score >= 5721850) { return 247; }
    if (score >= 5631850) { return 246; }
    if (score >= 5556850) { return 245; }
    if (score >= 5456850) { return 244; }
    if (score >= 5374350) { return 243; }
    if (score >= 5304350) { return 242; }
    if (score >= 5204350) { return 241; }
    if (score >= 5126850) { return 240; }
    if (score >= 5064350) { return 239; }
    if (score >= 4974350) { return 238; }
    if (score >= 4904350) { return 237; }
    if (score >= 4846850) { return 236; }
    if (score >= 4764350) { return 235; }
    if (score >= 4699350) { return 234; }
    if (score >= 4646850) { return 233; }
    if (score >= 4569350) { return 232; }
    if (score >= 4511850) { return 231; }
    if (score >= 4461850) { return 230; }
    if (score >= 4391850) { return 229; }
    if (score >= 4336850) { return 228; }
    if (score >= 4291850) { return 227; }
    if (score >= 4191850) { return 226; }
    if (score >= 4106850) { return 225; }
    if (score >= 4034350) { return 224; }
    if (score >= 3934350) { return 223; }
    if (score >= 3854350) { return 222; }
    if (score >= 3789350) { return 221; }
    if (score >= 3694350) { return 220; }
    if (score >= 3621850) { return 219; }
    if (score >= 3561850) { return 218; }
    if (score >= 3476850) { return 217; }
    if (score >= 3411850) { return 216; }
    if (score >= 3356850) { return 215; }
    if (score >= 3276850) { return 214; }
    if (score >= 3216850) { return 213; }
    if (score >= 3166850) { return 212; }
    if (score >= 3094350) { return 211; }
    if (score >= 3039350) { return 210; }
    if (score >= 2991850) { return 209; }
    if (score >= 2926850) { return 208; }
    if (score >= 2876850) { return 207; }
    if (score >= 2834350) { return 206; }
    if (score >= 2774350) { return 205; }
    if (score >= 2726850) { return 204; }
    if (score >= 2686850) { return 203; }
    if (score >= 2631850) { return 202; }
    if (score >= 2589350) { return 201; }
    if (score >= 2554350) { return 200; }
    if (score >= 2504350) { return 199; }
    if (score >= 2464350) { return 198; }
    if (score >= 2431850) { return 197; }
    if (score >= 2384350) { return 196; }
    if (score >= 2349350) { return 195; }
    if (score >= 2319350) { return 194; }
    if (score >= 2276850) { return 193; }
    if (score >= 2244350) { return 192; }
    if (score >= 2216850) { return 191; }
    if (score >= 2176850) { return 190; }
    if (score >= 2146850) { return 189; }
    if (score >= 2121850) { return 188; }
    if (score >= 2086850) { return 187; }
    if (score >= 2059350) { return 186; }
    if (score >= 2036850) { return 185; }
    if (score >= 2004350) { return 184; }
    if (score >= 1979350) { return 183; }
    if (score >= 1959350) { return 182; }
    if (score >= 1906850) { return 181; }
    if (score >= 1866850) { return 180; }
    if (score >= 1834350) { return 179; }
    if (score >= 1786850) { return 178; }
    if (score >= 1749350) { return 177; }
    if (score >= 1719350) { return 176; }
    if (score >= 1674350) { return 175; }
    if (score >= 1639350) { return 174; }
    if (score >= 1611850) { return 173; }
    if (score >= 1571850) { return 172; }
    if (score >= 1541850) { return 171; }
    if (score >= 1516850) { return 170; }
    if (score >= 1479350) { return 169; }
    if (score >= 1451850) { return 168; }
    if (score >= 1429350) { return 167; }
    if (score >= 1396850) { return 166; }
    if (score >= 1371850) { return 165; }
    if (score >= 1349350) { return 164; }
    if (score >= 1319350) { return 163; }
    if (score >= 1294350) { return 162; }
    if (score >= 1274350) { return 161; }
    if (score >= 1246850) { return 160; }
    if (score >= 1224350) { return 159; }
    if (score >= 1206850) { return 158; }
    if (score >= 1181850) { return 157; }
    if (score >= 1161850) { return 156; }
    if (score >= 1144350) { return 155; }
    if (score >= 1121850) { return 154; }
    if (score >= 1104350) { return 153; }
    if (score >= 1089350) { return 152; }
    if (score >= 1066850) { return 151; }
    if (score >= 1049350) { return 150; }
    if (score >= 1034350) { return 149; }
    if (score >= 1014350) { return 148; }
    if (score >= 999350) { return 147; }
    if (score >= 986850) { return 146; }
    if (score >= 969350) { return 145; }
    if (score >= 954350) { return 144; }
    if (score >= 941850) { return 143; }
    if (score >= 924350) { return 142; }
    if (score >= 911850) { return 141; }
    if (score >= 901850) { return 140; }
    if (score >= 886850) { return 139; }
    if (score >= 874350) { return 138; }
    if (score >= 864600) { return 137; }
    if (score >= 839600) { return 136; }
    if (score >= 819600) { return 135; }
    if (score >= 804600) { return 134; }
    if (score >= 782100) { return 133; }
    if (score >= 764600) { return 132; }
    if (score >= 749600) { return 131; }
    if (score >= 729600) { return 130; }
    if (score >= 714600) { return 129; }
    if (score >= 702100) { return 128; }
    if (score >= 682100) { return 127; }
    if (score >= 667100) { return 126; }
    if (score >= 654600) { return 125; }
    if (score >= 637100) { return 124; }
    if (score >= 624600) { return 123; }
    if (score >= 614600) { return 122; }
    if (score >= 599600) { return 121; }
    if (score >= 587100) { return 120; }
    if (score >= 577100) { return 119; }
    if (score >= 562100) { return 118; }
    if (score >= 552100) { return 117; }
    if (score >= 542850) { return 116; }
    if (score >= 530350) { return 115; }
    if (score >= 520350) { return 114; }
    if (score >= 511850) { return 113; }
    if (score >= 499350) { return 112; }
    if (score >= 490100) { return 111; }
    if (score >= 482350) { return 110; }
    if (score >= 472350) { return 109; }
    if (score >= 463850) { return 108; }
    if (score >= 456850) { return 107; }
    if (score >= 446850) { return 106; }
    if (score >= 439100) { return 105; }
    if (score >= 432600) { return 104; }
    if (score >= 423350) { return 103; }
    if (score >= 416100) { return 102; }
    if (score >= 410100) { return 101; }
    if (score >= 401600) { return 100; }
    if (score >= 395100) { return 99; }
    if (score >= 389600) { return 98; }
    if (score >= 381850) { return 97; }
    if (score >= 375850) { return 96; }
    if (score >= 370850) { return 95; }
    if (score >= 363600) { return 94; }
    if (score >= 358100) { return 93; }
    if (score >= 353600) { return 92; }
    if (score >= 341100) { return 91; }
    if (score >= 332350) { return 90; }
    if (score >= 325100) { return 89; }
    if (score >= 315100) { return 88; }
    if (score >= 307100) { return 87; }
    if (score >= 300350) { return 86; }
    if (score >= 290850) { return 85; }
    if (score >= 283350) { return 84; }
    if (score >= 277100) { return 83; }
    if (score >= 268350) { return 82; }
    if (score >= 261600) { return 81; }
    if (score >= 255850) { return 80; }
    if (score >= 247850) { return 79; }
    if (score >= 241600) { return 78; }
    if (score >= 236350) { return 77; }
    if (score >= 229100) { return 76; }
    if (score >= 223350) { return 75; }
    if (score >= 218600) { return 74; }
    if (score >= 211850) { return 73; }
    if (score >= 206600) { return 72; }
    if (score >= 202350) { return 71; }
    if (score >= 196100) { return 70; }
    if (score >= 191350) { return 69; }
    if (score >= 187350) { return 68; }
    if (score >= 181600) { return 67; }
    if (score >= 177350) { return 66; }
    if (score >= 173600) { return 65; }
    if (score >= 168350) { return 64; }
    if (score >= 164350) { return 63; }
    if (score >= 161100) { return 62; }
    if (score >= 156350) { return 61; }
    if (score >= 152600) { return 60; }
    if (score >= 149600) { return 59; }
    if (score >= 145350) { return 58; }
    if (score >= 142100) { return 57; }
    if (score >= 139350) { return 56; }
    if (score >= 135350) { return 55; }
    if (score >= 132350) { return 54; }
    if (score >= 129850) { return 53; }
    if (score >= 126100) { return 52; }
    if (score >= 123350) { return 51; }
    if (score >= 121100) { return 50; }
    if (score >= 117850) { return 49; }
    if (score >= 115350) { return 48; }
    if (score >= 113100) { return 47; }
    if (score >= 107850) { return 46; }
    if (score >= 103850) { return 45; }
    if (score >= 100350) { return 44; }
    if (score >= 95350) { return 43; }
    if (score >= 91600) { return 42; }
    if (score >= 88350) { return 41; }
    if (score >= 83850) { return 40; }
    if (score >= 80350) { return 39; }
    if (score >= 77350) { return 38; }
    if (score >= 73350) { return 37; }
    if (score >= 70100) { return 36; }
    if (score >= 67350) { return 35; }
    if (score >= 63600) { return 34; }
    if (score >= 60600) { return 33; }
    if (score >= 58100) { return 32; }
    if (score >= 54600) { return 31; }
    if (score >= 51850) { return 30; }
    if (score >= 49600) { return 29; }
    if (score >= 46350) { return 28; }
    if (score >= 43850) { return 27; }
    if (score >= 41850) { return 26; }
    if (score >= 38850) { return 25; }
    if (score >= 36600) { return 24; }
    if (score >= 34850) { return 23; }
    if (score >= 32100) { return 22; }
    if (score >= 30100) { return 21; }
    if (score >= 28350) { return 20; }
    if (score >= 25850) { return 19; }
    if (score >= 24100) { return 18; }
    if (score >= 22600) { return 17; }
    if (score >= 20350) { return 16; }
    if (score >= 18600) { return 15; }
    if (score >= 17100) { return 14; }
    if (score >= 15100) { return 13; }
    if (score >= 13600) { return 12; }
    if (score >= 12350) { return 11; }
    if (score >= 10600) { return 10; }
    if (score >= 9100) { return 9; }
    if (score >= 7850) { return 8; }
    if (score >= 6100) { return 7; }
    if (score >= 4850) { return 6; }
    if (score >= 3850) { return 5; }
    if (score >= 2350) { return 4; }
    if (score >= 1100) { return 3; }
    if (score >= 100) { return 2; }
    if (score >= 0) { return 1; }
    if (score >= -100   ) { return 0; }
    return 0;
}

export const AllCareerRanks = {
	0: {
		"title": "Recruit",
		"subtitle": "",
		"image_urls": {
			"icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMV9SZWNydWl0LnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
			"large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMV9SZWNydWl0LnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
			"adornment_icon": null
		},
		"attributes": {
			"tier": null,
			"grade": 1,
			"colors": [
				"#76472A",
				"#E89568"
			]
		},
		"properties": {
			"type": "",
			"threshold": -100
		}
	},
        1: {
            "title": "Recruit",
            "subtitle": "",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMV9SZWNydWl0LnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMV9SZWNydWl0LnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": null
            },
            "attributes": {
                "tier": null,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "",
                "threshold": 0
            }
        },
        2: {
            "title": "Cadet",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMl9DYWRldF9Ccm9uemVfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMl9DYWRldF9Ccm9uemVfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzJfQ2FkZXRfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 100
            }
        },
        3: {
            "title": "Cadet",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvM19DYWRldF9Ccm9uemVfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvM19DYWRldF9Ccm9uemVfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzNfQ2FkZXRfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 1100
            }
        },
        4: {
            "title": "Cadet",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNF9DYWRldF9Ccm9uemVfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNF9DYWRldF9Ccm9uemVfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzRfQ2FkZXRfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 2350
            }
        },
        5: {
            "title": "Private",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjBfUHJpdmF0ZV9Ccm9uemVfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjBfUHJpdmF0ZV9Ccm9uemVfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwX1ByaXZhdGVfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 3850
            }
        },
        6: {
            "title": "Private",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjFfUHJpdmF0ZV9Ccm9uemVfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjFfUHJpdmF0ZV9Ccm9uemVfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxX1ByaXZhdGVfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 4850
            }
        },
        7: {
            "title": "Private",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjJfUHJpdmF0ZV9Ccm9uemVfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjJfUHJpdmF0ZV9Ccm9uemVfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyX1ByaXZhdGVfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 6100
            }
        },
        8: {
            "title": "Lance Corporal",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMzhfTGFuY2VfQ29ycG9yYWxfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMzhfTGFuY2VfQ29ycG9yYWxfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzM4X0xhbmNlX0NvcnBvcmFsX0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 7850
            }
        },
        9: {
            "title": "Lance Corporal",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMzlfTGFuY2VfQ29ycG9yYWxfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMzlfTGFuY2VfQ29ycG9yYWxfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzM5X0xhbmNlX0NvcnBvcmFsX0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 9100
            }
        },
        10: {
            "title": "Lance Corporal",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNDBfTGFuY2VfQ29ycG9yYWxfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNDBfTGFuY2VfQ29ycG9yYWxfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzQwX0xhbmNlX0NvcnBvcmFsX0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 10600
            }
        },
        11: {
            "title": "Corporal",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNTZfQ29ycG9yYWxfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNTZfQ29ycG9yYWxfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzU2X0NvcnBvcmFsX0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 12350
            }
        },
        12: {
            "title": "Corporal",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNTdfQ29ycG9yYWxfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNTdfQ29ycG9yYWxfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzU3X0NvcnBvcmFsX0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 13600
            }
        },
        13: {
            "title": "Corporal",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNThfQ29ycG9yYWxfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNThfQ29ycG9yYWxfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzU4X0NvcnBvcmFsX0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 15100
            }
        },
        14: {
            "title": "Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNzRfU2VyZ2VhbnRfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNzRfU2VyZ2VhbnRfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzc0X1NlcmdlYW50X0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 17100
            }
        },
        15: {
            "title": "Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNzVfU2VyZ2VhbnRfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNzVfU2VyZ2VhbnRfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzc1X1NlcmdlYW50X0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 18600
            }
        },
        16: {
            "title": "Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNzZfU2VyZ2VhbnRfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNzZfU2VyZ2VhbnRfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzc2X1NlcmdlYW50X0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 20350
            }
        },
        17: {
            "title": "Staff Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOTJfU3RhZmZfU2VyZ2VhbnRfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOTJfU3RhZmZfU2VyZ2VhbnRfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzkyX1N0YWZmX1NlcmdlYW50X0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 22600
            }
        },
        18: {
            "title": "Staff Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOTNfU3RhZmZfU2VyZ2VhbnRfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOTNfU3RhZmZfU2VyZ2VhbnRfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzkzX1N0YWZmX1NlcmdlYW50X0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 24100
            }
        },
        19: {
            "title": "Staff Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOTRfU3RhZmZfU2VyZ2VhbnRfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOTRfU3RhZmZfU2VyZ2VhbnRfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzk0X1N0YWZmX1NlcmdlYW50X0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 25850
            }
        },
        20: {
            "title": "Gunnery Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTEwX0d1bm5lcnlfU2VyZ2VhbnRfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTEwX0d1bm5lcnlfU2VyZ2VhbnRfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExMF9HdW5uZXJ5X1NlcmdlYW50X0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 28350
            }
        },
        21: {
            "title": "Gunnery Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTExX0d1bm5lcnlfU2VyZ2VhbnRfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTExX0d1bm5lcnlfU2VyZ2VhbnRfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExMV9HdW5uZXJ5X1NlcmdlYW50X0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 30100
            }
        },
        22: {
            "title": "Gunnery Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTEyX0d1bm5lcnlfU2VyZ2VhbnRfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTEyX0d1bm5lcnlfU2VyZ2VhbnRfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExMl9HdW5uZXJ5X1NlcmdlYW50X0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 32100
            }
        },
        23: {
            "title": "Master Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTI4X01hc3Rlcl9TZXJnZWFudF9Ccm9uemVfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTI4X01hc3Rlcl9TZXJnZWFudF9Ccm9uemVfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyOF9NYXN0ZXJfU2VyZ2VhbnRfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 34850
            }
        },
        24: {
            "title": "Master Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTI5X01hc3Rlcl9TZXJnZWFudF9Ccm9uemVfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTI5X01hc3Rlcl9TZXJnZWFudF9Ccm9uemVfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyOV9NYXN0ZXJfU2VyZ2VhbnRfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 36600
            }
        },
        25: {
            "title": "Master Sergeant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTMwX01hc3Rlcl9TZXJnZWFudF9Ccm9uemVfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTMwX01hc3Rlcl9TZXJnZWFudF9Ccm9uemVfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzMF9NYXN0ZXJfU2VyZ2VhbnRfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 38850
            }
        },
        26: {
            "title": "Lieutenant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTQ2X0xpZXV0ZW5hbnRfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTQ2X0xpZXV0ZW5hbnRfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0Nl9MaWV1dGVuYW50X0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 41850
            }
        },
        27: {
            "title": "Lieutenant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTQ3X0xpZXV0ZW5hbnRfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTQ3X0xpZXV0ZW5hbnRfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0N19MaWV1dGVuYW50X0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 43850
            }
        },
        28: {
            "title": "Lieutenant",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTQ4X0xpZXV0ZW5hbnRfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTQ4X0xpZXV0ZW5hbnRfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0OF9MaWV1dGVuYW50X0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 46350
            }
        },
        29: {
            "title": "Captain",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTY0X0NhcHRhaW5fQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTY0X0NhcHRhaW5fQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2NF9DYXB0YWluX0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 49600
            }
        },
        30: {
            "title": "Captain",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTY1X0NhcHRhaW5fQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTY1X0NhcHRhaW5fQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2NV9DYXB0YWluX0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 51850
            }
        },
        31: {
            "title": "Captain",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTY2X0NhcHRhaW5fQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTY2X0NhcHRhaW5fQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2Nl9DYXB0YWluX0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 54600
            }
        },
        32: {
            "title": "Major",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTgyX01ham9yX0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTgyX01ham9yX0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4Ml9NYWpvcl9Ccm9uemVfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 58100
            }
        },
        33: {
            "title": "Major",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTgzX01ham9yX0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTgzX01ham9yX0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4M19NYWpvcl9Ccm9uemVfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 60600
            }
        },
        34: {
            "title": "Major",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTg0X01ham9yX0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTg0X01ham9yX0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4NF9NYWpvcl9Ccm9uemVfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 63600
            }
        },
        35: {
            "title": "Lt Colonel",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjAwX0x0X0NvbG9uZWxfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjAwX0x0X0NvbG9uZWxfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwMF9MdF9Db2xvbmVsX0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 67350
            }
        },
        36: {
            "title": "Lt Colonel",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjAxX0x0X0NvbG9uZWxfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjAxX0x0X0NvbG9uZWxfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwMV9MdF9Db2xvbmVsX0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 70100
            }
        },
        37: {
            "title": "Lt Colonel",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjAyX0x0X0NvbG9uZWxfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjAyX0x0X0NvbG9uZWxfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwMl9MdF9Db2xvbmVsX0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 73350
            }
        },
        38: {
            "title": "Colonel",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjE4X0NvbG9uZWxfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjE4X0NvbG9uZWxfQnJvbnplX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxOF9Db2xvbmVsX0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 77350
            }
        },
        39: {
            "title": "Colonel",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjE5X0NvbG9uZWxfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjE5X0NvbG9uZWxfQnJvbnplX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxOV9Db2xvbmVsX0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 80350
            }
        },
        40: {
            "title": "Colonel",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjIwX0NvbG9uZWxfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjIwX0NvbG9uZWxfQnJvbnplX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyMF9Db2xvbmVsX0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 83850
            }
        },
        41: {
            "title": "Brigadier General",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjM2X0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjM2X0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzNl9CcmlnYWRpZXJfR2VuZXJhbF9Ccm9uemVfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 88350
            }
        },
        42: {
            "title": "Brigadier General",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjM3X0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjM3X0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzN19CcmlnYWRpZXJfR2VuZXJhbF9Ccm9uemVfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 91600
            }
        },
        43: {
            "title": "Brigadier General",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjM4X0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjM4X0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzOF9CcmlnYWRpZXJfR2VuZXJhbF9Ccm9uemVfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 95350
            }
        },
        44: {
            "title": "General",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjU0X0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjU0X0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1NF9HZW5lcmFsX0Jyb256ZV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 100350
            }
        },
        45: {
            "title": "General",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjU1X0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjU1X0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1NV9HZW5lcmFsX0Jyb256ZV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 103850
            }
        },
        46: {
            "title": "General",
            "subtitle": "Bronze",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjU2X0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjU2X0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1Nl9HZW5lcmFsX0Jyb256ZV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#76472A",
                    "#E89568"
                ]
            },
            "properties": {
                "type": "Bronze",
                "threshold": 107850
            }
        },
        47: {
            "title": "Cadet",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNV9DYWRldF9TaWx2ZXJfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNV9DYWRldF9TaWx2ZXJfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzVfQ2FkZXRfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 113100
            }
        },
        48: {
            "title": "Cadet",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNl9DYWRldF9TaWx2ZXJfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNl9DYWRldF9TaWx2ZXJfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzZfQ2FkZXRfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 115350
            }
        },
        49: {
            "title": "Cadet",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvN19DYWRldF9TaWx2ZXJfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvN19DYWRldF9TaWx2ZXJfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzdfQ2FkZXRfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 117850
            }
        },
        50: {
            "title": "Private",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjNfUHJpdmF0ZV9TaWx2ZXJfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjNfUHJpdmF0ZV9TaWx2ZXJfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzX1ByaXZhdGVfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 121100
            }
        },
        51: {
            "title": "Private",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjRfUHJpdmF0ZV9TaWx2ZXJfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjRfUHJpdmF0ZV9TaWx2ZXJfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0X1ByaXZhdGVfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 123350
            }
        },
        52: {
            "title": "Private",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjVfUHJpdmF0ZV9TaWx2ZXJfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjVfUHJpdmF0ZV9TaWx2ZXJfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1X1ByaXZhdGVfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 126100
            }
        },
        53: {
            "title": "Lance Corporal",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNDFfTGFuY2VfQ29ycG9yYWxfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNDFfTGFuY2VfQ29ycG9yYWxfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzQxX0xhbmNlX0NvcnBvcmFsX1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 129850
            }
        },
        54: {
            "title": "Lance Corporal",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNDJfTGFuY2VfQ29ycG9yYWxfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNDJfTGFuY2VfQ29ycG9yYWxfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzQyX0xhbmNlX0NvcnBvcmFsX1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 132350
            }
        },
        55: {
            "title": "Lance Corporal",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNDNfTGFuY2VfQ29ycG9yYWxfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNDNfTGFuY2VfQ29ycG9yYWxfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzQzX0xhbmNlX0NvcnBvcmFsX1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 135350
            }
        },
        56: {
            "title": "Corporal",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNTlfQ29ycG9yYWxfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNTlfQ29ycG9yYWxfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzU5X0NvcnBvcmFsX1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 139350
            }
        },
        57: {
            "title": "Corporal",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNjBfQ29ycG9yYWxfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNjBfQ29ycG9yYWxfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzYwX0NvcnBvcmFsX1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 142100
            }
        },
        58: {
            "title": "Corporal",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNjFfQ29ycG9yYWxfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNjFfQ29ycG9yYWxfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzYxX0NvcnBvcmFsX1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 145350
            }
        },
        59: {
            "title": "Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNzdfU2VyZ2VhbnRfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNzdfU2VyZ2VhbnRfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzc3X1NlcmdlYW50X1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 149600
            }
        },
        60: {
            "title": "Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNzhfU2VyZ2VhbnRfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNzhfU2VyZ2VhbnRfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzc4X1NlcmdlYW50X1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 152600
            }
        },
        61: {
            "title": "Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNzlfU2VyZ2VhbnRfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNzlfU2VyZ2VhbnRfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzc5X1NlcmdlYW50X1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 156350
            }
        },
        62: {
            "title": "Staff Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOTVfU3RhZmZfU2VyZ2VhbnRfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOTVfU3RhZmZfU2VyZ2VhbnRfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzk1X1N0YWZmX1NlcmdlYW50X1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 161100
            }
        },
        63: {
            "title": "Staff Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOTZfU3RhZmZfU2VyZ2VhbnRfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOTZfU3RhZmZfU2VyZ2VhbnRfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzk2X1N0YWZmX1NlcmdlYW50X1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 164350
            }
        },
        64: {
            "title": "Staff Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOTdfU3RhZmZfU2VyZ2VhbnRfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOTdfU3RhZmZfU2VyZ2VhbnRfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzk3X1N0YWZmX1NlcmdlYW50X1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 168350
            }
        },
        65: {
            "title": "Gunnery Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTEzX0d1bm5lcnlfU2VyZ2VhbnRfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTEzX0d1bm5lcnlfU2VyZ2VhbnRfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExM19HdW5uZXJ5X1NlcmdlYW50X1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 173600
            }
        },
        66: {
            "title": "Gunnery Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTE0X0d1bm5lcnlfU2VyZ2VhbnRfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTE0X0d1bm5lcnlfU2VyZ2VhbnRfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExNF9HdW5uZXJ5X1NlcmdlYW50X1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 177350
            }
        },
        67: {
            "title": "Gunnery Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTE1X0d1bm5lcnlfU2VyZ2VhbnRfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTE1X0d1bm5lcnlfU2VyZ2VhbnRfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExNV9HdW5uZXJ5X1NlcmdlYW50X1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 181600
            }
        },
        68: {
            "title": "Master Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTMxX01hc3Rlcl9TZXJnZWFudF9TaWx2ZXJfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTMxX01hc3Rlcl9TZXJnZWFudF9TaWx2ZXJfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzMV9NYXN0ZXJfU2VyZ2VhbnRfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 187350
            }
        },
        69: {
            "title": "Master Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTMyX01hc3Rlcl9TZXJnZWFudF9TaWx2ZXJfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTMyX01hc3Rlcl9TZXJnZWFudF9TaWx2ZXJfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzMl9NYXN0ZXJfU2VyZ2VhbnRfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 191350
            }
        },
        70: {
            "title": "Master Sergeant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTMzX01hc3Rlcl9TZXJnZWFudF9TaWx2ZXJfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTMzX01hc3Rlcl9TZXJnZWFudF9TaWx2ZXJfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzM19NYXN0ZXJfU2VyZ2VhbnRfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 196100
            }
        },
        71: {
            "title": "Lieutenant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTQ5X0xpZXV0ZW5hbnRfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTQ5X0xpZXV0ZW5hbnRfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0OV9MaWV1dGVuYW50X1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 202350
            }
        },
        72: {
            "title": "Lieutenant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTUwX0xpZXV0ZW5hbnRfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTUwX0xpZXV0ZW5hbnRfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1MF9MaWV1dGVuYW50X1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 206600
            }
        },
        73: {
            "title": "Lieutenant",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTUxX0xpZXV0ZW5hbnRfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTUxX0xpZXV0ZW5hbnRfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1MV9MaWV1dGVuYW50X1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 211850
            }
        },
        74: {
            "title": "Captain",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTY3X0NhcHRhaW5fU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTY3X0NhcHRhaW5fU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2N19DYXB0YWluX1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 218600
            }
        },
        75: {
            "title": "Captain",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTY4X0NhcHRhaW5fU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTY4X0NhcHRhaW5fU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2OF9DYXB0YWluX1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 223350
            }
        },
        76: {
            "title": "Captain",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTY5X0NhcHRhaW5fU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTY5X0NhcHRhaW5fU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2OV9DYXB0YWluX1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 229100
            }
        },
        77: {
            "title": "Major",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTg1X01ham9yX1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTg1X01ham9yX1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4NV9NYWpvcl9TaWx2ZXJfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 236350
            }
        },
        78: {
            "title": "Major",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTg2X01ham9yX1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTg2X01ham9yX1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4Nl9NYWpvcl9TaWx2ZXJfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 241600
            }
        },
        79: {
            "title": "Major",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTg3X01ham9yX1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTg3X01ham9yX1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4N19NYWpvcl9TaWx2ZXJfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 247850
            }
        },
        80: {
            "title": "Lt Colonel",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjAzX0x0X0NvbG9uZWxfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjAzX0x0X0NvbG9uZWxfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwM19MdF9Db2xvbmVsX1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 255850
            }
        },
        81: {
            "title": "Lt Colonel",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjA0X0x0X0NvbG9uZWxfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjA0X0x0X0NvbG9uZWxfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwNF9MdF9Db2xvbmVsX1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 261600
            }
        },
        82: {
            "title": "Lt Colonel",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjA1X0x0X0NvbG9uZWxfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjA1X0x0X0NvbG9uZWxfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwNV9MdF9Db2xvbmVsX1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 268350
            }
        },
        83: {
            "title": "Colonel",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjIxX0NvbG9uZWxfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjIxX0NvbG9uZWxfU2lsdmVyX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyMV9Db2xvbmVsX1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 277100
            }
        },
        84: {
            "title": "Colonel",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjIyX0NvbG9uZWxfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjIyX0NvbG9uZWxfU2lsdmVyX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyMl9Db2xvbmVsX1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 283350
            }
        },
        85: {
            "title": "Colonel",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjIzX0NvbG9uZWxfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjIzX0NvbG9uZWxfU2lsdmVyX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyM19Db2xvbmVsX1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 290850
            }
        },
        86: {
            "title": "Brigadier General",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjM5X1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjM5X1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzOV9CcmlnYWRpZXJfR2VuZXJhbF9TaWx2ZXJfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 300350
            }
        },
        87: {
            "title": "Brigadier General",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjQwX1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjQwX1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0MF9CcmlnYWRpZXJfR2VuZXJhbF9TaWx2ZXJfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 307100
            }
        },
        88: {
            "title": "Brigadier General",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjQxX1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjQxX1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0MV9CcmlnYWRpZXJfR2VuZXJhbF9TaWx2ZXJfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 315100
            }
        },
        89: {
            "title": "General",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjU3X1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjU3X1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1N19HZW5lcmFsX1NpbHZlcl9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 325100
            }
        },
        90: {
            "title": "General",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjU4X1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjU4X1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1OF9HZW5lcmFsX1NpbHZlcl9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 332350
            }
        },
        91: {
            "title": "General",
            "subtitle": "Silver",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjU5X1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjU5X1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1OV9HZW5lcmFsX1NpbHZlcl9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#616263",
                    "#E6E6E6"
                ]
            },
            "properties": {
                "type": "Silver",
                "threshold": 341100
            }
        },
        92: {
            "title": "Cadet",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOF9DYWRldF9Hb2xkX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOF9DYWRldF9Hb2xkX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzhfQ2FkZXRfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 353600
            }
        },
        93: {
            "title": "Cadet",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOV9DYWRldF9Hb2xkX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOV9DYWRldF9Hb2xkX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzlfQ2FkZXRfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 358100
            }
        },
        94: {
            "title": "Cadet",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTBfQ2FkZXRfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTBfQ2FkZXRfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwX0NhZGV0X0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 363600
            }
        },
        95: {
            "title": "Private",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjZfUHJpdmF0ZV9Hb2xkX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjZfUHJpdmF0ZV9Hb2xkX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2X1ByaXZhdGVfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 370850
            }
        },
        96: {
            "title": "Private",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjdfUHJpdmF0ZV9Hb2xkX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjdfUHJpdmF0ZV9Hb2xkX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI3X1ByaXZhdGVfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 375850
            }
        },
        97: {
            "title": "Private",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjhfUHJpdmF0ZV9Hb2xkX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjhfUHJpdmF0ZV9Hb2xkX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI4X1ByaXZhdGVfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 381850
            }
        },
        98: {
            "title": "Lance Corporal",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNDRfTGFuY2VfQ29ycG9yYWxfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNDRfTGFuY2VfQ29ycG9yYWxfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzQ0X0xhbmNlX0NvcnBvcmFsX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 389600
            }
        },
        99: {
            "title": "Lance Corporal",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNDVfTGFuY2VfQ29ycG9yYWxfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNDVfTGFuY2VfQ29ycG9yYWxfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzQ1X0xhbmNlX0NvcnBvcmFsX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 395100
            }
        },
        100: {
            "title": "Lance Corporal",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNDZfTGFuY2VfQ29ycG9yYWxfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNDZfTGFuY2VfQ29ycG9yYWxfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzQ2X0xhbmNlX0NvcnBvcmFsX0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 401600
            }
        },
        101: {
            "title": "Corporal",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNjJfQ29ycG9yYWxfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNjJfQ29ycG9yYWxfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzYyX0NvcnBvcmFsX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 410100
            }
        },
        102: {
            "title": "Corporal",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNjNfQ29ycG9yYWxfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNjNfQ29ycG9yYWxfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzYzX0NvcnBvcmFsX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 416100
            }
        },
        103: {
            "title": "Corporal",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNjRfQ29ycG9yYWxfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNjRfQ29ycG9yYWxfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzY0X0NvcnBvcmFsX0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 423350
            }
        },
        104: {
            "title": "Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvODBfU2VyZ2VhbnRfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvODBfU2VyZ2VhbnRfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzgwX1NlcmdlYW50X0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 432600
            }
        },
        105: {
            "title": "Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvODFfU2VyZ2VhbnRfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvODFfU2VyZ2VhbnRfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzgxX1NlcmdlYW50X0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 439100
            }
        },
        106: {
            "title": "Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvODJfU2VyZ2VhbnRfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvODJfU2VyZ2VhbnRfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzgyX1NlcmdlYW50X0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 446850
            }
        },
        107: {
            "title": "Staff Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOThfU3RhZmZfU2VyZ2VhbnRfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOThfU3RhZmZfU2VyZ2VhbnRfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzk4X1N0YWZmX1NlcmdlYW50X0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 456850
            }
        },
        108: {
            "title": "Staff Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOTlfU3RhZmZfU2VyZ2VhbnRfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOTlfU3RhZmZfU2VyZ2VhbnRfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzk5X1N0YWZmX1NlcmdlYW50X0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 463850
            }
        },
        109: {
            "title": "Staff Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTAwX1N0YWZmX1NlcmdlYW50X0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTAwX1N0YWZmX1NlcmdlYW50X0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwMF9TdGFmZl9TZXJnZWFudF9Hb2xkX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 472350
            }
        },
        110: {
            "title": "Gunnery Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTE2X0d1bm5lcnlfU2VyZ2VhbnRfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTE2X0d1bm5lcnlfU2VyZ2VhbnRfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExNl9HdW5uZXJ5X1NlcmdlYW50X0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 482350
            }
        },
        111: {
            "title": "Gunnery Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTE3X0d1bm5lcnlfU2VyZ2VhbnRfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTE3X0d1bm5lcnlfU2VyZ2VhbnRfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExN19HdW5uZXJ5X1NlcmdlYW50X0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 490100
            }
        },
        112: {
            "title": "Gunnery Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTE4X0d1bm5lcnlfU2VyZ2VhbnRfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTE4X0d1bm5lcnlfU2VyZ2VhbnRfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExOF9HdW5uZXJ5X1NlcmdlYW50X0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 499350
            }
        },
        113: {
            "title": "Master Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTM0X01hc3Rlcl9TZXJnZWFudF9Hb2xkX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTM0X01hc3Rlcl9TZXJnZWFudF9Hb2xkX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzNF9NYXN0ZXJfU2VyZ2VhbnRfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 511850
            }
        },
        114: {
            "title": "Master Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTM1X01hc3Rlcl9TZXJnZWFudF9Hb2xkX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTM1X01hc3Rlcl9TZXJnZWFudF9Hb2xkX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzNV9NYXN0ZXJfU2VyZ2VhbnRfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 520350
            }
        },
        115: {
            "title": "Master Sergeant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTM2X01hc3Rlcl9TZXJnZWFudF9Hb2xkX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTM2X01hc3Rlcl9TZXJnZWFudF9Hb2xkX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzNl9NYXN0ZXJfU2VyZ2VhbnRfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 530350
            }
        },
        116: {
            "title": "Lieutenant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTUyX0xpZXV0ZW5hbnRfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTUyX0xpZXV0ZW5hbnRfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1Ml9MaWV1dGVuYW50X0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 542850
            }
        },
        117: {
            "title": "Lieutenant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTUzX0xpZXV0ZW5hbnRfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTUzX0xpZXV0ZW5hbnRfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1M19MaWV1dGVuYW50X0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 552100
            }
        },
        118: {
            "title": "Lieutenant",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTU0X0xpZXV0ZW5hbnRfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTU0X0xpZXV0ZW5hbnRfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1NF9MaWV1dGVuYW50X0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 562100
            }
        },
        119: {
            "title": "Captain",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTcwX0NhcHRhaW5fR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTcwX0NhcHRhaW5fR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3MF9DYXB0YWluX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 577100
            }
        },
        120: {
            "title": "Captain",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTcxX0NhcHRhaW5fR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTcxX0NhcHRhaW5fR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3MV9DYXB0YWluX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 587100
            }
        },
        121: {
            "title": "Captain",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTcyX0NhcHRhaW5fR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTcyX0NhcHRhaW5fR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3Ml9DYXB0YWluX0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 599600
            }
        },
        122: {
            "title": "Major",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTg4X01ham9yX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTg4X01ham9yX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4OF9NYWpvcl9Hb2xkX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 614600
            }
        },
        123: {
            "title": "Major",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTg5X01ham9yX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTg5X01ham9yX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4OV9NYWpvcl9Hb2xkX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 624600
            }
        },
        124: {
            "title": "Major",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTkwX01ham9yX0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTkwX01ham9yX0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5MF9NYWpvcl9Hb2xkX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 637100
            }
        },
        125: {
            "title": "Lt Colonel",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjA2X0x0X0NvbG9uZWxfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjA2X0x0X0NvbG9uZWxfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwNl9MdF9Db2xvbmVsX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 654600
            }
        },
        126: {
            "title": "Lt Colonel",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjA3X0x0X0NvbG9uZWxfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjA3X0x0X0NvbG9uZWxfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwN19MdF9Db2xvbmVsX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 667100
            }
        },
        127: {
            "title": "Lt Colonel",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjA4X0x0X0NvbG9uZWxfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjA4X0x0X0NvbG9uZWxfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwOF9MdF9Db2xvbmVsX0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 682100
            }
        },
        128: {
            "title": "Colonel",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjI0X0NvbG9uZWxfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjI0X0NvbG9uZWxfR29sZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyNF9Db2xvbmVsX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 702100
            }
        },
        129: {
            "title": "Colonel",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjI1X0NvbG9uZWxfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjI1X0NvbG9uZWxfR29sZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyNV9Db2xvbmVsX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 714600
            }
        },
        130: {
            "title": "Colonel",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjI2X0NvbG9uZWxfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjI2X0NvbG9uZWxfR29sZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyNl9Db2xvbmVsX0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 729600
            }
        },
        131: {
            "title": "Brigadier General",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjQyX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjQyX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0Ml9CcmlnYWRpZXJfR2VuZXJhbF9Hb2xkX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 749600
            }
        },
        132: {
            "title": "Brigadier General",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjQzX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjQzX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0M19CcmlnYWRpZXJfR2VuZXJhbF9Hb2xkX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 764600
            }
        },
        133: {
            "title": "Brigadier General",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjQ0X0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjQ0X0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0NF9CcmlnYWRpZXJfR2VuZXJhbF9Hb2xkX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 782100
            }
        },
        134: {
            "title": "General",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjYwX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjYwX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2MF9HZW5lcmFsX0dvbGRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 804600
            }
        },
        135: {
            "title": "General",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjYxX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjYxX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2MV9HZW5lcmFsX0dvbGRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 819600
            }
        },
        136: {
            "title": "General",
            "subtitle": "Gold",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjYyX0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjYyX0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2Ml9HZW5lcmFsX0dvbGRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Gold",
                "threshold": 839600
            }
        },
        137: {
            "title": "Cadet",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTFfQ2FkZXRfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTFfQ2FkZXRfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExX0NhZGV0X1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 864600
            }
        },
        138: {
            "title": "Cadet",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTJfQ2FkZXRfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTJfQ2FkZXRfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyX0NhZGV0X1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 874350
            }
        },
        139: {
            "title": "Cadet",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTNfQ2FkZXRfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTNfQ2FkZXRfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzX0NhZGV0X1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 886850
            }
        },
        140: {
            "title": "Private",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjlfUHJpdmF0ZV9QbGF0aW51bV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjlfUHJpdmF0ZV9QbGF0aW51bV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI5X1ByaXZhdGVfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 901850
            }
        },
        141: {
            "title": "Private",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMzBfUHJpdmF0ZV9QbGF0aW51bV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMzBfUHJpdmF0ZV9QbGF0aW51bV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzMwX1ByaXZhdGVfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 911850
            }
        },
        142: {
            "title": "Private",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMzFfUHJpdmF0ZV9QbGF0aW51bV9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMzFfUHJpdmF0ZV9QbGF0aW51bV9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzMxX1ByaXZhdGVfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 924350
            }
        },
        143: {
            "title": "Lance Corporal",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNDdfTGFuY2VfQ29ycG9yYWxfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNDdfTGFuY2VfQ29ycG9yYWxfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzQ3X0xhbmNlX0NvcnBvcmFsX1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 941850
            }
        },
        144: {
            "title": "Lance Corporal",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNDhfTGFuY2VfQ29ycG9yYWxfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNDhfTGFuY2VfQ29ycG9yYWxfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzQ4X0xhbmNlX0NvcnBvcmFsX1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 954350
            }
        },
        145: {
            "title": "Lance Corporal",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNDlfTGFuY2VfQ29ycG9yYWxfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNDlfTGFuY2VfQ29ycG9yYWxfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzQ5X0xhbmNlX0NvcnBvcmFsX1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 969350
            }
        },
        146: {
            "title": "Corporal",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNjVfQ29ycG9yYWxfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNjVfQ29ycG9yYWxfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzY1X0NvcnBvcmFsX1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 986850
            }
        },
        147: {
            "title": "Corporal",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNjZfQ29ycG9yYWxfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNjZfQ29ycG9yYWxfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzY2X0NvcnBvcmFsX1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 999350
            }
        },
        148: {
            "title": "Corporal",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNjdfQ29ycG9yYWxfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNjdfQ29ycG9yYWxfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzY3X0NvcnBvcmFsX1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1014350
            }
        },
        149: {
            "title": "Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvODNfU2VyZ2VhbnRfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvODNfU2VyZ2VhbnRfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzgzX1NlcmdlYW50X1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1034350
            }
        },
        150: {
            "title": "Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvODRfU2VyZ2VhbnRfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvODRfU2VyZ2VhbnRfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzg0X1NlcmdlYW50X1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1049350
            }
        },
        151: {
            "title": "Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvODVfU2VyZ2VhbnRfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvODVfU2VyZ2VhbnRfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzg1X1NlcmdlYW50X1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1066850
            }
        },
        152: {
            "title": "Staff Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTAxX1N0YWZmX1NlcmdlYW50X1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTAxX1N0YWZmX1NlcmdlYW50X1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwMV9TdGFmZl9TZXJnZWFudF9QbGF0aW51bV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1089350
            }
        },
        153: {
            "title": "Staff Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTAyX1N0YWZmX1NlcmdlYW50X1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTAyX1N0YWZmX1NlcmdlYW50X1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwMl9TdGFmZl9TZXJnZWFudF9QbGF0aW51bV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1104350
            }
        },
        154: {
            "title": "Staff Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTAzX1N0YWZmX1NlcmdlYW50X1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTAzX1N0YWZmX1NlcmdlYW50X1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwM19TdGFmZl9TZXJnZWFudF9QbGF0aW51bV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1121850
            }
        },
        155: {
            "title": "Gunnery Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTE5X0d1bm5lcnlfU2VyZ2VhbnRfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTE5X0d1bm5lcnlfU2VyZ2VhbnRfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzExOV9HdW5uZXJ5X1NlcmdlYW50X1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1144350
            }
        },
        156: {
            "title": "Gunnery Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTIwX0d1bm5lcnlfU2VyZ2VhbnRfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTIwX0d1bm5lcnlfU2VyZ2VhbnRfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyMF9HdW5uZXJ5X1NlcmdlYW50X1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1161850
            }
        },
        157: {
            "title": "Gunnery Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTIxX0d1bm5lcnlfU2VyZ2VhbnRfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTIxX0d1bm5lcnlfU2VyZ2VhbnRfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyMV9HdW5uZXJ5X1NlcmdlYW50X1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1181850
            }
        },
        158: {
            "title": "Master Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTM3X01hc3Rlcl9TZXJnZWFudF9QbGF0aW51bV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTM3X01hc3Rlcl9TZXJnZWFudF9QbGF0aW51bV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzN19NYXN0ZXJfU2VyZ2VhbnRfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1206850
            }
        },
        159: {
            "title": "Master Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTM4X01hc3Rlcl9TZXJnZWFudF9QbGF0aW51bV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTM4X01hc3Rlcl9TZXJnZWFudF9QbGF0aW51bV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzOF9NYXN0ZXJfU2VyZ2VhbnRfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1224350
            }
        },
        160: {
            "title": "Master Sergeant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTM5X01hc3Rlcl9TZXJnZWFudF9QbGF0aW51bV9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTM5X01hc3Rlcl9TZXJnZWFudF9QbGF0aW51bV9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEzOV9NYXN0ZXJfU2VyZ2VhbnRfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1246850
            }
        },
        161: {
            "title": "Lieutenant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTU1X0xpZXV0ZW5hbnRfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTU1X0xpZXV0ZW5hbnRfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1NV9MaWV1dGVuYW50X1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1274350
            }
        },
        162: {
            "title": "Lieutenant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTU2X0xpZXV0ZW5hbnRfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTU2X0xpZXV0ZW5hbnRfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1Nl9MaWV1dGVuYW50X1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1294350
            }
        },
        163: {
            "title": "Lieutenant",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTU3X0xpZXV0ZW5hbnRfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTU3X0xpZXV0ZW5hbnRfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1N19MaWV1dGVuYW50X1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1319350
            }
        },
        164: {
            "title": "Captain",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTczX0NhcHRhaW5fUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTczX0NhcHRhaW5fUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3M19DYXB0YWluX1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1349350
            }
        },
        165: {
            "title": "Captain",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTc0X0NhcHRhaW5fUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTc0X0NhcHRhaW5fUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3NF9DYXB0YWluX1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1371850
            }
        },
        166: {
            "title": "Captain",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTc1X0NhcHRhaW5fUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTc1X0NhcHRhaW5fUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3NV9DYXB0YWluX1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1396850
            }
        },
        167: {
            "title": "Major",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTkxX01ham9yX1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTkxX01ham9yX1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5MV9NYWpvcl9QbGF0aW51bV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1429350
            }
        },
        168: {
            "title": "Major",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTkyX01ham9yX1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTkyX01ham9yX1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5Ml9NYWpvcl9QbGF0aW51bV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1451850
            }
        },
        169: {
            "title": "Major",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTkzX01ham9yX1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTkzX01ham9yX1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5M19NYWpvcl9QbGF0aW51bV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1479350
            }
        },
        170: {
            "title": "Lt Colonel",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjA5X0x0X0NvbG9uZWxfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjA5X0x0X0NvbG9uZWxfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIwOV9MdF9Db2xvbmVsX1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1516850
            }
        },
        171: {
            "title": "Lt Colonel",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjEwX0x0X0NvbG9uZWxfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjEwX0x0X0NvbG9uZWxfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxMF9MdF9Db2xvbmVsX1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1541850
            }
        },
        172: {
            "title": "Lt Colonel",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjExX0x0X0NvbG9uZWxfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjExX0x0X0NvbG9uZWxfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxMV9MdF9Db2xvbmVsX1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1571850
            }
        },
        173: {
            "title": "Colonel",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjI3X0NvbG9uZWxfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjI3X0NvbG9uZWxfUGxhdGludW1fSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyN19Db2xvbmVsX1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1611850
            }
        },
        174: {
            "title": "Colonel",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjI4X0NvbG9uZWxfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjI4X0NvbG9uZWxfUGxhdGludW1fSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyOF9Db2xvbmVsX1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1639350
            }
        },
        175: {
            "title": "Colonel",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjI5X0NvbG9uZWxfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjI5X0NvbG9uZWxfUGxhdGludW1fSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIyOV9Db2xvbmVsX1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1674350
            }
        },
        176: {
            "title": "Brigadier General",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjQ1X1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjQ1X1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0NV9CcmlnYWRpZXJfR2VuZXJhbF9QbGF0aW51bV9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1719350
            }
        },
        177: {
            "title": "Brigadier General",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjQ2X1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjQ2X1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0Nl9CcmlnYWRpZXJfR2VuZXJhbF9QbGF0aW51bV9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1749350
            }
        },
        178: {
            "title": "Brigadier General",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjQ3X1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjQ3X1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0N19CcmlnYWRpZXJfR2VuZXJhbF9QbGF0aW51bV9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1786850
            }
        },
        179: {
            "title": "General",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjYzX1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjYzX1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2M19HZW5lcmFsX1BsYXRpbnVtX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1834350
            }
        },
        180: {
            "title": "General",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjY0X1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjY0X1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2NF9HZW5lcmFsX1BsYXRpbnVtX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1866850
            }
        },
        181: {
            "title": "General",
            "subtitle": "Platinum",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjY1X1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjY1X1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2NV9HZW5lcmFsX1BsYXRpbnVtX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#3A2B3D",
                    "#675A68"
                ]
            },
            "properties": {
                "type": "Platinum",
                "threshold": 1906850
            }
        },
        182: {
            "title": "Cadet",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTRfQ2FkZXRfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTRfQ2FkZXRfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0X0NhZGV0X0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 1959350
            }
        },
        183: {
            "title": "Cadet",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTVfQ2FkZXRfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTVfQ2FkZXRfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1X0NhZGV0X0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 1979350
            }
        },
        184: {
            "title": "Cadet",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTZfQ2FkZXRfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTZfQ2FkZXRfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2X0NhZGV0X0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2004350
            }
        },
        185: {
            "title": "Private",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMzJfUHJpdmF0ZV9EaWFtb25kX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMzJfUHJpdmF0ZV9EaWFtb25kX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzMyX1ByaXZhdGVfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2036850
            }
        },
        186: {
            "title": "Private",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMzNfUHJpdmF0ZV9EaWFtb25kX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMzNfUHJpdmF0ZV9EaWFtb25kX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzMzX1ByaXZhdGVfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2059350
            }
        },
        187: {
            "title": "Private",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMzRfUHJpdmF0ZV9EaWFtb25kX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMzRfUHJpdmF0ZV9EaWFtb25kX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzM0X1ByaXZhdGVfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2086850
            }
        },
        188: {
            "title": "Lance Corporal",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNTBfTGFuY2VfQ29ycG9yYWxfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNTBfTGFuY2VfQ29ycG9yYWxfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzUwX0xhbmNlX0NvcnBvcmFsX0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2121850
            }
        },
        189: {
            "title": "Lance Corporal",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNTFfTGFuY2VfQ29ycG9yYWxfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNTFfTGFuY2VfQ29ycG9yYWxfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzUxX0xhbmNlX0NvcnBvcmFsX0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2146850
            }
        },
        190: {
            "title": "Lance Corporal",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNTJfTGFuY2VfQ29ycG9yYWxfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNTJfTGFuY2VfQ29ycG9yYWxfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzUyX0xhbmNlX0NvcnBvcmFsX0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2176850
            }
        },
        191: {
            "title": "Corporal",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNjhfQ29ycG9yYWxfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNjhfQ29ycG9yYWxfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzY4X0NvcnBvcmFsX0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2216850
            }
        },
        192: {
            "title": "Corporal",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNjlfQ29ycG9yYWxfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNjlfQ29ycG9yYWxfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzY5X0NvcnBvcmFsX0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2244350
            }
        },
        193: {
            "title": "Corporal",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNzBfQ29ycG9yYWxfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNzBfQ29ycG9yYWxfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzcwX0NvcnBvcmFsX0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2276850
            }
        },
        194: {
            "title": "Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvODZfU2VyZ2VhbnRfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvODZfU2VyZ2VhbnRfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzg2X1NlcmdlYW50X0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2319350
            }
        },
        195: {
            "title": "Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvODdfU2VyZ2VhbnRfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvODdfU2VyZ2VhbnRfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzg3X1NlcmdlYW50X0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2349350
            }
        },
        196: {
            "title": "Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvODhfU2VyZ2VhbnRfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvODhfU2VyZ2VhbnRfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzg4X1NlcmdlYW50X0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2384350
            }
        },
        197: {
            "title": "Staff Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTA0X1N0YWZmX1NlcmdlYW50X0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTA0X1N0YWZmX1NlcmdlYW50X0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwNF9TdGFmZl9TZXJnZWFudF9EaWFtb25kX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2431850
            }
        },
        198: {
            "title": "Staff Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTA1X1N0YWZmX1NlcmdlYW50X0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTA1X1N0YWZmX1NlcmdlYW50X0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwNV9TdGFmZl9TZXJnZWFudF9EaWFtb25kX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2464350
            }
        },
        199: {
            "title": "Staff Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTA2X1N0YWZmX1NlcmdlYW50X0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTA2X1N0YWZmX1NlcmdlYW50X0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwNl9TdGFmZl9TZXJnZWFudF9EaWFtb25kX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2504350
            }
        },
        200: {
            "title": "Gunnery Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTIyX0d1bm5lcnlfU2VyZ2VhbnRfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTIyX0d1bm5lcnlfU2VyZ2VhbnRfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyMl9HdW5uZXJ5X1NlcmdlYW50X0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2554350
            }
        },
        201: {
            "title": "Gunnery Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTIzX0d1bm5lcnlfU2VyZ2VhbnRfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTIzX0d1bm5lcnlfU2VyZ2VhbnRfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyM19HdW5uZXJ5X1NlcmdlYW50X0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2589350
            }
        },
        202: {
            "title": "Gunnery Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTI0X0d1bm5lcnlfU2VyZ2VhbnRfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTI0X0d1bm5lcnlfU2VyZ2VhbnRfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyNF9HdW5uZXJ5X1NlcmdlYW50X0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2631850
            }
        },
        203: {
            "title": "Master Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTQwX01hc3Rlcl9TZXJnZWFudF9EaWFtb25kX0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTQwX01hc3Rlcl9TZXJnZWFudF9EaWFtb25kX0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0MF9NYXN0ZXJfU2VyZ2VhbnRfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2686850
            }
        },
        204: {
            "title": "Master Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTQxX01hc3Rlcl9TZXJnZWFudF9EaWFtb25kX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTQxX01hc3Rlcl9TZXJnZWFudF9EaWFtb25kX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0MV9NYXN0ZXJfU2VyZ2VhbnRfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2726850
            }
        },
        205: {
            "title": "Master Sergeant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTQyX01hc3Rlcl9TZXJnZWFudF9EaWFtb25kX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTQyX01hc3Rlcl9TZXJnZWFudF9EaWFtb25kX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0Ml9NYXN0ZXJfU2VyZ2VhbnRfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2774350
            }
        },
        206: {
            "title": "Lieutenant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTU4X0xpZXV0ZW5hbnRfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTU4X0xpZXV0ZW5hbnRfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1OF9MaWV1dGVuYW50X0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2834350
            }
        },
        207: {
            "title": "Lieutenant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTU5X0xpZXV0ZW5hbnRfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTU5X0xpZXV0ZW5hbnRfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE1OV9MaWV1dGVuYW50X0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2876850
            }
        },
        208: {
            "title": "Lieutenant",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTYwX0xpZXV0ZW5hbnRfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTYwX0xpZXV0ZW5hbnRfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2MF9MaWV1dGVuYW50X0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2926850
            }
        },
        209: {
            "title": "Captain",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTc2X0NhcHRhaW5fRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTc2X0NhcHRhaW5fRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3Nl9DYXB0YWluX0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 2991850
            }
        },
        210: {
            "title": "Captain",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTc3X0NhcHRhaW5fRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTc3X0NhcHRhaW5fRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3N19DYXB0YWluX0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3039350
            }
        },
        211: {
            "title": "Captain",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTc4X0NhcHRhaW5fRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTc4X0NhcHRhaW5fRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3OF9DYXB0YWluX0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3094350
            }
        },
        212: {
            "title": "Major",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTk0X01ham9yX0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTk0X01ham9yX0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5NF9NYWpvcl9EaWFtb25kX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3166850
            }
        },
        213: {
            "title": "Major",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTk1X01ham9yX0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTk1X01ham9yX0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5NV9NYWpvcl9EaWFtb25kX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3216850
            }
        },
        214: {
            "title": "Major",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTk2X01ham9yX0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTk2X01ham9yX0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5Nl9NYWpvcl9EaWFtb25kX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3276850
            }
        },
        215: {
            "title": "Lt Colonel",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjEyX0x0X0NvbG9uZWxfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjEyX0x0X0NvbG9uZWxfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxMl9MdF9Db2xvbmVsX0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3356850
            }
        },
        216: {
            "title": "Lt Colonel",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjEzX0x0X0NvbG9uZWxfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjEzX0x0X0NvbG9uZWxfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxM19MdF9Db2xvbmVsX0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3411850
            }
        },
        217: {
            "title": "Lt Colonel",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjE0X0x0X0NvbG9uZWxfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjE0X0x0X0NvbG9uZWxfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxNF9MdF9Db2xvbmVsX0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3476850
            }
        },
        218: {
            "title": "Colonel",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjMwX0NvbG9uZWxfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjMwX0NvbG9uZWxfRGlhbW9uZF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzMF9Db2xvbmVsX0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3561850
            }
        },
        219: {
            "title": "Colonel",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjMxX0NvbG9uZWxfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjMxX0NvbG9uZWxfRGlhbW9uZF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzMV9Db2xvbmVsX0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3621850
            }
        },
        220: {
            "title": "Colonel",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjMyX0NvbG9uZWxfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjMyX0NvbG9uZWxfRGlhbW9uZF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzMl9Db2xvbmVsX0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3694350
            }
        },
        221: {
            "title": "Brigadier General",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjQ4X0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjQ4X0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0OF9CcmlnYWRpZXJfR2VuZXJhbF9EaWFtb25kX0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3789350
            }
        },
        222: {
            "title": "Brigadier General",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjQ5X0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjQ5X0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI0OV9CcmlnYWRpZXJfR2VuZXJhbF9EaWFtb25kX0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3854350
            }
        },
        223: {
            "title": "Brigadier General",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjUwX0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjUwX0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1MF9CcmlnYWRpZXJfR2VuZXJhbF9EaWFtb25kX0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 3934350
            }
        },
        224: {
            "title": "General",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjY2X0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjY2X0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2Nl9HZW5lcmFsX0RpYW1vbmRfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 4034350
            }
        },
        225: {
            "title": "General",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjY3X0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjY3X0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2N19HZW5lcmFsX0RpYW1vbmRfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 4106850
            }
        },
        226: {
            "title": "General",
            "subtitle": "Diamond",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjY4X0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjY4X0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2OF9HZW5lcmFsX0RpYW1vbmRfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#5A73DF",
                    "#89ABFF"
                ]
            },
            "properties": {
                "type": "Diamond",
                "threshold": 4191850
            }
        },
        227: {
            "title": "Cadet",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTdfQ2FkZXRfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTdfQ2FkZXRfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3X0NhZGV0X09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4291850
            }
        },
        228: {
            "title": "Cadet",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMThfQ2FkZXRfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMThfQ2FkZXRfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4X0NhZGV0X09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4336850
            }
        },
        229: {
            "title": "Cadet",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTlfQ2FkZXRfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjE5X0NhZGV0X09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5X0NhZGV0X09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4391850
            }
        },
        230: {
            "title": "Private",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMzVfUHJpdmF0ZV9Pbnl4X0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMzVfUHJpdmF0ZV9Pbnl4X0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzM1X1ByaXZhdGVfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4461850
            }
        },
        231: {
            "title": "Private",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMzZfUHJpdmF0ZV9Pbnl4X0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMzZfUHJpdmF0ZV9Pbnl4X0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzM2X1ByaXZhdGVfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4511850
            }
        },
        232: {
            "title": "Private",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMzdfUHJpdmF0ZV9Pbnl4X0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMzdfUHJpdmF0ZV9Pbnl4X0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzM3X1ByaXZhdGVfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4569350
            }
        },
        233: {
            "title": "Lance Corporal",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNTNfTGFuY2VfQ29ycG9yYWxfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNTNfTGFuY2VfQ29ycG9yYWxfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzUzX0xhbmNlX0NvcnBvcmFsX09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4646850
            }
        },
        234: {
            "title": "Lance Corporal",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNTRfTGFuY2VfQ29ycG9yYWxfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNTRfTGFuY2VfQ29ycG9yYWxfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzU0X0xhbmNlX0NvcnBvcmFsX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4699350
            }
        },
        235: {
            "title": "Lance Corporal",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNTVfTGFuY2VfQ29ycG9yYWxfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNTVfTGFuY2VfQ29ycG9yYWxfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzU1X0xhbmNlX0NvcnBvcmFsX09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4764350
            }
        },
        236: {
            "title": "Corporal",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNzFfQ29ycG9yYWxfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNzFfQ29ycG9yYWxfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzcxX0NvcnBvcmFsX09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4846850
            }
        },
        237: {
            "title": "Corporal",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNzJfQ29ycG9yYWxfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNzJfQ29ycG9yYWxfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzcyX0NvcnBvcmFsX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4904350
            }
        },
        238: {
            "title": "Corporal",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvNzNfQ29ycG9yYWxfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvNzNfQ29ycG9yYWxfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzczX0NvcnBvcmFsX09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 4974350
            }
        },
        239: {
            "title": "Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvODlfU2VyZ2VhbnRfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvODlfU2VyZ2VhbnRfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50Lzg5X1NlcmdlYW50X09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5064350
            }
        },
        240: {
            "title": "Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOTBfU2VyZ2VhbnRfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOTBfU2VyZ2VhbnRfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzkwX1NlcmdlYW50X09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5126850
            }
        },
        241: {
            "title": "Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvOTFfU2VyZ2VhbnRfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvOTFfU2VyZ2VhbnRfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzkxX1NlcmdlYW50X09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5204350
            }
        },
        242: {
            "title": "Staff Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTA3X1N0YWZmX1NlcmdlYW50X09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTA3X1N0YWZmX1NlcmdlYW50X09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwN19TdGFmZl9TZXJnZWFudF9Pbnl4X0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5304350
            }
        },
        243: {
            "title": "Staff Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTA4X1N0YWZmX1NlcmdlYW50X09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTA4X1N0YWZmX1NlcmdlYW50X09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwOF9TdGFmZl9TZXJnZWFudF9Pbnl4X0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5374350
            }
        },
        244: {
            "title": "Staff Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTA5X1N0YWZmX1NlcmdlYW50X09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTA5X1N0YWZmX1NlcmdlYW50X09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEwOV9TdGFmZl9TZXJnZWFudF9Pbnl4X0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5456850
            }
        },
        245: {
            "title": "Gunnery Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTI1X0d1bm5lcnlfU2VyZ2VhbnRfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTI1X0d1bm5lcnlfU2VyZ2VhbnRfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyNV9HdW5uZXJ5X1NlcmdlYW50X09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5556850
            }
        },
        246: {
            "title": "Gunnery Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTI2X0d1bm5lcnlfU2VyZ2VhbnRfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTI2X0d1bm5lcnlfU2VyZ2VhbnRfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyNl9HdW5uZXJ5X1NlcmdlYW50X09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5631850
            }
        },
        247: {
            "title": "Gunnery Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTI3X0d1bm5lcnlfU2VyZ2VhbnRfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTI3X0d1bm5lcnlfU2VyZ2VhbnRfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzEyN19HdW5uZXJ5X1NlcmdlYW50X09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5721850
            }
        },
        248: {
            "title": "Master Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTQzX01hc3Rlcl9TZXJnZWFudF9Pbnl4X0kucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTQzX01hc3Rlcl9TZXJnZWFudF9Pbnl4X0kucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0M19NYXN0ZXJfU2VyZ2VhbnRfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5846850
            }
        },
        249: {
            "title": "Master Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTQ0X01hc3Rlcl9TZXJnZWFudF9Pbnl4X0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTQ0X01hc3Rlcl9TZXJnZWFudF9Pbnl4X0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0NF9NYXN0ZXJfU2VyZ2VhbnRfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 5929350
            }
        },
        250: {
            "title": "Master Sergeant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTQ1X01hc3Rlcl9TZXJnZWFudF9Pbnl4X0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTQ1X01hc3Rlcl9TZXJnZWFudF9Pbnl4X0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE0NV9NYXN0ZXJfU2VyZ2VhbnRfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 6029350
            }
        },
        251: {
            "title": "Lieutenant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTYxX0xpZXV0ZW5hbnRfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTYxX0xpZXV0ZW5hbnRfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2MV9MaWV1dGVuYW50X09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 6154350
            }
        },
        252: {
            "title": "Lieutenant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTYyX0xpZXV0ZW5hbnRfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTYyX0xpZXV0ZW5hbnRfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2Ml9MaWV1dGVuYW50X09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 6244350
            }
        },
        253: {
            "title": "Lieutenant",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTYzX0xpZXV0ZW5hbnRfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTYzX0xpZXV0ZW5hbnRfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE2M19MaWV1dGVuYW50X09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 6344350
            }
        },
        254: {
            "title": "Captain",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTc5X0NhcHRhaW5fT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTc5X0NhcHRhaW5fT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE3OV9DYXB0YWluX09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 6494350
            }
        },
        255: {
            "title": "Captain",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTgwX0NhcHRhaW5fT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTgwX0NhcHRhaW5fT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4MF9DYXB0YWluX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 6594350
            }
        },
        256: {
            "title": "Captain",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTgxX0NhcHRhaW5fT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTgxX0NhcHRhaW5fT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE4MV9DYXB0YWluX09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 6719350
            }
        },
        257: {
            "title": "Major",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTk3X01ham9yX09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTk3X01ham9yX09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5N19NYWpvcl9Pbnl4X0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 6869350
            }
        },
        258: {
            "title": "Major",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTk4X01ham9yX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTk4X01ham9yX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5OF9NYWpvcl9Pbnl4X0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 6969350
            }
        },
        259: {
            "title": "Major",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMTk5X01ham9yX09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMTk5X01ham9yX09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzE5OV9NYWpvcl9Pbnl4X0lJSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 7094350
            }
        },
        260: {
            "title": "Lt Colonel",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjE1X0x0X0NvbG9uZWxfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjE1X0x0X0NvbG9uZWxfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxNV9MdF9Db2xvbmVsX09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 7269350
            }
        },
        261: {
            "title": "Lt Colonel",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjE2X0x0X0NvbG9uZWxfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjE2X0x0X0NvbG9uZWxfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxNl9MdF9Db2xvbmVsX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 7394350
            }
        },
        262: {
            "title": "Lt Colonel",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjE3X0x0X0NvbG9uZWxfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjE3X0x0X0NvbG9uZWxfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIxN19MdF9Db2xvbmVsX09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 7544350
            }
        },
        263: {
            "title": "Colonel",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjMzX0NvbG9uZWxfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjMzX0NvbG9uZWxfT255eF9JLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzM19Db2xvbmVsX09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 7719350
            }
        },
        264: {
            "title": "Colonel",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjM0X0NvbG9uZWxfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjM0X0NvbG9uZWxfT255eF9JSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzNF9Db2xvbmVsX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 7844350
            }
        },
        265: {
            "title": "Colonel",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjM1X0NvbG9uZWxfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjM1X0NvbG9uZWxfT255eF9JSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzIzNV9Db2xvbmVsX09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 7994350
            }
        },
        266: {
            "title": "Brigadier General",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjUxX09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjUxX09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1MV9CcmlnYWRpZXJfR2VuZXJhbF9Pbnl4X0kucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 8194350
            }
        },
        267: {
            "title": "Brigadier General",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjUyX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjUyX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1Ml9CcmlnYWRpZXJfR2VuZXJhbF9Pbnl4X0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 8344350
            }
        },
        268: {
            "title": "Brigadier General",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjUyX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjUyX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI1Ml9CcmlnYWRpZXJfR2VuZXJhbF9Pbnl4X0lJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 8519350
            }
        },
        269: {
            "title": "General",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjY5X09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjY5X09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI2OV9HZW5lcmFsX09ueXhfSS5wbmciLCJvcHRpb25zIjp7fX0%3D"
            },
            "attributes": {
                "tier": 1,
                "grade": 1,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 8744350
            }
        },
        270: {
            "title": "General",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjcwX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjcwX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI3MF9HZW5lcmFsX09ueXhfSUkucG5nIiwib3B0aW9ucyI6e319"
            },
            "attributes": {
                "tier": 2,
                "grade": 2,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 8894350
            }
        },
        271: {
            "title": "General",
            "subtitle": "Onyx",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjcxX09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjcxX09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI3MV9HZW5lcmFsX09ueXhfSUlJLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": 3,
                "grade": 3,
                "colors": [
                    "#1D102B",
                    "#452165"
                ]
            },
            "properties": {
                "type": "Onyx",
                "threshold": 9069350
            }
        },
        272: {
            "title": "Hero",
            "subtitle": "",
            "image_urls": {
                "icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvUHJvZ3Jlc3NXaWRnZXQvMjcyX0hlcm8ucG5nIiwib3B0aW9ucyI6e319",
                "large_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvQ2VsZWJyYXRpb25Nb21lbnQvMjcyX0hlcm8ucG5nIiwib3B0aW9ucyI6e319",
                "adornment_icon": "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiY2FyZWVyX3JhbmsvTmFtZXBsYXRlQWRvcm5tZW50LzI3Ml9IZXJvLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D"
            },
            "attributes": {
                "tier": null,
                "grade": 1,
                "colors": [
                    "#C0A46E",
                    "#EFD588"
                ]
            },
            "properties": {
                "type": "Hero",
                "threshold": 9319350
            }
        }
}