export interface AttributeData {
    data: Attribute[];
}

export interface Attribute {
    id: number;
    code: string,
    name: string;
    input_type_id: number;
    input_type: string,
    unit: string | null,
    is_system: number,
    is_required: number,
    is_frontend_visible: number,
    details: JSON | null
}

