declare module "sap/cux/home/utils/KeyUserPersonalization" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import BaseObject from "sap/ui/base/Object";
    import UIComponent from "sap/ui/core/UIComponent";
    import { UserActionProperties } from "sap/cux/home/Layout";
    export default class KeyUserPersonalization extends BaseObject {
        private component;
        private i18nBundle;
        private adaptationData;
        constructor(component: UIComponent | undefined, i18nBundle: ResourceBundle);
        getRTAUserAction(): Promise<UserActionProperties | undefined>;
        private triggerRTA;
    }
}
//# sourceMappingURL=KeyUserPersonalization.d.ts.map