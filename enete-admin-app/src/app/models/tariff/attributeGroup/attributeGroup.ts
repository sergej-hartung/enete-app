import { Attribute } from "../attribute/attribute";


export interface AttributeGroupData {
    data: AttributeGroup[];
}

export interface AttributeGroup {
    id: number
    name: string,
    tariff_id: number,
    uniqueId?: string,
    attributs: Attribute[],
    // created_by: number,
    // updated_by: number,
    // created_at: string,
    // updated_at: string
}

