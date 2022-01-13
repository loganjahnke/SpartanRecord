import { SpartanCompany } from "./SpartanCompany";
import { Player } from "./Player";
import { Auth, User } from "firebase/auth";

export class ArrowheadUser
{
    public spartanCompany?: SpartanCompany;
    public player?: Player;
    public user?: User;

    constructor()
    {
    }
}