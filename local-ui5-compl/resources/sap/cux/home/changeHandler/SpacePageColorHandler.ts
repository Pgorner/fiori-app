/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Control from "sap/ui/core/Control";
import CondenserClassification from "sap/ui/fl/changeHandler/condenser/Classification";
import BaseLayout from "../BaseLayout";
import { IKeyUserChangeObject, ISpacePagePersonalization } from "../interface/KeyUserInterface";
import NewsAndPagesContainer from "../NewsAndPagesContainer";

function getNewsPageContainer(control: Control): NewsAndPagesContainer {
	return (control as BaseLayout)
		.getItems()
		.find((item) => item.getMetadata().getName() === "sap.cux.home.NewsAndPagesContainer") as NewsAndPagesContainer;
}

const SpacePageColorHandler = {
	applyChange: (change: IKeyUserChangeObject, control: Control) => {
		const container = getNewsPageContainer(control);
		container?.setColorPersonalizations(change.getContent());
		return true;
	},
	revertChange: (change: IKeyUserChangeObject, control: Control) => {
		const revertChange = change.getContent() as ISpacePagePersonalization[];
		revertChange.forEach((changeContent) => {
			changeContent.BGColor = changeContent.oldColor;
			changeContent.applyColorToAllPages = changeContent.oldApplyColorToAllPages;
		});
		const container = getNewsPageContainer(control);
		container?.setColorPersonalizations(revertChange);
	},
	completeChangeContent: () => {
		return;
	},
	getCondenserInfo: (change: IKeyUserChangeObject) => {
		const changeContent = change.getContent() as ISpacePagePersonalization;
		return {
			affectedControl: change.getSelector(),
			classification: (CondenserClassification as { LastOneWins: string }).LastOneWins,
			uniqueKey: changeContent.spaceId + (changeContent.pageId || "") + "_color"
		};
	}
};

export default SpacePageColorHandler;
