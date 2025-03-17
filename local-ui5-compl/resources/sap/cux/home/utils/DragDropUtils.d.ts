declare module "sap/cux/home/utils/DragDropUtils" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import GridContainer from "sap/f/GridContainer";
    import FlexBox from "sap/m/FlexBox";
    import Event from "sap/ui/base/Event";
    /**
     * Handles keyboard events for navigation and drag and drop functionality.
     * @param {KeyboardEvent} event - The keyboard event object.
     * @param {boolean} disablenavigation - Whether navigation is allowed.
     * @param {Function} callback - The callback function to execute when a drag and drop event occurs.
     * @returns {Promise<void>} A Promise that resolves when the handling is complete.
     */
    function attachKeyboardHandler(event: KeyboardEvent, disablenavigation: boolean, callback?: (dragDropEvent: Event) => Promise<void> | void): Promise<void>;
    /**
     * Gathers all DOM elements representing individual tiles in the grid container
     * that have the "sapFGridContainerItemWrapper" class, stores them in an array,
     * and then focuses the DOM element corresponding to the card that was just moved
     * during a drag-and-drop operation by setting its "tabindex" to "0" for
     * accessibility and navigation purposes.
     * @param {GridContainer | FlexBox} container - The container containing the items.
     * @param {number} dropItemIndex - The index of the item to focus after drag-and-drop.
     */
    const focusDraggedItem: (container: GridContainer | FlexBox, dropItemIndex: number) => void;
    /**
     * Gets the index of the closest element in the Y direction within a grid container.
     * @param {GridContainer | FlexBox} container - The container (either GridContainer or FlexBox).
     * @param {number} currentIndex - The index of the current element.
     * @param {string} keyCode - The key code representing the direction (ArrowUp or ArrowDown).
     * @returns {number} The index of the closest element in the Y direction.
     */
    const _getClosestElementYIndex: (container: GridContainer | FlexBox, currentIndex: number, keyCode: string) => number;
    const setTabIndexForItems: (aItems: HTMLElement[], currentIndex: number) => void;
}
//# sourceMappingURL=DragDropUtils.d.ts.map