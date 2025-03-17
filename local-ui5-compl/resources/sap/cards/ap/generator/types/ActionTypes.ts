/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
export type ControlProperties = {
	title: string;
	titleKey: string;
	style?: string;
	enablePathKey?: string;
	isStyleControlEnabled?: boolean;
	isConfirmationRequired?: boolean;
	triggerActionText?: string;
};

export type AnnotationAction = {
	label: string;
	action: string;
	enablePath: string;
	isConfirmationRequired: boolean;
};

export type ActionStyles = {
	name: string;
	label: string;
	labelWithValue: string;
};
export type EnableProperty = {
	label: string;
	value: string;
	name?: string;
	labelWithValue?: string;
};

export type CriticalAction = {
	Bool: string;
};

export type ActionAnnotation = {
	"@com.sap.vocabularies.UI.v1.Critical": CriticalAction;
	"@Org.OData.Core.V1.OperationAvailable": {
		$Path: string;
		Bool: string;
	};
};
