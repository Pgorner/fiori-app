import type { PrimitiveType } from "@sap-ux/vocabularies-types";
import type { BindingToolkitExpression, CompiledBindingToolkitExpression } from "sap/fe/base/BindingToolkit";

export enum SpecificSelectKeys {
	KeepKey = "KeepKey",
	ReplaceKey = "ReplaceKey",
	ClearFieldValueKey = "ClearFieldValueKey"
}

export type SelectInfo = {
	text: string;
	key: string;
	propertyValue?: PrimitiveType;
	unitValue?: PrimitiveType;
};

export type MassFieldProperties = {
	label: string;
	visible: boolean;
	isFieldRequired: CompiledBindingToolkitExpression;
	textBinding: CompiledBindingToolkitExpression;
	descriptionPath?: string;
	readOnlyExpression: BindingToolkitExpression<boolean>;
	inputType: string;
	propertyInfo: {
		nullable: boolean;
		key: string;
		relativePath: string;
		unitPropertyPath?: string;
	};
	selectItems: SelectInfo[];
};
