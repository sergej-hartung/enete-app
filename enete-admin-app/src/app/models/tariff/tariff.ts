import { Attribute } from "./attribute/attribute";
import { AttributeGroup } from "./attributeGroup/attributeGroup";
import { Category } from "./category/category";
import { ComboStatus } from "./comboStatus/comboStatus";

export interface TariffData {
    data: Tariff[];
}

export interface TariffDetailedData {
    data: Tariff;
}

export interface Tariff {
    id: number;
    external_id: string;
    action_group_id: number;
    has_action: boolean
    group_id: number;
    name: string;
    name_short: string;
    icon: string;
    provider: Tariffprovider;
    network_operator: TariffNetworkOperator;
    status: TariffStatus;
    is_published: boolean;
    file_id: number;
    note: string;
    calc_matrix?: CalcMatrix[];
    attribute_groups?: AttributeGroup[];
    combo_status?: ComboStatus[];
    tariff_categories?: Category[];
    document?: TariffDocument;
    promos?: Promo[]
    tpl?: Template[]
    tariffdetails: TariffDetail[]
    
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

export interface Promo{
    id: number | null;
    tariff_id: number | null;
    start_date: string;
    end_date: string;
    text_long: string;
    title: string;
    is_active: boolean | number;
}

export interface Template{
    id:              number | null;
    customFild:      boolean | number;
    isMatrix:        boolean | number;
    position:        number;
    icon:            string;

    autoFieldName:   boolean | number;
    autoUnit:        boolean | number;
    autoValueSource: boolean | number;

    manualFieldName: string;
    manualUnit:      string;
    isHtml:          boolean | number;
    manualValueHtml: string;
    manualValue:     string;
    
    showFieldName:   boolean | number;
    showIcon:        boolean | number;
    showUnit:        boolean | number;
    showValue:       boolean | number;

    attribute?:      Attribute
    matrix?:      CalcMatrix
}

export interface TemplateResult{
    id:                number | null;
    custom_field:      boolean | number;
    is_matrix:         boolean | number;
    position:          number;
    icon:              string;

    auto_field_name:   boolean | number;
    auto_unit:         boolean | number;
    auto_value_source: boolean | number;

    manual_field_name: string;
    manual_unit:       string;
    is_html:           boolean | number;
    manual_value_html: string;
    manual_value:      string;
    
    show_field_name:   boolean | number;
    show_icon:         boolean | number;
    show_unit:         boolean | number;
    show_value:        boolean | number;

    attribute?:        Attribute
    matrix?:           CalcMatrix
}

export interface TariffDetail{
    id: number | null;
    tariffAttributeGroupId: number | null;
    name: string;
    uniqueId: string;
    attributs: Attribute[]
}

export interface CalcMatrix{
    id: number,
    uniqueId: string
    tariff_id: number,
    name: string,
    total_value: string,
    unit: string,
    attributs: calcMatrixAttr[]
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string
}

export interface calcMatrixAttr{
    id: number,
    code: string,
    name: string,
    period: string,
    periodeTyp: string,
    single: number,
    unit: string,
    value: string,
    value_total: string
}

interface Tariffprovider{
    id: number;
    name: string;
    logo: string;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string
}

interface TariffNetworkOperator{
    id: number;
    name: string;
    logo: string;
    created_by: number;
    updated_by: number
    created_at: string;
    updated_at: string;
}

interface TariffStatus{
    id: number;
    name: string;
    icon: string;
    color: string;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

export interface TariffDocument{
    id:         number,
    original_name: string,
    path:       string,
    mime_type:  string
    size:       number,
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}