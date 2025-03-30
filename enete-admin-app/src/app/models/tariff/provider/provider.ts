export interface ProviderData {
    data: Provider[];
}

export interface Provider {
    id:                  number;
    name:                string;
    logo_id:             number;
    file_name?:          string;
    is_filled_on_site?:  boolean;
    is_filled_on_site_text?: string;
    external_fill_link?: string;
    tariff_group_ids?:   number[];
    created_at?:         string, 
    updated_at?:         string,             
    created_by?:         number,
    updated_by?:         number
}

