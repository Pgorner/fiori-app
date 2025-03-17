/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Control from "sap/ui/core/Control";
import CondenserClassification from "sap/ui/fl/changeHandler/condenser/Classification";
import BaseLayout from "../BaseLayout";
import { IKeyUserChangeObject, INewsFeedVisibiliyChange } from "../interface/KeyUserInterface";
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

const NewsFeedVisibilityChange = {
	applyChange: (change: IKeyUserChangeObject, control: Control) => {
		const container = getContainer(control);

		// Debounce the newsPersonalization call
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		debounceTimeout = setTimeout(() => {
			container?.newsVisibilityChangeHandler(change.getContent());
		}, 0);

		return true;
	},
	revertChange: (change: IKeyUserChangeObject, control: Control) => {
		const container = getContainer(control);
		let revertChange = change.getContent() as INewsFeedVisibiliyChange;
		revertChange.isNewsFeedVisible = !revertChange.isNewsFeedVisible;
		container?.newsVisibilityChangeHandler(revertChange);
	},
	completeChangeContent: () => {
		return;
	},
	getCondenserInfo: (change: IKeyUserChangeObject) => {
		return {
			affectedControl: change.getSelector(),
			classification: (CondenserClassification as { LastOneWins: string }).LastOneWins,
			uniqueKey: "newsFeedVisibility"
		};
	}
};

export default NewsFeedVisibilityChange;
