export interface NetworkOperatorData {
    data: NetworkOperator[];
}

export interface NetworkOperator {
    id:                  number;
    name:                string;
    logo_id:             number;
    file_name?:          string;
    tariff_group_ids?:   number[];
    created_at?:         string, 
    updated_at?:         string,             
    created_by?:         number,
    updated_by?:         number
}

