import {UserLogin} from './user-login'
import {UserProfilStatus} from './user-profil-status'

export interface PartnerData {
    data: Partner[];
}

export interface Partner {
    id: number;
    gpNr: string;
    last_name: string;
    first_name: string;
    accesses: UserLogin[]|string;
    status: UserProfilStatus|string;
    selected?: boolean;
}

