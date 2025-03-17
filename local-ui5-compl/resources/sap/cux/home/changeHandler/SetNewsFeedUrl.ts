/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Control from "sap/ui/core/Control";
import CondenserClassification from "sap/ui/fl/changeHandler/condenser/Classification";
import BaseLayout from "../BaseLayout";
import { IKeyUserChangeObject, INewsPersData } from "../interface/KeyUserInterface";
import NewsAndPagesContainer from "../NewsAndPagesContainer";

function getContainer(control: Control): NewsAndPagesContainer {
	if (control.getMetadata().getName() === "sap.cux.home.NewsAndPagesContainer") {
		return control as NewsAndPagesContainer;
	}
	return (control as BaseLayout)
		.getItems()
		.find((item) => item.getMetadata().getName() === "sap.cux.home.NewsAndPagesContainer") as NewsAndPagesContainer;
}
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const SetNewsFeedUrl = {
	applyChange: (change: IKeyUserChangeObject, control: Control) => {
		const container = getContainer(control);

		// Debounce the newsPersonalization call
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		debounceTimeout = setTimeout(() => {
			container?.newsPersonalization(change.getContent());
		}, 0);

		return true;
	},
	revertChange: (change: IKeyUserChangeObject, control: Control) => {
		const container = getContainer(control);
		let revertChanges = change.getContent() as INewsPersData;
		revertChanges.newsFeedURL = revertChanges.oldNewsFeedUrl;
		revertChanges.showCustomNewsFeed = revertChanges.oldShowCustomNewsFeed;
		revertChanges.customNewsFeedKey = revertChanges.oldCustomNewsFeedKey;
		container?.newsPersonalization(revertChanges);
	},
	completeChangeContent: () => {
		return;
	},
	getCondenserInfo: (change: IKeyUserChangeObject) => {
		return {
			affectedControl: change.getSelector(),
			classification: (CondenserClassification as { LastOneWins: string }).LastOneWins,
			uniqueKey: "newsFeedUrl"
		};
	}
};

export default SetNewsFeedUrl;
