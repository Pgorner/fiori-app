/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import MoveControls from "sap/ui/fl/changeHandler/MoveControls";
import newsFeedVisibilityChange from "../changeHandler/NewsFeedVisibilityChange";
import setNewsFeedUrl from "../changeHandler/SetNewsFeedUrl";
import spacePageColorHandler from "../changeHandler/SpacePageColorHandler";
import SpacePageIconHandler from "../changeHandler/SpacePageIconHandler";

export enum CHANGE_TYPES {
	HIDE = "hideControl",
	UNHIDE = "unhideControl",
	MOVE = "moveControls",
	PAGE_COLOR = "applyPageColor",
	SPACE_COLOR = "applySpaceColor",
	PAGE_ICON = "applyPageIcon",
	SPACE_ICON = "applySpaceIcon",
	NEWS_FEED_URL = "changeNewsFeedURL",
	NEWS_FEED_VISIBILITY = "setNewsFeedVisibility"
}

export default {
	[CHANGE_TYPES.MOVE]: {
		layers: {
			USER: true
		},
		changeHandler: MoveControls as object
	},
	[CHANGE_TYPES.HIDE]: "default",
	[CHANGE_TYPES.UNHIDE]: "default",
	[CHANGE_TYPES.SPACE_COLOR]: {
		layers: {
			CUSTOMER: true
		},
		changeHandler: spacePageColorHandler
	},
	[CHANGE_TYPES.PAGE_COLOR]: {
		layers: {
			CUSTOMER: true
		},
		changeHandler: spacePageColorHandler
	},
	[CHANGE_TYPES.SPACE_ICON]: {
		layers: {
			CUSTOMER: true
		},
		changeHandler: SpacePageIconHandler
	},
	[CHANGE_TYPES.PAGE_ICON]: {
		layers: {
			CUSTOMER: true
		},
		changeHandler: SpacePageIconHandler
	},
	[CHANGE_TYPES.NEWS_FEED_URL]: {
		layers: {
			CUSTOMER: true
		},
		changeHandler: setNewsFeedUrl
	},
	[CHANGE_TYPES.NEWS_FEED_VISIBILITY]: {
		layers: {
			CUSTOMER: true
		},
		changeHandler: newsFeedVisibilityChange
	}
};
