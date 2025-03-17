declare module "sap/cards/ap/generator/odata/ODataTypes" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    type PropertyInfo = {
        textArrangement?: string;
        label: string;
        type: string;
        name: string;
        UOM?: string;
        isDate?: boolean;
        value?: string;
        labelWithValue?: string;
        properties?: [];
        category?: string;
        kind: string;
    };
    enum PropertyInfoType {
        Property = "Property",
        NavigationProperty = "NavigationProperty"
    }
    type PropertyInfoMap = Array<PropertyInfo>;
}
//# sourceMappingURL=ODataTypes.d.ts.map