export class Halo5Converter
{
    /**
     * Gets the Halo 5 SR level from the total Halo Infinite score
     * @param score the total score
     * @returns Halo 5 SR level
     */
    public static GetLevelFromScore(score: number): string
    {
        return "SR" + this.GetNumericLevelFromScore(score);
    }

    /**
     * Gets the Halo 5 SR level from the total Halo Infinite score
     * @param score the total score
     * @returns Halo 5 SR level
     */
    public static GetNumericLevelFromScore(score: number): number
    {
        if (score >= 50000000) { return 152; }
        if (score >= 35000000) { return 151; }
        if (score >= 24000000) { return 150; }
        if (score >= 18000000) { return 149; }
        if (score >= 14000000) { return 148; }
        if (score >= 11050000) { return 147; }
        if (score >= 9000000) { return 146; }
        if (score >= 7750000) { return 145; }
        if (score >= 7050000) { return 144; }
        if (score >= 6800000) { return 143; }
        if (score >= 6615000) { return 142; }
        if (score >= 6460000) { return 141; }
        if (score >= 6325000) { return 140; }
        if (score >= 6200000) { return 139; }
        if (score >= 6085000) { return 138; }
        if (score >= 5980000) { return 137; }
        if (score >= 5880000) { return 136; }
        if (score >= 5790000) { return 135; }
        if (score >= 5710000) { return 134; }
        if (score >= 5640000) { return 133; }
        if (score >= 5575000) { return 132; }
        if (score >= 5520000) { return 131; }
        if (score >= 5475000) { return 130; }
        if (score >= 5330000) { return 129; }
        if (score >= 5220000) { return 128; }
        if (score >= 5120000) { return 127; }
        if (score >= 5025000) { return 126; }
        if (score >= 4935000) { return 125; }
        if (score >= 4845000) { return 124; }
        if (score >= 4765000) { return 123; }
        if (score >= 4690000) { return 122; }
        if (score >= 4620000) { return 121; }
        if (score >= 4555000) { return 120; }
        if (score >= 4495000) { return 119; }
        if (score >= 4440000) { return 118; }
        if (score >= 4395000) { return 117; }
        if (score >= 4355000) { return 116; }
        if (score >= 4320000) { return 115; }
        if (score >= 4200000) { return 114; }
        if (score >= 4090000) { return 113; }
        if (score >= 3995000) { return 112; }
        if (score >= 3905000) { return 111; }
        if (score >= 3820000) { return 110; }
        if (score >= 3740000) { return 109; }
        if (score >= 3665000) { return 108; }
        if (score >= 3595000) { return 107; }
        if (score >= 3530000) { return 106; }
        if (score >= 3470000) { return 105; }
        if (score >= 3420000) { return 104; }
        if (score >= 3375000) { return 103; }
        if (score >= 3335000) { return 102; }
        if (score >= 3300000) { return 101; }
        if (score >= 3270000) { return 100; }
        if (score >= 3180000) { return 99; }
        if (score >= 3095000) { return 98; }
        if (score >= 3015000) { return 97; }
        if (score >= 2940000) { return 96; }
        if (score >= 2870000) { return 95; }
        if (score >= 2805000) { return 94; }
        if (score >= 2745000) { return 93; }
        if (score >= 2690000) { return 92; }
        if (score >= 2640000) { return 91; }
        if (score >= 2595000) { return 90; }
        if (score >= 2555000) { return 89; }
        if (score >= 2520000) { return 88; }
        if (score >= 2490000) { return 87; }
        if (score >= 2465000) { return 86; }
        if (score >= 2440000) { return 85; }
        if (score >= 2355000) { return 84; }
        if (score >= 2275000) { return 83; }
        if (score >= 2205000) { return 82; }
        if (score >= 2140000) { return 81; }
        if (score >= 2080000) { return 80; }
        if (score >= 2025000) { return 79; }
        if (score >= 1975000) { return 78; }
        if (score >= 1930000) { return 77; }
        if (score >= 1885000) { return 76; }
        if (score >= 1845000) { return 75; }
        if (score >= 1810000) { return 74; }
        if (score >= 1780000) { return 73; }
        if (score >= 1755000) { return 72; }
        if (score >= 1735000) { return 71; }
        if (score >= 1720000) { return 70; }
        if (score >= 1645000) { return 69; }
        if (score >= 1580000) { return 68; }
        if (score >= 1520000) { return 67; }
        if (score >= 1465000) { return 66; }
        if (score >= 1415000) { return 65; }
        if (score >= 1365000) { return 64; }
        if (score >= 1320000) { return 63; }
        if (score >= 1280000) { return 62; }
        if (score >= 1245000) { return 61; }
        if (score >= 1210000) { return 60; }
        if (score >= 1180000) { return 59; }
        if (score >= 1155000) { return 58; }
        if (score >= 1135000) { return 57; }
        if (score >= 1115000) { return 56; }
        if (score >= 1100000) { return 55; }
        if (score >= 1035000) { return 54; }
        if (score >= 975500) { return 53; }
        if (score >= 922000) { return 52; }
        if (score >= 873000) { return 51; }
        if (score >= 828000) { return 50; }
        if (score >= 786500) { return 49; }
        if (score >= 748500) { return 48; }
        if (score >= 713500) { return 47; }
        if (score >= 682000) { return 46; }
        if (score >= 654000) { return 45; }
        if (score >= 629000) { return 44; }
        if (score >= 607500) { return 43; }
        if (score >= 589000) { return 42; }
        if (score >= 574000) { return 41; }
        if (score >= 562000) { return 40; }
        if (score >= 525500) { return 39; }
        if (score >= 493000) { return 38; }
        if (score >= 464000) { return 37; }
        if (score >= 438000) { return 36; }
        if (score >= 414500) { return 35; }
        if (score >= 394000) { return 34; }
        if (score >= 376500) { return 33; }
        if (score >= 361500) { return 32; }
        if (score >= 349500) { return 31; }
        if (score >= 340000) { return 30; }
        if (score >= 310000) { return 29; }
        if (score >= 282500) { return 28; }
        if (score >= 258000) { return 27; }
        if (score >= 236000) { return 26; }
        if (score >= 217000) { return 25; }
        if (score >= 201000) { return 24; }
        if (score >= 187500) { return 23; }
        if (score >= 176000) { return 22; }
        if (score >= 167000) { return 21; }
        if (score >= 160000) { return 20; }
        if (score >= 137000) { return 19; }
        if (score >= 118000) { return 18; }
        if (score >= 101500) { return 17; }
        if (score >= 87000) { return 16; }
        if (score >= 74500) { return 15; }
        if (score >= 63500) { return 14; }
        if (score >= 54500) { return 13; }
        if (score >= 47000) { return 12; }
        if (score >= 41000) { return 11; }
        if (score >= 37000) { return 10; }
        if (score >= 28500) { return 9; }
        if (score >= 22500) { return 8; }
        if (score >= 17500) { return 7; }
        if (score >= 13700) { return 6; }
        if (score >= 10700) { return 5; }
        if (score >= 6600) { return 4; }
        if (score >= 3600) { return 3; }
        if (score >= 300) { return 2; }
        if (score >= 0) { return 1; }

        return 0;
    }

