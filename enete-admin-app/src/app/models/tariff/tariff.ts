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
    name: string;
    name_short: string;
    icon: string;
    provider: Tariffprovider;
    network_operator: TariffNetworkOperator;
    status: TariffStatus;
    is_published: boolean;
    file_id: number;
    calc_matrix?: CalcMatrix[];
    attribute_groups?: AttributeGroup[];
    combo_status?: ComboStatus[];
    tariff_categories?: Category[];
    document?: TariffDocument;
    tpl?: Template[]
    
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
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
    manualValue:     string;
    
    showFieldName:   boolean | number;
    showIcon:        boolean | number;
    showUnit:        boolean | number;
    showValue:       boolean | number;

    attribute?:      Attribute
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