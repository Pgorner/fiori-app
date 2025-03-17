import type { Property } from "@sap-ux/vocabularies-types";
import type { BindingToolkitExpression, CompiledBindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import type { PropertiesOf, StrictPropertiesOf } from "sap/fe/base/ClassSupport";
import { blockAttribute, blockEvent, defineBuildingBlock } from "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport";
import type { TemplateProcessorSettings } from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor";
import BuildingBlockTemplatingBase from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase";
import type { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { getPropertyWithSemanticObject } from "sap/fe/core/templating/SemanticObjectHelper";
import type { InputMaskFormatOptions } from "sap/fe/core/type/InputMask";
import type FieldEditMode from "sap/ui/mdc/enums/FieldEditMode";
import type Context from "sap/ui/model/Context";
import type { EventHandler } from "types/extension_types";
import type FieldFormatOptions from "../field/FieldFormatOptions";
import { getTemplateWithFieldApi } from "./field/FieldBlockStructure";
import { getFieldStructureTemplate } from "./field/FieldStructure";
import type { InputFieldBlockProperties } from "./field/FieldStructureHelper";
import { setUpField } from "./field/FieldStructureHelper";

export type DisplayStyle =
	| "Text"
	| "Avatar"
	| "File"
	| "DataPoint"
	| "Contact"
	| "Button"
	| "Link"
	| "ObjectStatus"
	| "AmountWithCurrency"
	| "ObjectIdentifier"
	| "LabelSemanticKey"
	| "LinkWithQuickView"
	| "ExpandableText"
	| "InputMask";

export type EditStyle =
	| "InputWithValueHelp"
	| "TextArea"
	| "File"
	| "DatePicker"
	| "TimePicker"
	| "DateTimePicker"
	| "CheckBox"
	| "InputWithUnit"
	| "Input"
	| "RatingIndicator"
	| "InputMask";

export type FieldProperties = StrictPropertiesOf<InternalFieldBlock>;

/**
 * Building block for creating a Field based on the metadata provided by OData V4.
 * <br>
 * Usually, a DataField annotation is expected
 *
 * Usage example:
 * <pre>
 * <internalMacro:Field
 * idPrefix="SomePrefix"
 * contextPath="{entitySet>}"
 * metaPath="{dataField>}"
 * />
 * </pre>
 * @hideconstructor
 * @private
 * @experimental
 * @since 1.94.0
 */
@defineBuildingBlock({
	name: "Field",
	namespace: "sap.fe.macros.internal",
	publicNamespace: "sap.fe.macros",
	designtime: "sap/fe/macros/internal/Field.designtime"
})
export default class InternalFieldBlock extends BuildingBlockTemplatingBase {
	@blockAttribute({ type: "string", isPublic: true, required: true })
	public readonly id!: string;

	@blockAttribute({
		type: "string"
	})
	public readonly _flexId?: string;

	@blockAttribute({
		type: "string"
	})
	public readonly idPrefix?: string;

	@blockAttribute({
		type: "string"
	})
	public readonly vhIdPrefix?: string;

	/**
	 * Metadata path to the entity set
	 */
	@blockAttribute({
		type: "sap.ui.model.Context",
		required: true,
		expectedTypes: ["EntitySet", "NavigationProperty", "EntityType", "Singleton"]
	})
	public readonly contextPath!: Context;

	/**
	 * Flag indicating whether action will navigate after execution
	 */
	@blockAttribute({
		type: "boolean"
	})
	public readonly navigateAfterAction: boolean = true;

	/**
	 * Metadata path to the dataField.
	 * This property is usually a metadataContext pointing to a DataField having
	 * $Type of DataField, DataFieldWithUrl, DataFieldForAnnotation, DataFieldForAction, DataFieldForIntentBasedNavigation, DataFieldWithNavigationPath, or DataPointType.
	 * But it can also be a Property with $kind="Property"
	 */
	@blockAttribute({
		type: "sap.ui.model.Context",
		required: true,
		expectedTypes: ["Property"],
		expectedAnnotationTypes: [
			"com.sap.vocabularies.UI.v1.DataField",
			"com.sap.vocabularies.UI.v1.DataFieldWithUrl",
			"com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			"com.sap.vocabularies.UI.v1.DataFieldForAction",
			"com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
			"com.sap.vocabularies.UI.v1.DataFieldWithAction",
			"com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation",
			"com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath",
			"com.sap.vocabularies.UI.v1.DataPointType",
			"com.sap.vocabularies.UI.v1.DataFieldForActionGroup"
		]
	})
	public readonly metaPath!: Context;

	/**
	 * Edit Mode of the field.
	 *
	 * If the editMode is undefined then we compute it based on the metadata
	 * Otherwise we use the value provided here.
	 */
	@blockAttribute({
		type: "sap.ui.mdc.enums.EditMode"
	})
	public readonly editMode?: FieldEditMode | CompiledBindingToolkitExpression;

	/**
	 * Wrap field
	 */
	@blockAttribute({
		type: "boolean"
	})
	public readonly wrap?: boolean;

	/**
	 * CSS class for margin
	 */
	@blockAttribute({
		type: "string"
	})
	public readonly class?: string;

	/**
	 * Property added to associate the label with the Field
	 */
	@blockAttribute({
		type: "string"
	})
	public readonly ariaLabelledBy?: string[];

	@blockAttribute({
		type: "sap.ui.core.TextAlign"
	})
	public readonly textAlign?: string;

	/**
	 * Option to add a semantic object to a field
	 */
	@blockAttribute({
		type: "string",
		isPublic: true,
		required: false
	})
	public readonly semanticObject?: string;

	@blockAttribute({
		type: "boolean",
		isPublic: true,
		required: false
	})
	public readonly visible?: boolean | CompiledBindingToolkitExpression;

	@blockAttribute({ type: "boolean" })
	readonly showErrorObjectStatus?: boolean | CompiledBindingToolkitExpression;

	@blockAttribute({
		type: "object",
		validate: function (formatOptionsInput: FieldFormatOptions) {
			if (formatOptionsInput.textAlignMode && !["Table", "Form"].includes(formatOptionsInput.textAlignMode)) {
				throw new Error(`Allowed value ${formatOptionsInput.textAlignMode} for textAlignMode does not match`);
			}

			if (
				formatOptionsInput.displayMode &&
				!["Value", "Description", "ValueDescription", "DescriptionValue"].includes(formatOptionsInput.displayMode)
			) {
				throw new Error(`Allowed value ${formatOptionsInput.displayMode} for displayMode does not match`);
			}

			if (formatOptionsInput.fieldMode && !["nowrapper", ""].includes(formatOptionsInput.fieldMode)) {
				throw new Error(`Allowed value ${formatOptionsInput.fieldMode} for fieldMode does not match`);
			}

			if (formatOptionsInput.measureDisplayMode && !["Hidden", "ReadOnly"].includes(formatOptionsInput.measureDisplayMode)) {
				throw new Error(`Allowed value ${formatOptionsInput.measureDisplayMode} for measureDisplayMode does not match`);
			}

			if (
				formatOptionsInput.textExpandBehaviorDisplay &&
				!["InPlace", "Popover"].includes(formatOptionsInput.textExpandBehaviorDisplay)
			) {
				throw new Error(
					`Allowed value ${formatOptionsInput.textExpandBehaviorDisplay} for textExpandBehaviorDisplay does not match`
				);
			}

			if (formatOptionsInput.semanticKeyStyle && !["ObjectIdentifier", "Label", ""].includes(formatOptionsInput.semanticKeyStyle)) {
				throw new Error(`Allowed value ${formatOptionsInput.semanticKeyStyle} for semanticKeyStyle does not match`);
			}

			if (typeof formatOptionsInput.isAnalytics === "string") {
				formatOptionsInput.isAnalytics = formatOptionsInput.isAnalytics === "true";
			}

			if (typeof formatOptionsInput.forInlineCreationRows === "string") {
				formatOptionsInput.forInlineCreationRows = formatOptionsInput.forInlineCreationRows === "true";
			}

			if (typeof formatOptionsInput.radioButtonsHorizontalLayout === "string") {
				formatOptionsInput.radioButtonsHorizontalLayout = formatOptionsInput.radioButtonsHorizontalLayout === "true";
			}

			if (typeof formatOptionsInput.hasDraftIndicator === "string") {
				formatOptionsInput.hasDraftIndicator = formatOptionsInput.hasDraftIndicator === "true";
			}
			if (typeof formatOptionsInput.showDate === "string") {
				formatOptionsInput.showDate = formatOptionsInput.showDate === "true";
			}
			if (typeof formatOptionsInput.showTimezone === "string") {
				formatOptionsInput.showTimezone = formatOptionsInput.showTimezone === "true";
			}
			if (typeof formatOptionsInput.showTime === "string") {
				formatOptionsInput.showTime = formatOptionsInput.showTime === "true";
			}

			/*
			Historical default values are currently disabled
			if (!formatOptionsInput.semanticKeyStyle) {
				formatOptionsInput.semanticKeyStyle = "";
			}
			*/

			return formatOptionsInput;
		}
	})
	public readonly formatOptions: FieldFormatOptions = {} as FieldFormatOptions;

	/**
	 * This is used to set valueState on the field
	 */
	valueState?: CompiledBindingToolkitExpression;

	/**
	 * The readOnly flag
	 */
	@blockAttribute({
		type: "boolean",
		isPublic: true,
		required: false
	})
	public readOnly?: boolean;

	/**
	 * Event handler for change event
	 */
	@blockEvent()
	change?: string;

	/**
	 * Event handler for live change event
	 */
	@blockEvent()
	onLiveChange?: string;

	// Computed properties

	dataModelPath!: DataModelObjectPath<Property>;

	property!: Property;

	editStyle?: EditStyle | null;

	mask?: InputMaskFormatOptions | null; // rules for maskInput

	showTimezone?: boolean;

	text?: BindingToolkitExpression<string> | CompiledBindingToolkitExpression;

	/**
	 * This is used to optionally provide an external value that comes from a different model than the oData model
	 */
	@blockAttribute({
		type: "string",
		isPublic: true,
		required: false
	})
	value?: string;

	/**
	 * This is used to optionally provide an external description that comes from a different model than the oData model
	 */
	@blockAttribute({
		type: "string",
		isPublic: true,
		required: false
	})
	description?: string;

	displayStyle?: DisplayStyle;

	fieldGroupIds?: string;

	/* Property path used for LOCK/UNLOCK collaboration messages */
	mainPropertyRelativePath?: string;

	/* Rating Indicator properties end */

	isPublicField: boolean;

	private _controlConfiguration: TemplateProcessorSettings;

	private _settings: TemplateProcessorSettings;

	static getOverrides(controlConfiguration: TemplateProcessorSettings, id: string): FieldProperties {
		/*
			Qualms: We need to use this TemplateProcessorSettings type to be able to iterate
			over the properties later on and cast it afterwards as a field property type
		*/
		const props = {} as TemplateProcessorSettings;

		if (controlConfiguration) {
			const controlConfig = controlConfiguration[id] as TemplateProcessorSettings;
			if (controlConfig) {
				Object.keys(controlConfig).forEach(function (configKey) {
					props[configKey] = controlConfig[configKey];
				});
			}
		}
		return props as unknown as FieldProperties;
	}

	/**
	 * Check field to know if it has semantic object.
	 * @param internalField The field
	 * @param dataModelPath The DataModelObjectPath of the property
	 * @returns True if field has a semantic object
	 */
	static propertyOrNavigationPropertyHasSemanticObject(
		internalField: InternalFieldBlock,
		dataModelPath: DataModelObjectPath<Property>
	): boolean {
		return (
			!!getPropertyWithSemanticObject(dataModelPath) ||
			(internalField.semanticObject !== undefined && internalField.semanticObject !== "")
		);
	}

	constructor(
		props: PropertiesOf<InternalFieldBlock>,
		controlConfiguration: TemplateProcessorSettings,
		settings: TemplateProcessorSettings
	) {
		super(props);
		this.isPublicField = this.isPublic;
		this._controlConfiguration = controlConfiguration;
		this._settings = settings;
	}

	/**
	 * The building block template function.
	 * @returns An XML-based string with the definition of the field control
	 */
	getTemplate(): string {
		const preparedProperties = setUpField(this as unknown as InputFieldBlockProperties, this._controlConfiguration, this._settings);
		preparedProperties.eventHandlers.change = "FieldAPI.handleChange" as unknown as EventHandler;
		preparedProperties.eventHandlers.liveChange = "FieldAPI.handleLiveChange" as unknown as EventHandler;
		preparedProperties.eventHandlers.validateFieldGroup = "FieldAPI.onValidateFieldGroup" as unknown as EventHandler;
		const box = getFieldStructureTemplate(preparedProperties);
		return getTemplateWithFieldApi(preparedProperties, box);
	}
}
