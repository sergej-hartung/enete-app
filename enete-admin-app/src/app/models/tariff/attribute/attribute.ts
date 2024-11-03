export interface AttributeData {
    data: Attribute[];
}

export interface Attribute {
    id: number;
    code?: string,
    name?: string;
    input_type_id?: number;
    input_type?: string,
    unit?: string | null,
    is_system?: number,
    is_required?: number,
    is_frontend_visible?: number | boolean,
    details?: string | null,
    isCopied?: boolean
    pivot?: Pivot
    isFocused?: boolean;
    isActiveDisabled?: boolean | number;
    value_varchar?: string | undefined
    value_text?: string | undefined
    is_active?: number | boolean

    // value?: string | number;
    // value_total?: string | number
    // single?: number | boolean
    // periodeTyp?: string
    // period?: string
}

interface Pivot{
    attribute_group_id: number,
    attribute_id: number,
    value_varchar: string | null,
    value_text: string | null,
    is_active: number,
    position: number
}