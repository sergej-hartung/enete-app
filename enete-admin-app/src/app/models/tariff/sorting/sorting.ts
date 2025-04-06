export interface SortingData {
    data: Sorting[];
}

export interface Sorting {
    id: number;
    name: string;
    description: string;
    tariff_group_ids?:   number[];
    created_at?:         string, 
    updated_at?:         string,             
    created_by?:         number,
    updated_by?:         number
}