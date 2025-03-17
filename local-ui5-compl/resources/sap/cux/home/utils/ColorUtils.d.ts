declare module "sap/cux/home/utils/ColorUtils" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import { Value } from "sap/ui/core/theming/Parameters";
    class ColorUtils {
        private _oColorList;
        constructor();
        /**
         * Returns first unassigned color from the list
         *
         * @public
         * @returns {string} color key of unassigned color
         */
        getFreeColor(): string;
        /**
         * Marks color as assigned in the list
         *
         * @public
         * @param {string} sKey color key
         * @returns {object} color list instance for chaining
         */
        addColor(sKey: string): this;
        /**
         * Marks color as unassigned in the list
         *
         * @public
         * @param {string} sKey color key
         * @returns {object} color list instance for chaining
         */
        removeColor(sKey: string): this;
        /**
         * Fetch Color Object from the list
         *
         * @private
         * @param {string} sKey color key
         * @returns {object} color Object, if found
         */
        _fetchColor(sKey: string): {
            assigned: boolean;
        };
        /**
         * Getter for Color List
         *
         * @private
         * @returns {object} color list object
         */
        _getColorMap(): {
            key: string;
            value: Value;
            assigned: boolean;
        }[];
    }
    const _default: ColorUtils;
    export default _default;
}
//# sourceMappingURL=ColorUtils.d.ts.map