     /**
     * Gets the Halo 5 SR level from the total Halo Infinite score
     * @param score the total score
     * @returns Halo 5 SR level
     */
    public static GetScoreNeededForLevel(level: number): number
    {
        if (level === 152) { return 50000000; }
        if (level === 151) { return 35000000; }
        if (level === 150) { return 24000000; }
        if (level === 149) { return 18000000; }
        if (level === 148) { return 14000000; }
        if (level === 147) { return 11050000; }
        if (level === 146) { return 9000000; }
        if (level === 145) { return 7750000; }
        if (level === 144) { return 7050000; }
        if (level === 143) { return 6800000; }
        if (level === 142) { return 6615000; }
        if (level === 141) { return 6460000; }
        if (level === 140) { return 6325000; }
        if (level === 139) { return 6200000; }
        if (level === 138) { return 6085000; }
        if (level === 137) { return 5980000; }
        if (level === 136) { return 5880000; }
        if (level === 135) { return 5790000; }
        if (level === 134) { return 5710000; }
        if (level === 133) { return 5640000; }
        if (level === 132) { return 5575000; }
        if (level === 131) { return 5520000; }
        if (level === 130) { return 5475000; }
        if (level === 129) { return 5330000; }
        if (level === 128) { return 5220000; }
        if (level === 127) { return 5120000; }
        if (level === 126) { return 5025000; }
        if (level === 125) { return 4935000; }
        if (level === 124) { return 4845000; }
        if (level === 123) { return 4765000; }
        if (level === 122) { return 4690000; }
        if (level === 121) { return 4620000; }
        if (level === 120) { return 4555000; }
        if (level === 119) { return 4495000; }
        if (level === 118) { return 4440000; }
        if (level === 117) { return 4395000; }
        if (level === 116) { return 4355000; }
        if (level === 115) { return 4320000; }
        if (level === 114) { return 4200000; }
        if (level === 113) { return 4090000; }
        if (level === 112) { return 3995000; }
        if (level === 111) { return 3905000; }
        if (level === 110) { return 3820000; }
        if (level === 109) { return 3740000; }
        if (level === 108) { return 3665000; }
        if (level === 107) { return 3595000; }
        if (level === 106) { return 3530000; }
        if (level === 105) { return 3470000; }
        if (level === 104) { return 3420000; }
        if (level === 103) { return 3375000; }
        if (level === 102) { return 3335000; }
        if (level === 101) { return 3300000; }
        if (level === 100) { return 3270000; }
        if (level === 99) { return 3180000; }
        if (level === 98) { return 3095000; }
        if (level === 97) { return 3015000; }
        if (level === 96) { return 2940000; }
        if (level === 95) { return 2870000; }
        if (level === 94) { return 2805000; }
        if (level === 93) { return 2745000; }
        if (level === 92) { return 2690000; }
        if (level === 91) { return 2640000; }
        if (level === 90) { return 2595000; }
        if (level === 89) { return 2555000; }
        if (level === 88) { return 2520000; }
        if (level === 87) { return 2490000; }
        if (level === 86) { return 2465000; }
        if (level === 85) { return 2440000; }
        if (level === 84) { return 2355000; }
        if (level === 83) { return 2275000; }
        if (level === 82) { return 2205000; }
        if (level === 81) { return 2140000; }
        if (level === 80) { return 2080000; }
        if (level === 79) { return 2025000; }
        if (level === 78) { return 1975000; }
        if (level === 77) { return 1930000; }
        if (level === 76) { return 1885000; }
        if (level === 75) { return 1845000; }
        if (level === 74) { return 1810000; }
        if (level === 73) { return 1780000; }
        if (level === 72) { return 1755000; }
        if (level === 71) { return 1735000; }
        if (level === 70) { return 1720000; }
        if (level === 69) { return 1645000; }
        if (level === 68) { return 1580000; }
        if (level === 67) { return 1520000; }
        if (level === 66) { return 1465000; }
        if (level === 65) { return 1415000; }
        if (level === 64) { return 1365000; }
        if (level === 63) { return 1320000; }
        if (level === 62) { return 1280000; }
        if (level === 61) { return 1245000; }
        if (level === 60) { return 1210000; }
        if (level === 59) { return 1180000; }
        if (level === 58) { return 1155000; }
        if (level === 57) { return 1135000; }
        if (level === 56) { return 1115000; }
        if (level === 55) { return 1100000; }
        if (level === 54) { return 1035000; }
        if (level === 53) { return 975500; }
        if (level === 52) { return 922000; }
        if (level === 51) { return 873000; }
        if (level === 50) { return 828000; }
        if (level === 49) { return 786500; }
        if (level === 48) { return 748500; }
        if (level === 47) { return 713500; }
        if (level === 46) { return 682000; }
        if (level === 45) { return 654000; }
        if (level === 44) { return 629000; }
        if (level === 43) { return 607500; }
        if (level === 42) { return 589000; }
        if (level === 41) { return 574000; }
        if (level === 40) { return 562000; }
        if (level === 39) { return 525500; }
        if (level === 38) { return 493000; }
        if (level === 37) { return 464000; }
        if (level === 36) { return 438000; }
        if (level === 35) { return 414500; }
        if (level === 34) { return 394000; }
        if (level === 33) { return 376500; }
        if (level === 32) { return 361500; }
        if (level === 31) { return 349500; }
        if (level === 30) { return 340000; }
        if (level === 29) { return 310000; }
        if (level === 28) { return 282500; }
        if (level === 27) { return 258000; }
        if (level === 26) { return 236000; }
        if (level === 25) { return 217000; }
        if (level === 24) { return 201000; }
        if (level === 23) { return 187500; }
        if (level === 22) { return 176000; }
        if (level === 21) { return 167000; }
        if (level === 20) { return 160000; }
        if (level === 19) { return 137000; }
        if (level === 18) { return 118000; }
        if (level === 17) { return 101500; }
        if (level === 16) { return 87000; }
        if (level === 15) { return 74500; }
        if (level === 14) { return 63500; }
        if (level === 13) { return 54500; }
        if (level === 12) { return 47000; }
        if (level === 11) { return 41000; }
        if (level === 10) { return 37000; }
        if (level === 9) { return 28500; }
        if (level === 8) { return 22500; }
        if (level === 7) { return 17500; }
        if (level === 6) { return 13700; }
        if (level === 5) { return 10700; }
        if (level === 4) { return 6600; }
        if (level === 3) { return 3600; }
        if (level === 2) { return 300; }
        if (level === 1) { return 0; }

        return 0;
    }
}