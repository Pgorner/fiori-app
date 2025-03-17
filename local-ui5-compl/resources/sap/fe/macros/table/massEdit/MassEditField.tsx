import type { PrimitiveType } from "sap/fe/base/BindingToolkit";
import { compileConstant, compileExpression, isConstant } from "sap/fe/base/BindingToolkit";
import Any from "sap/fe/core/controls/Any";
import * as ID from "sap/fe/core/helpers/StableIdHelper";
import Field from "sap/fe/macros/field/Field";
import type FieldAPI from "sap/fe/macros/field/FieldAPI";
import type { MassFieldProperties } from "sap/fe/macros/table/massEdit/library";
import { SpecificSelectKeys } from "sap/fe/macros/table/massEdit/library";
import Select from "sap/m/Select";
import type Event from "sap/ui/base/Event";
import type Control from "sap/ui/core/Control";
import Item from "sap/ui/core/Item";
import type FormElement from "sap/ui/layout/form/FormElement";
import type { Field$ChangeEvent } from "sap/ui/mdc/Field";
import FieldEditMode from "sap/ui/mdc/enums/FieldEditMode";
import type BaseContext from "sap/ui/model/Context";
import type PropertyBinding from "sap/ui/model/PropertyBinding";
import type Context from "sap/ui/model/odata/v4/Context";
import FieldRuntimeHelper from "../../field/FieldRuntimeHelper";

export default class MassEditField {
	private readonly select: Select;

	private readonly field: Field | undefined;

	private isValid = true;

	/**
	 * Constructor of the MassEdit field.
	 * @param properties The field properties
	 * @param context Defines the Odata metamodel context used in the current MassEdit dialog
	 */
	constructor(
		public readonly properties: MassFieldProperties,
		private readonly context: BaseContext
	) {
		this.context = context;
		this.select = this.createSelect();
		this.field = this.createField();
		this.postConfiguration();
	}

	/**
	 * Gets the inner controls.
	 * @returns The controls
	 */
	getControls(): Control[] {
		const controls: Control[] = [this.select];
		if (this.field) {
			controls.push(this.field);
		}
		return controls;
	}

	/**
	 * Gets the property and unit values of the mass edit field.
	 * @returns The values
	 */
	getFieldValues(): Record<string, PrimitiveType> {
		const selectedKey = this.select.getSelectedKey();
		const selectedItem = this.properties.selectItems.find((item) => selectedKey === item.key);
		const values: Record<string, PrimitiveType> = {};
		let propertyValue: PrimitiveType = "";
		let propertyUnitValue = "";
		const bindingValue = this.field?.getBindingContext()?.getProperty(this.properties.propertyInfo.relativePath);

		if (!(this.select.getParent() as FormElement | undefined)?.getVisible() || !selectedItem) {
			return {};
		}
		switch (selectedItem.key) {
			case SpecificSelectKeys.ClearFieldValueKey:
				propertyValue = this.getFormattedValue(bindingValue);
				break;
			case SpecificSelectKeys.ReplaceKey:
				if (this.field) {
					/**
					 * If the value on the field comes from an existing entry into the select
					 * the value to use is not the one into the bindingContext since it could contain the description
					 * so FE has to retrieve the value from the select option.
					 */
					const unitValue = this.properties.propertyInfo.unitPropertyPath
						? this.field.getBindingContext()?.getProperty(this.properties.propertyInfo.unitPropertyPath)
						: undefined;
					const selectOptions = this.properties.selectItems.find(
						(item) =>
							(this.properties.propertyInfo.unitPropertyPath &&
								item.propertyValue === bindingValue &&
								item.unitValue === unitValue) ||
							(!this.properties.propertyInfo.unitPropertyPath && item.text === bindingValue)
					);
					const newValue = selectOptions?.propertyValue ?? bindingValue;
					const newPropertyValue = selectOptions?.unitValue ?? unitValue;
					if (newValue === null && newPropertyValue === null) {
						return {}; // If the Field is empty we don't want to update the value
					}
					propertyValue = this.getFormattedValue(newValue);
					propertyUnitValue = newPropertyValue;
				}
				break;
			case SpecificSelectKeys.KeepKey:
				return {};
			default:
				if (this.properties.inputType === "CheckBox") {
					propertyValue = this.getFormattedValue(selectedItem.key);
				} else {
					return {};
				}
				break;
		}
		values[this.properties.propertyInfo.relativePath] = propertyValue;
		if (this.properties.propertyInfo.unitPropertyPath) {
			values[this.properties.propertyInfo.unitPropertyPath] = propertyUnitValue;
		}
		return values;
	}

