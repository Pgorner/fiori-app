declare module "sap/cux/home/utils/PersonalisationUtils" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ManagedObject from "sap/ui/base/ManagedObject";
    import BaseObject from "sap/ui/base/Object";
    import UIComponent from "sap/ui/core/UIComponent";
    const defaultContainerId = "sap.cux";
    /**
     *
     * Provides the util methods used for UshellPersonalizer.
     *
     * @extends sap.ui.BaseObject
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.122.0
     *
     * @private
     * @experimental Since 1.122
     * @hidden
     *
     * @alias sap.cux.home.utils.PersonalisationUtils
     */
    class PersonalisationUtils extends BaseObject {
        getPersContainerId(oManagedObject: ManagedObject): string;
        getOwnerComponent(oManagedObject: ManagedObject): UIComponent | undefined;
    }
    const _default: PersonalisationUtils;
    export default _default;
}
//# sourceMappingURL=PersonalisationUtils.d.ts.map