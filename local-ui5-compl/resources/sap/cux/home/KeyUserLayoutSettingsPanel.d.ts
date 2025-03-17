declare module "sap/cux/home/KeyUserLayoutSettingsPanel" {
    import type { MetadataOptions } from "sap/ui/core/Element";
    import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
    /**
     *
     * Class for Layout Settings Panel for KeyUser Settings Dialog.
     *
     * @extends BaseSettingsPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.KeyUserLayoutSettingsPanel
     */
    export default class KeyUserLayoutSettingsPanel extends BaseSettingsPanel {
        static readonly metadata: MetadataOptions;
        private layoutTable;
        private orderedSections;
        private _allLayoutElements;
        /**
         * Init lifecycle method
         *
         * @public
         * @override
         */
        init(): void;
        /**
         * Returns the content for the Layout Settings Panel.
         *
         * @private
         * @returns {VBox} The control containing the Layout Settings Panel content.
         */
        private getContent;
        /**
         * Method to load the sections
         *
         * @private
         */
        private loadSections;
        /**
         * Function to execute drag and drop among sections
         *
         * @private
         */
        private onDropLayoutSettings;
        /**
         * Retrieves the actual index of a layout element by its ID.
         *
         * @private
         * @param {string} id - The ID of the layout element to find.
         * @returns {number} The index of the layout element.
         */
        private _getActualIndex;
        /**
         * Rearranges the layout elements by moving an element from the source index to the target index.
         *
         * @private
         * @param {number} sourceIndex - The index of the element to move.
         * @param {number} targetIndex - The index to move the element to.
         */
        private _rearrangeLayoutElements;
        /**
         * Method to set visibility of the container sections
         * Toggle button pressed event handler
         *
         * @private
         */
        private createShowHideChangeFile;
    }
}
//# sourceMappingURL=KeyUserLayoutSettingsPanel.d.ts.map