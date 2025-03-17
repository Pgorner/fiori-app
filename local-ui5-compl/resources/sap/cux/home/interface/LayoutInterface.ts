/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import ColumnListItem from "sap/m/ColumnListItem";
import Component from "sap/ui/core/Component";
import BaseContainer from "../BaseContainer";
import BaseLayout from "../BaseLayout";
import Layout from "../Layout";

export interface IElement {
	completeId: string;
	sContainerType: string;
	blocked: boolean;
	visible: boolean;
	title: string;
	text: string;
}
export interface IAddResponse {
	key?: string;
}
export interface IControlPersonalizationWriteAPI {
	add: (settings: {
		changes: IManagePersChanges[];
		appComponent?: Component;
		ignoreVariantManagement: boolean;
	}) => Promise<IAddResponse[]>;
	save: (settings: { selector: { appComponent: Component | undefined }; changes: IAddResponse[] | undefined }) => Promise<void>;
	reset: (settings: { selectors: (BaseContainer | BaseLayout)[]; changeTypes: string[] }) => Promise<void>;
}

export interface IDragEvent {
	draggedControl: ColumnListItem;
	droppedControl: ColumnListItem;
}

export interface IManagePersChanges {
	selectorElement: Layout | BaseContainer;
	changeSpecificData: {
		changeType?: string;
		movedElements?: Array<{
			id: string;
			sourceIndex: number;
			targetIndex: number;
		}>;
		source?: {
			id: string;
			aggregation: string;
		};
		target?: {
			id: string;
			aggregation: string;
		};
	};
}
