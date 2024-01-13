import {UserLogin} from '../user-login'
import {UserProfilStatus} from '../user-profil-status'

export interface PartnerData {
    data: Partner[];
}

export interface Partner {
    id: number;
    vp_nr: string;
    last_name: string;
    first_name: string;
    users: UserLogin[]|string;
    status: UserProfilStatus|string;
    selected?: boolean;
}

