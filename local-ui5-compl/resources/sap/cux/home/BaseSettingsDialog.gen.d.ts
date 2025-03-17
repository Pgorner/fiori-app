declare module "sap/cux/home/BaseSettingsDialog" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $DialogSettings } from "sap/m/Dialog";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BaseSettingsDialogSettings extends $DialogSettings {

        /**
         * Contains the panels aggregation and should be of type BaseSettingsPanel.
         */
        panels?: BaseSettingsPanel[] | BaseSettingsPanel | AggregationBindingInfo | `{${string}}`;
    }

    export default interface BaseSettingsDialog {

        // aggregation: panels

        /**
         * Gets content of aggregation "panels".
         *
         * Contains the panels aggregation and should be of type BaseSettingsPanel.
         */
        getPanels(): BaseSettingsPanel[];

        /**
         * Adds some panel to the aggregation "panels".
         *
         * Contains the panels aggregation and should be of type BaseSettingsPanel.
         *
         * @param panel The panel to add; if empty, nothing is inserted
         * @returns Reference to "this" in order to allow method chaining
         */
        addPanel(panels: BaseSettingsPanel): this;

        /**
         * Inserts a panel into the aggregation "panels".
         *
         * Contains the panels aggregation and should be of type BaseSettingsPanel.
         *
         * @param panel The panel to insert; if empty, nothing is inserted
         * @param index The "0"-based index the panel should be inserted at; for
         *              a negative value of "iIndex", the panel is inserted at position 0; for a value
         *              greater than the current size of the aggregation, the panel is inserted at
         *              the last position
         * @returns Reference to "this" in order to allow method chaining
         */
        insertPanel(panels: BaseSettingsPanel, index: number): this;

        /**
         * Removes a panel from the aggregation "panels".
         *
         * Contains the panels aggregation and should be of type BaseSettingsPanel.
         *
         * @param panel The panel to remove or its index or id
         * @returns The removed panel or "null"
         */
        removePanel(panels: number | string | BaseSettingsPanel): BaseSettingsPanel | null;

        /**
         * Removes all the controls from the aggregation "panels".
         * Additionally, it unregisters them from the hosting UIArea.
         *
         * Contains the panels aggregation and should be of type BaseSettingsPanel.
         *
         * @returns  An array of the removed elements (might be empty)
         */
        removeAllPanels(): BaseSettingsPanel[];

        /**
         * Checks for the provided "sap.cux.home.BaseSettingsPanel" in the aggregation "panels".
         * and returns its index if found or -1 otherwise.
         *
         * Contains the panels aggregation and should be of type BaseSettingsPanel.
         *
         * @param panel The panel whose index is looked for
         * @returns The index of the provided control in the aggregation if found, or -1 otherwise
         */
        indexOfPanel(panels: BaseSettingsPanel): number;

        /**
         * Destroys all the panels in the aggregation "panels".
         *
         * Contains the panels aggregation and should be of type BaseSettingsPanel.
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        destroyPanels(): this;
    }
}
