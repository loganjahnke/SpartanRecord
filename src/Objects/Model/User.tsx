import { Company } from "./Company";
import { Player } from "./Player";
import { Auth } from "firebase/auth";

export class User
{
    public id?: string;
    public company?: Company;
    public player?: Player;
    public isLoggedIn: boolean = false;
    public auth: Auth;

    constructor(auth: Auth)
    {
        this.auth = auth;
    }
}