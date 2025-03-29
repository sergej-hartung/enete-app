export interface ProviderData {
    data: Provider[];
}

export interface Provider {
    id:                  number;
    name:                string;
    logo_id:             number;
    is_filled_on_site?:  boolean;
    external_fill_link?: string;
    tariff_group_ids?:   []
    created_at?:         string, 
    updated_at?:         string,             
    created_by?:         number,
    updated_by?:         number
}

