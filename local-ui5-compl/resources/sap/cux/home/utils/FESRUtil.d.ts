declare module "sap/cux/home/utils/FESRUtil" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import Control from "sap/ui/core/Control";
    import UI5Element from "sap/ui/core/Element";
    enum FESR_EVENTS {
        PRESS = "press",
        CHANGE = "change",
        SELECT = "select"
    }
    const addFESRId: (control: Control | UI5Element, fesrId: string) => UI5Element | Control;
    const getFESRId: (control: Control | UI5Element) => string;
    const addFESRSemanticStepName: (element: UI5Element, eventName: string, stepName: string) => void;
}
//# sourceMappingURL=FESRUtil.d.ts.map