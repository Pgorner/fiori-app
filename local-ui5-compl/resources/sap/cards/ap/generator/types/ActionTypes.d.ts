declare module "sap/cards/ap/generator/types/ActionTypes" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    type ControlProperties = {
        title: string;
        titleKey: string;
        style?: string;
        enablePathKey?: string;
        isStyleControlEnabled?: boolean;
        isConfirmationRequired?: boolean;
        triggerActionText?: string;
    };
    type AnnotationAction = {
        label: string;
        action: string;
        enablePath: string;
        isConfirmationRequired: boolean;
    };
    type ActionStyles = {
        name: string;
        label: string;
        labelWithValue: string;
    };
    type EnableProperty = {
        label: string;
        value: string;
        name?: string;
        labelWithValue?: string;
    };
    type CriticalAction = {
        Bool: string;
    };
    type ActionAnnotation = {
        "@com.sap.vocabularies.UI.v1.Critical": CriticalAction;
        "@Org.OData.Core.V1.OperationAvailable": {
            $Path: string;
            Bool: string;
        };
    };
}
//# sourceMappingURL=ActionTypes.d.ts.map