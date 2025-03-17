/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import HideControl from "sap/ui/fl/changeHandler/HideControl";
import UnHideControl from "sap/ui/fl/changeHandler/UnhideControl";
import BaseContainer from "../BaseContainer";
import { IKeyUserChange } from "../interface/KeyUserInterface";
import Layout from "../Layout";

enum Action {
	applyChange = "applyChange",
	revertChange = "revertChange"
}

type ChangeHandler = {
	applyChange: (change: IKeyUserChange, control: BaseContainer, propertyBag: object) => Promise<void>;
	revertChange: (change: IKeyUserChange, control: BaseContainer, propertyBag: object) => Promise<void>;
};

const resetLayoutSections = async (
	changeType: ChangeHandler,
	action: Action,
	change: IKeyUserChange,
	control: BaseContainer,
	propertyBag: object
) => {
	const genericChange: ChangeHandler = changeType;
	await genericChange[action](change, control, propertyBag);

	// Reset sections to update the layout
	(control.getParent() as Layout).resetSections?.();
};

export default {
	hideControl: {
		layers: {
			USER: true
		},
		changeHandler: {
			...HideControl,
			applyChange: async (change: IKeyUserChange, control: BaseContainer, propertyBag: object) => {
				await resetLayoutSections(HideControl as ChangeHandler, Action.applyChange, change, control, propertyBag);
			},
			revertChange: async (change: IKeyUserChange, control: BaseContainer, propertyBag: object) => {
				await resetLayoutSections(HideControl as ChangeHandler, Action.revertChange, change, control, propertyBag);
			}
		} as ChangeHandler
	},
	unhideControl: {
		layers: {
			USER: true
		},
		changeHandler: {
			...UnHideControl,
			applyChange: async (change: IKeyUserChange, control: BaseContainer, propertyBag: object) => {
				await resetLayoutSections(UnHideControl as ChangeHandler, Action.applyChange, change, control, propertyBag);
			},
			revertChange: async (change: IKeyUserChange, control: BaseContainer, propertyBag: object) => {
				await resetLayoutSections(UnHideControl as ChangeHandler, Action.revertChange, change, control, propertyBag);
			}
		} as ChangeHandler
	}
};
