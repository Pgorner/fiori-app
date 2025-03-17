declare module "sap/cux/home/FavAppPanel" {
    import IllustratedMessage from "sap/m/IllustratedMessage";
    import { MetadataOptions } from "sap/ui/base/ManagedObject";
    import BaseAppPersPanel from "sap/cux/home/BaseAppPersPanel";
    const _showAddApps: () => boolean;
    /**
     *
     * Provides the FavAppPanel Class.
     *
     * @extends sap.cux.home.BaseAppPersPanel
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121.0
     *
     * @private
     * @experimental
     * @hidden
     *
     * @alias sap.cux.home.FavAppPanel
     */
    export default class FavAppPanel extends BaseAppPersPanel {
        private _selectedApps;
        private _selectedGroupColor;
        private _selectedGroupId;
        private _currentItem;
        private _cutApp;
        private oEventBus;
        private _importButton;
        private _createGroupMenuItem;
        static readonly metadata: MetadataOptions;
        init(): void;
        private _importdone;
        /**
         * Fetch fav apps and set apps aggregation
         * @private
         */
        loadApps(): Promise<void>;
        /**
         * Creates and returns group instances for given group objects
         * @private
         * @param {object[]} aGroupObject - Array of group object.
         * @returns {sap.cux.home.Group[]} - Array of group instances
         */
        private _generateGroups;
        /**
         * Add multiple groups in the groups aggregation.
         * @private
         * @param {sap.cux.home.Group[]} groups - Array of groups.
         */
        private _setGroups;
        /**
         * Returns list of actions available for app
         * @param {ssap.cux.home.Group} group - The group containing the app.
         * @private
         * @returns {sap.cux.home.MenuItem[]} - An array of menu items representing available actions for the app.
         */
        private _getAppActions;
        /**
         * Returns list of actions available for selected group
         * @private
         * @param {sap.cux.home.Group} group - Group
         * @returns {sap.cux.home.MenuItem[]} - An array of menu items representing available actions for the group.
         */
        private _getGroupActions;
        /**
         * Creates actions buttons for panel.
         * @private
         */
        private _createActionButtons;
        private _createImportButton;
        private setImportButtonVisibility;
        /**
         * Creates menu items for panel header.
         * @private
         */
        private _createHeaderMenuItems;
        /**
         * Retrieves drag and drop information from the given event.
         * @private
         * @param {Event<DropInfo$DropEventParameters>} event - The event containing drag and drop information.
         * @returns {Promise<IDragDropInfo>} The drag and drop information.
         */
        private _getDragDropInfo;
        /**
         * Adjusts apps drag and drop information.
         * @private
         * @param {IDragDropInfo} dragDropInfo - The drag and drop information to adjust.
         * @returns {Promise<void>} A Promise that resolves when the adjustment is completed.
         */
        private _adjustAppDragDropInfo;
        private _getTileItem;
        /**
         * Adjusts app/group drag and drop information.
         * @private
         * @param {IDragDropInfo} dragDropInfo - The drag and drop information to adjust.
         * @returns {Promise<void>} A Promise that resolves when the adjustment is completed.
         */
        private _adjustGroupDragDropInfo;
        /**
         * Handler for drop event of a favorite item.
         * @private
         * @param {Event<DropInfo$DropEventParameters>} event - The drop event containing information about the dropped item.
         * @returns {Promise<void>} A Promise that resolves when the drop event handling is completed.
         */
        private _onFavItemDrop;
        /**
         * Handles the drop of an item onto another item.
         * If an app in dropped over another app, create group dialog is opened.
         * If an app is dropped over a group, app should be moved inside that group.
         * @private
         * @param {Group | App} dragItem - The item being dragged.
         * @param {Group | App} dropItem - The item onto which the dragItem is dropped.
         * @returns {Promise<void>} A Promise that resolves when the dropping of the item is completed.
         */
        private _handleOnItemDrop;
        /**
         * Handles the reordering of items based on drag and drop information.
         * @private
         * @param {IDragDropInfo} dragDropInfo - The drag and drop information.
         * @returns {Promise<void>} A Promise that resolves when the reordering is completed.
         */
        private _handleItemsReorder;
        /**
         * Navigates to the App Finder with optional group Id.
         * @async
         * @private
         * @param {string} [groupId] - Optional group Id
         */
        private navigateToAppFinder;
        /**
         * Validates if import apps is enabled
         *
         *@returns {Promise} - resolves to boolean value (import is enabled/disabled)
         */
        private _validateAppsMigration;
        private _openImportAppsDialog;
        /**
         * Opens the create group dialog.
         * @private
         * @param {boolean} [skipAppsSelection=false] - Whether to skip the apps selection page.
         */
        private _openCreateGroupDialog;
        /**
         * Closes the create group dialog.
         * @private
         */
        private _closeCreateGroupDialog;
        /**
         * Resets the state of the create group dialog.
         * @private
         */
        private _resetCreateGroupDialog;
        /**
         * Generates or retrieves the dialog for creating a group.
         * @private
         * @param {boolean} bSkipAppsSelection - Whether to skip the apps selection page.
         * @returns {sap.m.Dialog} The generated dialog for creating a group.
         */
        private _generateCreateGroupDialog;
        /**
         * Handles the highlighting of an app when selected.
         * @private
         * @param {sap.ui.base.Event} event - The event object.
         * @param {Object} selectedApp - The selected app object.
         */
        private _highlightApp;
        /**
         * Generates the scroll container for displaying apps in the create group dialog.
         * @private
         * @returns {sap.m.ScrollContainer} The scroll container for displaying apps.
         */
        private _generateAppsScrollContainer;
        /**
         * Method for updating selected apps count in create group dialog
         * @private
         */
        private _updateSelectedAppCount;
        /**
         * Creates or returns the navigation container for the create group dialog.
         * @private
         * @returns {sap.m.NavContainer} The navigation container for the create group dialog.
         */
        private _generateCreateGroupNavContainer;
        /**
         * Generates or retrieve the main page of the create group dialog.
         * @private
         * @returns {sap.m.Page} The main page of the create group dialog.
         */
        private _generateCreateGroupMainPage;
        /**
         * Generates or retrieve the app selection page of the create group dialog.
         * @private
         * @returns {sap.m.Page} The app selection page of the create group dialog.
         */
        private _generateCreateGroupAppsPage;
        /**
         * Generates the error message for create group dialog, when no apps are found for searched text.
         * @private
         * @returns {sap.m.IllustratedMessage} The error message for no filtered apps.
         */
        private _generateCreateGroupErrorMsg;
        /**
         * Handles the color selection event for new group.
         * @private
         * @param {sap.ui.base.Event} event - The event object.
         */
        private _onColorSelect;
        /**
         * Retrieves the key of the legend color based on the provided color value.
         * @param {string} color - The color value for which to retrieve the legend color key.
         * @returns {string} The legend color key corresponding to the provided color value, or the default background color key if not found.
         * @private
         */
        private _getLegendColor;
        /**
         * Sets the visibility of the error message strip indicating no apps are selected in create group dialog.
         * @private
         * @param {boolean} error - Whether to show the error message strip (true) or hide it (false).
         */
        private _setNoAppsSelectedError;
        /**
         * Validates the group name entered in the create group dialog.
         * @private
         * @returns {boolean} Whether the group name is valid (true) or not (false).
         */
        private _validateGroupName;
        /**
         * Highlights selected apps by adding a CSS class to corresponding tiles.
         * @private
         */
        private _highlightSelectedApps;
        /**
         * Handles the search for apps in create group dialog.
         * @private
         * @param {sap.ui.base.Event} event - The event object.
         */
        private _onCreateAppSearch;
        /**
         * Handles the event when the user presses the button to create a new group.
         * @private
         */
        private _onPressGroupCreate;
        /**
         * Creates a new group with the given properties and adds selected apps to it.
         * @param {Object} params - The properties for creating the group.
         * @param {sap.ui.core.URI[]} params.selectedApps - Target URL unique identifier of the selected apps to be added to the group.
         * @param {string} [params.groupName] - The name of the group. If not provided, a default name will be used.
         * @param {string} [params.groupColor] - The color of the group. If not provided, the default color will be used.
         * @private
         */
        private _createGroup;
        /**
         * Retrieves the color for the group.
         * @private
         * @returns {string} The color for the group.
         */
        private _getGroupColor;
        /**
         * Opens a color popover for selecting a background color for an item.
         * @param {sap.ui.base.Event} event - The event object.
         * @private
         */
        private _openColorPopover;
        /**
         * Handles the selection of a color for an app or group.
         * @param {sap.cux.home.App | sap.cux.home.Group} item - The item control.
         * @param {string} color - The selected color.
         * @returns {Promise<void>} - A promise that resolves when the color selection is handled.
         * @private
         */
        private _handleColorSelect;
        /**
         * Applies the selected color to an ungrouped tile.
         * @param {sap.cux.home.App | sap.cux.home.Group} item - The item control.
         * @param {string} color - The selected color.
         * @private
         */
        private _applyUngroupedTileColor;
        /**
         * Retrieves the list of groups where apps can be moved, excluding the source group if specified.
         * @param {string|null} sourceGroupId - The ID of the source group from which apps are being moved.
         * @returns {sap.cux.home.Group[]} An array of groups where apps can be moved.
         * @private
         */
        private _getAllowedMoveGroups;
        /**
         * Sets the busy state for dialogs and the panel.
         * @param {boolean} busy - Indicates whether the dialogs and the panel should be set to busy state.
         * @private
         */
        private _setBusy;
        /**
         * Opens a popover to move the app to another group.
         * @param {sap.cux.home.Group} sourceGroup - The source group from which the app is being moved.
         * @param {sap.ui.base.Event} event - The event triggering the popover opening.
         * @private
         */
        private _openMoveToGroupPopover;
        /**
         * Handles the removal of an app, displaying a confirmation dialog to the user.
         * If the app is the last one in the group, a warning dialog is displayed for confirmation.
         * @param {sap.cux.home.App} app - The app to be removed.
         * @param {sap.cux.home.Group} [group] - The group from which the app should be removed. If not provided, the app is considered to be in favorites.
         * @private
         */
        private _handleRemove;
        /**
         * Removes the specified app from the group or favorites.
         * If the app is the last one in the group, the group will be deleted as well.
         * If the app is an ungrouped app, its duplicate apps (if any) will also be deleted.
         * @param {App} app - The app to be removed.
         * @param {Group} [group] - The group from which the app should be removed. If not provided, the app is considered to be in favorites.
         * @returns {Promise<void>}
         * @private
         */
        private _removeApp;
        /**
         * Handler for moving an app from a source group to a target group.
         * @param {sap.cux.home.App} app - The app to be moved.
         * @param {string} sourceGroupId - The ID of the source group from which the app is being moved.
         * @param {string | null} targetGroupId - The ID of the target group to which the app will be moved.
         * @private
         */
        private _handleMoveToGroup;
        /**
         * Moves an app to a different group and handles group changes.
         * @param {App} app - The app to be moved.
         * @param {string} [sourceGroupId] - The ID of the source group from which the app is being moved.
         * @param {string} [targetGroupId] - The ID of the target group to which the app is being moved.
         * @returns {Promise<void>} - A Promise that resolves once the app is moved and group changes are handled.
         * @private
         */
        private _moveAppAndHandleGroupChanges;
        /**
         * Refreshes the group detail dialog.
         * @param {sap.cux.home.App} updatedApp - The updated app control.
         * @param {boolean} [isRemove=true] - A flag indicating whether to remove the app. Defaults to true.
         * @private
         */
        private _refreshGroupDetailDialog;
        /**
         * Moves an app from a source group to a target group.
         * @param {sap.cux.home.App} app - The app to be moved.
         * @param {string} sourceGroupId - The ID of the source group from which the app is being moved.
         * @param {string} targetGroupId - The ID of the target group to which the app will be moved. If null, the default section is considered.
         * @private
         */
        private _moveAppToGroup;
        /**
         * Moves a visualization to the default group.
         * @param {ICustomVisualization} visualization - The visualization to be moved to the default group.
         * @returns {Promise<void>} - A promise that resolves once the visualization is moved to the default group.
         * @private
         */
        private _moveAppToDefaultGroup;
        /**
         * Removes duplicate visualizations associated with a specific visualization.
         * @param {ICustomVisualization} visualization - The visualization for which duplicate visualizations should be removed.
         * @returns {Promise<void>} - A promise that resolves once duplicate visualizations are removed.
         * @private
         */
        private _removeDuplicateVisualizations;
        /**
         * Handles the event for renaming a group.
         * Opens the group detail dialog in edit mode.
         * @private
         * @param {sap.ui.base.Event} event - The event object.
         */
        private _onRenameGroup;
        /**
         * Event Handler for ungroup apps, shows confirmation dialog, ungroups the apps on confirmation
         * @param {sap.cux.home.Group} group - The group from which the apps will be ungrouped.
         * @private
         */
        private _handleUngroupApps;
        /**
         * Handles the event for deleting a group.
         * Shows confirmation dialog to either delete the group and apps, or move the apps in favorites.
         * @private
         * @param {sap.ui.base.Event} event - The event object.
         */
        private _onDeleteGroup;
        /**
         * Ungroups apps from the specified group Id.
         * @async
         * @private
         * @param {string} groupId - The Id of the group from which apps will be ungrouped.
         * @returns {Promise<void>} - A Promise that resolves once the ungrouping process is complete.
         */
        private _ungroupApps;
        /**
         * Shows the detail dialog for a group.
         * @async
         * @param {string} groupId - The Id of the group.
         * @param {boolean} [editMode=false] - Whether to open the dialog in edit mode.
         * @private
         */
        private _showGroupDetailDialog;
        /**
         * Sets the apps for the detail dialog for a group.
         * @async
         * @param {string} groupId - The Id of the group.
         * @returns {Promise<void>} - A Promise that resolves once the apps for the group detail dialog are set.
         * @private
         */
        private _setGroupDetailDialogApps;
        /**
         * Applies personalization to the grouped apps within the specified group.
         * @param {string} groupId - The ID of the group to which the apps belong.
         * @private
         */
        private _applyGroupedAppsPersonalization;
        /**
         * Applies Deprecated Info for apps inside the group.
         * @param {App[]} apps - The ID of the group to which the apps belong.
         * @private
         */
        private _dispatchAppsLoadedEvent;
        /**
         * Generates the group detail dialog.
         * @private
         * @returns {sap.m.Dialog} The generated detail dialog for the group.
         */
        private _generateGroupDetailDialog;
        /**
         * Closes the group detail dialog.
         * @private
         */
        private _closeGroupDetailDialog;
        /**
         * Updates the group name with new name.
         * This method is triggered on group name input focus leave.
         * @private
         * @async
         * @param {string} updatedTitle - The new title for the group.
         */
        private _onGroupEditName;
        /**
         * Renames a group.
         * @async
         * @param {string} groupId - The Id of the group to rename.
         * @param {string} updatedTitle - The new title for the group.
         * @returns {Promise<void>} A Promise that resolves once the group is renamed.
         */
        private _renameGroup;
        /**
         * Sets the group name control in the detail dialog.
         * Shows input control to edit the group name in edit mode, otherwise, shows group name as title control.
         * @private
         * @param {string} groupTitle - The title of the group.
         * @param {boolean} editMode - Whether the dialog is in edit mode.
         */
        private _setGroupNameControl;
        /**
         * Generates the dialog for adding apps from insights.
         * @returns {sap.m.Dialog} The dialog for adding apps from insights.
         * @private
         */
        private _generateAddFromInsightsDialog;
        /**
         * Handles the addition of apps from insights.
         * @returns {Promise<void>} A Promise that resolves when the operation is complete.
         * @private
         */
        private _handleAddFromInsights;
        /**
         * Generates list items for the provided apps and populates the list in the "Add from Insights" dialog.
         * @param {ICustomVisualization[]} apps - An array of custom visualizations representing the apps to be added.
         * @private
         */
        private _generateInsightListItems;
        /**
         * Retrieves the insight tiles to add.
         * @returns {Promise<ICustomVisualization[]>} A Promise that resolves with an array of insight tiles to add.
         * @private
         */
        private _getInsightTilesToAdd;
        /**
         * Closes the dialog for adding apps from insights.
         * @private
         */
        private _closeAddFromInsightsDialog;
        /**
         * Retrieves the selected insights from the dialog.
         * @returns {sap.m.ListItemBase[]} An array of selected insights.
         * @private
         */
        private _getSelectedInsights;
        /**
         * Adds apps from insights.
         * @returns {void}
         * @private
         */
        private _addFromInsights;
        /**
         * Updates the personalization data for apps.
         * @param {IUpdatePersonalizationConfig[]} updateConfigs - The array of configurations for updating personalization.
         * @param {IUpdatePersonalizationConfig} updateConfig - Configuration object for updating personalization.
         * @param {ICustomVisualization} updateConfig.visualization - Visualization.
         * @param {string} updateConfig.color - The color to update for the app.
         * @param {boolean} updateConfig.isTargetGroupDefault - A flag indicating whether the target section is the default.
         * @param {string} [updateConfig.targetGroupId] - The Id of the target group. Defaults to source group Id if not provided.
         * @returns {Promise<void>} A promise that resolves when the personalization data is updated.
         * @private
         */
        private _updateAppPersonalization;
        /**
         * Updates the color personalization for an app.
         * @param {IAppPersonalization[]} personalizations - The array of app personalizations.
         * @param {IUpdatePersonalizationConfig} updateConfig - The update configuration.
         * @returns {void}
         * @private
         */
        private _updateAppColorPersonalization;
        /**
         * Updates the personalization when an app is moved to a different group.
         * @param {IAppPersonalization[]} personalizations - The array of app personalizations.
         * @param {IUpdatePersonalizationConfig} updateConfig - The update configuration.
         * @returns {void}
         * @private
         */
        private _updateMoveAppPersonalization;
        /**
         * Updates the personalization data for a group with the selected color.
         * @param {string} groupId - The ID of the group.
         * @param {string} selectedColor - The selected color for the group.
         * @returns {Promise<void>} A promise that resolves when the personalization data is updated.
         * @private
         */
        private _updateGroupPersonalization;
        /**
         * Finds the index of personalization data matching the specified properties.
         * @param {IAppPersonalization[]} personalizations - The array of personalization data.
         * @param {IAppPersonalization} appPersonalization - The properties to match for finding the index.
         * @param {string} [appPersonalization.appId] -  id of the app.
         * @param {string} [appPersonalization.oldAppId] - old id of the app.
         * @param {string} [appPersonalization.sectionId] - id of the section.
         * @param {boolean} appPersonalization.isSection - A flag indicating whether the personalization is for a section.
         * @param {boolean} appPersonalization.isRecentlyAddedApp - A flag indicating whether the app is a recently added app.
         * @returns {number} The index of the matching personalization data, or -1 if not found.
         * @private
         */
        private _getPersonalizationIndex;
        /**
         * Adds a visualization.
         * @param {object} oViz - The visualization to be added.
         * @param {object} oViz.visualization - The visualization object.
         * @param {boolean} [oViz.visualization.isBookmark=false] - Indicates if the visualization is a bookmark.
         * @param {string} [oViz.visualization.vizId] - The ID of the visualization if it's not a bookmark.
         * @returns {Promise<void>} A promise that resolves to void after the visualization is added.
         * @private
         */
        private _addVisualization;
        /**
         * Deletes a group.
         * @param {string} groupId - The Id of the group to delete.
         * @returns {Promise<void>} A Promise that resolves once the group is deleted.
         * @private
         */
        private _deleteGroup;
        /**
         * Deletes personalization data based on the specified properties.
         * @param {IAppPersonalizationConfig} personalizationConfig - The properties to identify the personalization data to delete.
         * @param {boolean} [personalizationConfig.isSection] - A flag indicating whether the personalization is for a group.
         * @param {string} [appPersonalization.appId] -  id of the app.
         * @param {string} [appPersonalization.oldAppId] - old id of the app.
         * @param {string} personalizationConfig.sectionId - The ID of the group associated with the personalization.
         * @param {boolean} [appPersonalization.isRecentlyAddedApp] - A flag indicating whether the app is a recently added app.
         * @returns {Promise<void>} A promise that resolves when the personalization data is deleted.
         * @private
         */
        private _deletePersonalization;
        /**
         * Handles the press event of a group.
         * @param {Group$PressEvent} event - The press event object.
         * @private
         */
        private _handleGroupPress;
        /**
         * Handles keyboard events for cutting and moving applications.
         * When the Cmd (Mac) or Ctrl (Windows) key is pressed along with 'x', the currently selected element is cut.
         * When the Cmd (Mac) or Ctrl (Windows) key is pressed along with 'v':
         * - If the operation is performed on a group, the previously cut application is moved into the group.
         * - If the operation is performed on an application, the create group dialog is opened.
         * @param {KeyboardEvent} event - The keyboard event object.
         * @param {string} [appGroupId] - The group Id of the app, if app belongs to a group.
         * @returns {Promise<void>} A Promise that resolves when app is moved to a group or create group dialog is opened.
         * @private
         */
        private _handleKeyboardMoveApp;
        /**
         * Cancels the cut operation when clicked outside apps section or when focus moves out of apps section.
         * @param {MouseEvent | KeyboardEvent} event - The mouse or keyboard event triggering the reset.
         * @private
         */
        private _resetCutElement;
        /**
         * Generates illustrated message for favorite apps panel.
         * @private
         * @override
         * @returns {sap.m.IllustratedMessage} Illustrated error message.
         */
        protected generateIllustratedMessage(): IllustratedMessage;
    }
}
//# sourceMappingURL=FavAppPanel.d.ts.map