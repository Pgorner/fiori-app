declare module "sap/cux/home/BaseApp" {
    import { GenericTile$PressEvent } from "sap/m/GenericTile";
    import Popover from "sap/m/Popover";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import Element from "sap/ui/core/Element";
    import { $BaseAppSettings } from "sap/cux/home/BaseApp";
    import MenuItem from "sap/cux/home/MenuItem";
    /**
     *
     * Base App class for managing and storing Apps.
     *
     * @extends sap.ui.core.Element
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121.0
     *
     * @abstract
     * @internal
     * @experimental Since 1.121
     * @private
     * @alias sap.cux.home.BaseApp
     */
    export default abstract class BaseApp extends Element {
        constructor(idOrSettings?: string | $BaseAppSettings);
        constructor(id?: string, settings?: $BaseAppSettings);
        static readonly metadata: MetadataOptions;
        abstract _handlePress(): void;
        /**
         * Base App Press Handler
         * @private
         * @param {GenericTile$PressEvent} event - The event object.
         */
        _onPress(event: GenericTile$PressEvent): void;
        /**
         * Loads Actions available for selected app tile in popover
         * @private
         * @param {GenericTile$PressEvent} event - The event object.
         */
        _loadActionsPopover(event: GenericTile$PressEvent): void;
    }
    class ActionsPopover {
        private static _popover;
        private static _actionsList;
        private constructor();
        static _closeActionsPopover(): void;
        static get(actions?: MenuItem[]): Popover;
    }
}
//# sourceMappingURL=BaseApp.d.ts.map