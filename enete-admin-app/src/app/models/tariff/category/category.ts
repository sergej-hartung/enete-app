export interface CategoryData {
    data: Category[];
}

export interface Category {
    id: number;
    name: string;
    is_filter_active: number;
    checked?: boolean
}