	/**
	 * Manages the configuration of the inner field after its templating.
	 */
	private async postConfiguration(): Promise<void> {
		if (this.field) {
			await this.field.contentCreated;
			this.field.setVisible(false);
			this.field.attachEvent("onChange", this.handleFieldChange.bind(this));
		}
	}

	/**
	 * Checks if the targeted property is read only on the specified context.
	 * @param context The row context
	 * @returns True if the field is readonly on this context, false otherwise.
	 */
	public isReadOnlyOnContext(context: Context): boolean {
		const readOnlyInfo = this.properties.readOnlyExpression;
		let isReadOnly = false;
		if (isConstant(readOnlyInfo)) {
			isReadOnly = compileConstant(readOnlyInfo, false, undefined, true) as boolean;
		} else {
			// We evaluate the value of the expression via a UI5 managed object instance.
			const anyObject = new Any({ anyBoolean: compileExpression(readOnlyInfo) });
			anyObject.setModel(context.getModel());
			anyObject.setBindingContext(context);
			isReadOnly = (anyObject.getBinding("anyBoolean") as PropertyBinding)?.getExternalValue();
			anyObject.destroy();
		}
		return isReadOnly;
	}

	/**
	 * Gets the formatted value.
	 * @param value The raw value
	 * @returns The formatted value.
	 */
	private getFormattedValue(value?: PrimitiveType): PrimitiveType {
		if (this.properties.inputType === "CheckBox") {
			return value === "true";
		}
		if (!value && this.field?.getBindingContext()) {
			// "Clear Values" or "Replace Values" but nothing has been entered
			// for the property with unit we set 0 as default
			if (this.properties.propertyInfo.unitPropertyPath) {
				return 0;
			}
			// If the property is nullable we keep the value as is
			if (this.properties.propertyInfo.nullable) {
				return value;
			}
			// If the property is not nullable we return the default value for the type
			(this.field as unknown as FieldAPI).setValue("");
			return (this.field as unknown as FieldAPI).getValue();
		}
		return value;
	}

	/**
	 * Create the inner field.
	 * @returns The field if needed, undefined otherwise.
	 */
	private createField(): Field | undefined {
		if (this.properties.inputType !== "CheckBox")
			return (
				<Field
					contextPath={this.context as unknown as Context}
					metaPath={this.properties.propertyInfo.relativePath as unknown as Context}
					id={ID.generate(["MED_", this.properties.propertyInfo.key, "_Field"])}
					editMode={FieldEditMode.Editable}
					vhIdPrefix={"FieldValueHelp"}
				/>
			);
	}

	private handleFieldChange(event: Field$ChangeEvent & Event<{ isValid: boolean }>): void {
		this.isValid = !!FieldRuntimeHelper.getFieldStateOnChange(event).state["validity"];
	}

	public isFieldValid(): boolean {
		return this.isValid;
	}

	/**
	 * Create the inner select.
	 * @returns The select.
	 */
	private createSelect(): Select {
		return (
			<Select
				id={ID.generate(["MED_", this.properties.propertyInfo.key])}
				items={this.properties.selectItems.map((selectItem) => (
					<Item key={selectItem.key} text={selectItem.text} />
				))}
				required={this.properties.isFieldRequired}
				change={this.handleSelectionChange.bind(this)}
				width="100%"
				ariaLabelledBy={[ID.generate(["MED_", this.properties.propertyInfo.key, "Label"])]}
			/>
		);
	}

	/**
	 * Manages the selection change through the drop down.
	 */
	private handleSelectionChange(): void {
		const selectedItem = this.select.getSelectedItem();
		if (this.field && selectedItem) {
			this.isValid = true;
			const bindingContext = this.field.getBindingContext();
			const key = selectedItem.getKey();
			let selectedValue;
			this.field.setVisible(
				![SpecificSelectKeys.KeepKey, SpecificSelectKeys.ClearFieldValueKey].includes(selectedItem.getKey() as SpecificSelectKeys)
			);

			if (!(key in SpecificSelectKeys)) {
				selectedValue = this.properties.selectItems.find((item) => item.key === key);
				this.select.setSelectedKey(SpecificSelectKeys.ReplaceKey);
			}
			/**
			 * Sets the value on the field.
			 * This value has to include the description if needed.
			 */
			if (bindingContext) {
				const uniPropertyPath = this.properties.propertyInfo.unitPropertyPath;
				bindingContext.setProperty(
					this.properties.propertyInfo.relativePath,
					this.properties.descriptionPath ? selectedValue?.text : selectedValue?.propertyValue
				);
				if (uniPropertyPath) {
					bindingContext.setProperty(uniPropertyPath, selectedValue?.unitValue);
				}
			}
		}
	}
}
