declare module "sap/cards/ap/generator/utils/CommonUtils" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import { CriticalityValue } from "sap/cards/ap/generator/types/CommonTypes";
    /**
     *
     * @param sPropertyValue
     * @returns true if the property value is a binding
     */
    function isBinding(sPropertyValue: string): boolean;
    /**
     * To determine if the given value is a activation `CriticalityValue`.
     *
     * @param {CriticalityValue | string} value - The value to check.
     * @returns {value is CriticalityValue} True if the value is a `CriticalityValue`, false otherwise.
     */
    function isActiveCalculation(value: CriticalityValue | string): value is CriticalityValue;
    /**
     * Retrieves the color representation for a given criticality value or string.
     *
     * @param {CriticalityValue | string} criticalityValue - The criticality value or string to evaluate.
     * @returns {string | undefined} The formatted string representing the color, or undefined if the input is not valid.
     */
    function getColorForGroup(criticalityValue: CriticalityValue | string): string | undefined;
}
//# sourceMappingURL=CommonUtils.d.ts.map