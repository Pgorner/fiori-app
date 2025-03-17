/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Control from "sap/ui/core/Control";
import CondenserClassification from "sap/ui/fl/changeHandler/condenser/Classification";
import BaseLayout from "../BaseLayout";
import { IKeyUserChangeObject, ISpacePagePersonalization } from "../interface/KeyUserInterface";
import NewsAndPagesContainer from "../NewsAndPagesContainer";

function getContainer(control: Control): NewsAndPagesContainer {
	if (control.getMetadata().getName() === "sap.cux.home.NewsAndPagesContainer") {
		return control as NewsAndPagesContainer;
	}
	return (control as BaseLayout)
		.getItems()
		.find((item) => item.getMetadata().getName() === "sap.cux.home.NewsAndPagesContainer") as NewsAndPagesContainer;
}

const SpacePageIconHandler = {
	applyChange: (change: IKeyUserChangeObject, control: Control) => {
		const container = getContainer(control);
		container?.setIconPersonalizations(change.getContent());
		return true;
	},
	revertChange: (change: IKeyUserChangeObject, control: Control) => {
		const revertChange = change.getContent() as ISpacePagePersonalization[];
		revertChange.forEach((changeContent) => {
			changeContent.icon = changeContent.oldIcon;
		});
		const container = getContainer(control);
		container?.setIconPersonalizations(revertChange);
	},
	completeChangeContent: () => {
		return;
	},
	getCondenserInfo: (change: IKeyUserChangeObject) => {
		const changeContent = change.getContent() as ISpacePagePersonalization;
		return {
			affectedControl: change.getSelector(),
			classification: (CondenserClassification as { LastOneWins: string }).LastOneWins,
			uniqueKey: changeContent.spaceId + (changeContent.pageId || "") + "_icon"
		};
	}
};

export default SpacePageIconHandler;
