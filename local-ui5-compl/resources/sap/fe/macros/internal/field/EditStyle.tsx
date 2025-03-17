import type { DataFieldTypes } from "@sap-ux/vocabularies-types/vocabularies/UI";
import type { BindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import { compileExpression, pathInModel } from "sap/fe/base/BindingToolkit";
import EventDelegateHook from "sap/fe/base/EventDelegateHook";
import * as MetaModelConverter from "sap/fe/core/converters/MetaModelConverter";
import * as CollaborationFormatters from "sap/fe/core/formatters/CollaborationFormatter";
import { getRelativePropertyPath } from "sap/fe/core/templating/PropertyFormatters";
import { hasValueHelpWithFixedValues } from "sap/fe/core/templating/PropertyHelper";
import type { MetaModelContext } from "sap/fe/core/templating/UIFormatters";
import * as UIFormatter from "sap/fe/core/templating/UIFormatters";
import CollaborationHBox from "sap/fe/macros/controls/CollaborationHBox";
import RadioButtons from "sap/fe/macros/controls/RadioButtons";
import { getMultipleLinesForDataField, getTextAlignment } from "sap/fe/macros/field/FieldTemplating";
import type { FieldBlockProperties } from "sap/fe/macros/internal/field/FieldStructureHelper";
import * as ValueHelpTemplating from "sap/fe/macros/internal/valuehelp/ValueHelpTemplating";
import Avatar from "sap/m/Avatar";
import type { CheckBox$SelectEvent } from "sap/m/CheckBox";
import CheckBox from "sap/m/CheckBox";
import DatePicker from "sap/m/DatePicker";
import type { DateTimeField$LiveChangeEvent } from "sap/m/DateTimeField";
import DateTimePicker from "sap/m/DateTimePicker";
import FlexItemData from "sap/m/FlexItemData";
import type { Input$LiveChangeEvent } from "sap/m/Input";
import Input from "sap/m/Input";
import type { InputBase$ChangeEvent } from "sap/m/InputBase";
import type { MaskInput$LiveChangeEvent } from "sap/m/MaskInput";
import MaskInput from "sap/m/MaskInput";
import MaskInputRule from "sap/m/MaskInputRule";
import RatingIndicator from "sap/m/RatingIndicator";
import type { TextArea$LiveChangeEvent } from "sap/m/TextArea";
import TextArea from "sap/m/TextArea";
import TimePicker from "sap/m/TimePicker";
import type Event from "sap/ui/base/Event";
import type { default as Control, Control$ValidateFieldGroupEvent, default as Control1 } from "sap/ui/core/Control";
import CustomData from "sap/ui/core/CustomData";
import type { Field$ChangeEvent } from "sap/ui/mdc/Field";
import Field from "sap/ui/mdc/Field";
import FieldEditMode from "sap/ui/mdc/enums/FieldEditMode";
import type { FieldBase$LiveChangeEvent } from "sap/ui/mdc/field/FieldBase";
import type Context from "sap/ui/model/Context";
import type { MetaModelType } from "../../../../../../../../types/metamodel_types";
import FieldHelper from "../../field/FieldHelper";
import TextAreaEx from "../../field/TextAreaEx";

const EditStyle = {
	/**
	 * An internal helper to retrieve the reused layout data.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getLayoutData(internalField: FieldBlockProperties): string {
		let layoutData = "";
		if (internalField.collaborationEnabled) {
			layoutData = <FlexItemData growFactor="9" />;
		}
		return layoutData;
	},

	/**
	 * Generates the avatar control next a field locked.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the avatar
	 */
	getCollaborationAvatar(internalField: FieldBlockProperties): string {
		const collaborationHasActivityExpression = compileExpression(internalField.collaborationExpression);
		const collaborationInitialsExpression = compileExpression(
			UIFormatter.getCollaborationExpression(internalField.dataModelPath, CollaborationFormatters.getCollaborationActivityInitials)
		);
		const collaborationColorExpression = compileExpression(
			UIFormatter.getCollaborationExpression(internalField.dataModelPath, CollaborationFormatters.getCollaborationActivityColor)
		);

		return (
			<Avatar
				core:require="{FieldRuntime: 'sap/fe/macros/field/FieldRuntime'}"
				visible={collaborationHasActivityExpression}
				initials={collaborationInitialsExpression}
				displaySize="Custom"
				customDisplaySize="1.5rem"
				customFontSize="0.8rem"
				backgroundColor={collaborationColorExpression}
				press={
					"FieldRuntime.showCollaborationEditUser(${$source>/}, ${$view>/})" as unknown as ((oEvent: Event) => void) | undefined
				}
			>
				{{
					dependents: <EventDelegateHook stopTapPropagation={true} />
				}}
			</Avatar>
		);
	},

	/**
	 * Generates a template for one of the pickers reference in the type.
	 * @param internalField Reference to the current internal field instance
	 * @param type Reference to one of the edit style picker types
	 * @returns An XML-based string with the definition of the field control
	 */
	getDateTimePickerGeneric(internalField: FieldBlockProperties, type: "DatePicker" | "DateTimePicker" | "TimePicker"): string {
		const dataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects<DataFieldTypes>(
			internalField.metaPath,
			internalField.contextPath
		);
		const textAlign = getTextAlignment(
			dataModelObjectPath,
			internalField.formatOptions,
			internalField.editModeAsObject as BindingToolkitExpression<string>
		);

		const dateTimePickerProperties = {
			"core:require": "{FieldAPI: 'sap/fe/macros/field/FieldAPI'}",
			id: internalField.editStyleId,
			width: "100%",
			editable: internalField.editableExpression,
			enabled: internalField.enabledExpression,
			required: internalField.requiredExpression,
			textAlign: textAlign,
			ariaLabelledBy: internalField.ariaLabelledBy as unknown as Array<Control | string>,
			value: internalField.valueBindingExpression,
			fieldGroupIds: internalField.fieldGroupIds,
			showTimezone: internalField.showTimezone,
			minDate: type === "DateTimePicker" || type === "DatePicker" ? internalField.minDateExpression : undefined,
			maxDate: type === "DateTimePicker" || type === "DatePicker" ? internalField.maxDateExpression : undefined,
			change:
				type === "DateTimePicker"
					? ((internalField.change || internalField.eventHandlers.change) as unknown as (oEvent: InputBase$ChangeEvent) => void)
					: (internalField.eventHandlers.change as unknown as (oEvent: InputBase$ChangeEvent) => void),
			liveChange: internalField.liveChangeEnabled
				? (internalField.eventHandlers.liveChange as unknown as (event: DateTimeField$LiveChangeEvent) => void)
				: undefined,
			validateFieldGroup: internalField.eventHandlers.validateFieldGroup as (oEvent: Control$ValidateFieldGroupEvent) => void
		};

		function getDateTimePicker(dateTimePickerType: string): string {
			let dateTimePicker;
			switch (dateTimePickerType) {
				case "DatePicker":
					dateTimePicker = (
						<DatePicker {...dateTimePickerProperties}>
							{{ customData: <CustomData key="sourcePath" value={internalField.dataSourcePath} /> }}
						</DatePicker>
					);
					break;
				case "DateTimePicker":
					dateTimePicker = (
						<DateTimePicker {...dateTimePickerProperties}>
							{{ customData: <CustomData key="sourcePath" value={internalField.dataSourcePath} /> }}
						</DateTimePicker>
					);
					break;
				case "TimePicker":
					dateTimePicker = (
						<TimePicker {...dateTimePickerProperties}>
							{{ customData: <CustomData key="sourcePath" value={internalField.dataSourcePath} /> }}
						</TimePicker>
					);
					break;
			}
			return dateTimePicker;
		}

		return getDateTimePicker(type);
	},

	/**
	 * Generates the Input template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getInputTemplate(internalField: FieldBlockProperties): string {
		const dataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects<DataFieldTypes>(
			internalField.metaPath,
			internalField.contextPath
		);

		const textAlign = getTextAlignment(
			dataModelObjectPath,
			internalField.formatOptions,
			internalField.editModeAsObject as BindingToolkitExpression<string>
		);

		return (
			<Input
				core:require="{FieldAPI: 'sap/fe/macros/field/FieldAPI'}"
				id={internalField.editStyleId}
				value={internalField.valueBindingExpression}
				placeholder={internalField.editStylePlaceholder}
				width="100%"
				editable={internalField.editableExpression}
				description={internalField.staticDescription}
				enabled={internalField.enabledExpression}
				required={internalField.requiredExpression}
				fieldGroupIds={internalField.fieldGroupIds}
				textAlign={textAlign}
				ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
				maxLength={internalField.formatOptions.textMaxLength}
				change={internalField.eventHandlers.change as (oEvent: InputBase$ChangeEvent) => void}
				liveChange={
					internalField.liveChangeEnabled
						? (internalField.eventHandlers.liveChange as (oEvent: Input$LiveChangeEvent) => void)
						: undefined
				}
				validateFieldGroup={internalField.eventHandlers.validateFieldGroup as (oEvent: Control$ValidateFieldGroupEvent) => void}
			>
				{{
					layoutData: EditStyle.getLayoutData(internalField),
					customData: <CustomData key="sourcePath" value={internalField.dataSourcePath} />
				}}
			</Input>
		);
	},

	/**
	 * Returns if a field shall be templated as a radio button group.
	 * @param internalField Reference to the current internal field instance
	 * @returns The evaluation result
	 */
	showAsRadioButton(internalField: FieldBlockProperties): boolean {
		// Determine if we need to render the field as a radio button group
		// TODO: Remove the next two lines once UX updated the vocabulary module including the new experimental annotation
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const radioButtonConfigured: boolean =
			internalField.property.annotations?.Common?.ValueListWithFixedValues &&
			hasValueHelpWithFixedValues(internalField.property) === true &&
			((internalField.property.annotations.Common.ValueListWithFixedValues.annotations?.Common?.ValueListShowValuesImmediately &&
				internalField.property.annotations.Common.ValueListWithFixedValues.annotations?.Common?.ValueListShowValuesImmediately.valueOf() ===
					true) ||
				internalField.formatOptions.fieldEditStyle === "RadioButtons");

		// Exclude not supported cases
		// - ValueListParamaterInOut / ...Out must not be empty
		// - ValueListRelevantQualifiers annotation must not be used
		// Further cases may not make sense with radio buttons but we do not explicitly exclude them but mention this in documentation.
		// Check documentation, discuss and decide before adding further restrictions here.
		const valueListParameterInOut = internalField.property?.annotations?.Common?.ValueList?.Parameters.find(
			(valueListParameter) =>
				(valueListParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" ||
					valueListParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterOut") &&
				valueListParameter.LocalDataProperty.value === internalField.property.name
		);
		return (
			radioButtonConfigured &&
			valueListParameterInOut !== undefined &&
			!internalField.property.annotations?.Common?.ValueListRelevantQualifiers
		);
	},

	/**
	 * Generates the RadioButton template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the radio button definition
	 */
	getRadioButtonTemplate(internalField: FieldBlockProperties): string {
		const fixedValuesPath = "/" + internalField.property?.annotations?.Common?.ValueList?.CollectionPath;

		const valueListParameterInOut = internalField.property?.annotations?.Common?.ValueList?.Parameters.find(
			(valueListParameter) =>
				(valueListParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" ||
					valueListParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterOut") &&
				valueListParameter.LocalDataProperty.value === internalField.property.name
		);

		// we know that a valueListProperty exists because we check this already in showAsRadioButton
		const valueListKeyPath = pathInModel(valueListParameterInOut!.ValueListProperty as string);

		let valueListDescriptionPath;
		const valueHelpKeyTextAnnotationPath =
			internalField.dataModelPath.targetEntityType.resolvePath(fixedValuesPath).entityType.keys[0].annotations?.Common?.Text?.path;
		if (valueHelpKeyTextAnnotationPath) {
			valueListDescriptionPath = pathInModel(valueHelpKeyTextAnnotationPath);
		} else {
			valueListDescriptionPath = valueListKeyPath;
		}

		return (
			<RadioButtons
				id={internalField.editStyleId}
				requiredExpression={internalField.requiredExpression}
				validateFieldGroup={
					"FieldRuntime.onValidateFieldGroup($event)" as unknown as (oEvent: Control$ValidateFieldGroupEvent) => void
				}
				fixedValuesPath={fixedValuesPath as unknown as `{${string}}`}
				fieldGroupIds={internalField.fieldGroupIds}
				value={internalField.valueBindingExpression}
				enabledExpression={internalField.enabledExpression}
				radioButtonTextProperty={valueListDescriptionPath}
				radioButtonKeyProperty={valueListKeyPath}
				horizontalLayout={internalField.formatOptions.radioButtonsHorizontalLayout}
			/>
		);
	},

	/**
	 * Generates the InputWithValueHelp template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getInputWithValueHelpTemplate(internalField: FieldBlockProperties): string {
		const dataFieldDataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects<DataFieldTypes>(
			internalField.metaPath,
			internalField.contextPath
		);

		const delegate = FieldHelper.computeFieldBaseDelegate(
			"sap/fe/macros/field/FieldBaseDelegate",
			internalField.formatOptions.retrieveTextFromValueList as boolean
		);
		const display = UIFormatter.getFieldDisplay(
			internalField.property,
			internalField.formatOptions.displayMode as string,
			internalField.editModeAsObject as BindingToolkitExpression<string>
		);
		const hasMultilineAnnotation = !!internalField.property?.annotations?.UI?.MultiLineText;
		const multipleLines = getMultipleLinesForDataField(internalField, hasMultilineAnnotation);

		const propertyContext = internalField.metaPath.getModel().createBindingContext("Value", internalField.metaPath);
		const valueHelpPropertyContext = internalField.metaPath
			.getModel()
			.createBindingContext(FieldHelper.valueHelpProperty(propertyContext));

		const valueHelp = ValueHelpTemplating.generateID(
			internalField._vhFlexId,
			internalField.vhIdPrefix,
			getRelativePropertyPath(propertyContext as unknown as MetaModelContext, {
				context: propertyContext
			}),
			getRelativePropertyPath(valueHelpPropertyContext as unknown as MetaModelContext, {
				context: valueHelpPropertyContext as Context
			})
		);

		const textAlign = getTextAlignment(
			dataFieldDataModelObjectPath,
			internalField.formatOptions,
			internalField.editModeAsObject as BindingToolkitExpression<string>,
			true
		);
		const label = FieldHelper.computeLabelText(internalField as unknown as MetaModelType<DataFieldTypes>, {
			context: internalField.metaPath
		});

		let optionalContentEdit = "";
		if (internalField.property.type === "Edm.String" && hasMultilineAnnotation) {
			optionalContentEdit = (
				<TextArea
					value={internalField.valueBindingExpression}
					required={internalField.requiredExpression}
					rows={internalField.formatOptions.textLinesEdit}
					growing={(internalField.formatOptions.textMaxLines as unknown as number) > 0 ? true : undefined}
					growingMaxLines={internalField.formatOptions.textMaxLines}
					width="100%"
					change={internalField.eventHandlers.change as unknown as (oEvent: InputBase$ChangeEvent) => void}
					fieldGroupIds={internalField.fieldGroupIds}
				/>
			);
		}

		let optionalLayoutData = "";
		if (internalField.collaborationEnabled === true) {
			optionalLayoutData = <FlexItemData growFactor="9" />;
		}

		if (this.showAsRadioButton(internalField) !== true) {
			return (
				<Field
					core:require="{FieldAPI: 'sap/fe/macros/field/FieldAPI'}"
					delegate={delegate}
					id={internalField.editStyleId}
					value={internalField.valueBindingExpression}
					placeholder={internalField.editStylePlaceholder}
					valueState={internalField.valueState}
					editMode={internalField.editMode}
					width="100%"
					required={internalField.requiredExpression}
					additionalValue={internalField.textBindingExpression}
					display={display}
					multipleLines={multipleLines === false ? undefined : multipleLines}
					valueHelp={valueHelp}
					fieldGroupIds={internalField.fieldGroupIds}
					textAlign={textAlign}
					ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control1 | string>}
					label={label}
					change={internalField.eventHandlers.change as (oEvent: Field$ChangeEvent) => void}
					liveChange={
						internalField.liveChangeEnabled
							? (internalField.eventHandlers.liveChange as (oEvent: FieldBase$LiveChangeEvent) => void)
							: undefined
					}
					validateFieldGroup={internalField.eventHandlers.validateFieldGroup as (oEvent: Control$ValidateFieldGroupEvent) => void}
				>
					{{
						contentEdit: optionalContentEdit,
						layoutData: optionalLayoutData,
						customData: <CustomData key="sourcePath" value={internalField.dataSourcePath} />
					}}
				</Field>
			);
		} else {
			return this.getRadioButtonTemplate(internalField);
		}
	},

	/**
	 * Generates the CheckBox template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getCheckBoxTemplate(internalField: FieldBlockProperties): string {
		return (
			<CheckBox
				core:require="{FieldAPI: 'sap/fe/macros/field/FieldAPI'}"
				id={internalField.editStyleId}
				selected={internalField.valueBindingExpression}
				editable={internalField.editableExpression}
				enabled={internalField.enabledExpression}
				fieldGroupIds={internalField.fieldGroupIds}
				ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
				select={internalField.eventHandlers.change as (oEvent: CheckBox$SelectEvent) => void}
				validateFieldGroup={internalField.eventHandlers.validateFieldGroup as (oEvent: Control$ValidateFieldGroupEvent) => void}
			>
				{{ customData: <CustomData key="sourcePath" value={internalField.dataSourcePath} /> }}
			</CheckBox>
		);
	},

	/**
	 * Generates the TextArea template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getTextAreaTemplate(internalField: FieldBlockProperties): string {
		const growing = internalField.formatOptions.textMaxLines ? true : false;

		const showExceededText = !!internalField.formatOptions.textMaxLength;

		//unfortunately this one is a "different" layoutData than the others, therefore the reuse function from above cannot be used for the textArea template
		let layoutData = "";
		if (internalField.collaborationEnabled) {
			layoutData = <FlexItemData growFactor="9" />;
		}

		return (
			<TextAreaEx
				core:require="{FieldAPI: 'sap/fe/macros/field/FieldAPI'}"
				id={internalField.editStyleId}
				value={internalField.valueBindingExpression}
				placeholder={internalField.editStylePlaceholder}
				required={internalField.requiredExpression}
				rows={internalField.formatOptions.textLinesEdit}
				growing={growing}
				growingMaxLines={internalField.formatOptions.textMaxLines}
				cols={300} //As the default is 20, the "cols" property is configured with a value of 300 to guarantee that the textarea will occupy all the available space.
				width="100%"
				editable={internalField.editableExpression}
				enabled={internalField.enabledExpression}
				fieldGroupIds={internalField.fieldGroupIds}
				ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
				maxLength={internalField.formatOptions.textMaxLength}
				showExceededText={showExceededText}
				change={internalField.eventHandlers.change as (oEvent: InputBase$ChangeEvent) => void}
				liveChange={
					internalField.liveChangeEnabled || internalField.formatOptions.textMaxLength
						? (internalField.eventHandlers.liveChange as (oEvent: TextArea$LiveChangeEvent) => void)
						: undefined
				}
				validateFieldGroup={internalField.eventHandlers.validateFieldGroup as (oEvent: Control$ValidateFieldGroupEvent) => void}
			>
				{{
					layoutData: layoutData,
					customData: <CustomData key="sourcePath" value={internalField.dataSourcePath} />
				}}
			</TextAreaEx>
		);
	},

	/**
	 * Generates the RatingIndicator template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getRatingIndicatorTemplate: (internalField: FieldBlockProperties): string => {
		const tooltip = internalField.ratingIndicatorTooltip || "{sap.fe.i18n>T_COMMON_RATING_INDICATOR_TITLE_LABEL}";

		return (
			<RatingIndicator
				id={internalField.editStyleId}
				maxValue={internalField.ratingIndicatorTargetValue}
				value={internalField.valueBindingExpression}
				tooltip={tooltip}
				iconSize="1.375rem"
				class="sapUiTinyMarginTopBottom"
				editable="true"
			>
				{{
					layoutData: EditStyle.getLayoutData(internalField)
				}}
			</RatingIndicator>
		);
	},

	/**
	 * Helps to calculate the content edit functionality / templating.
	 * Including a wrapper an hbox in case of collaboration mode finally
	 * it calls internally EditStyle.getTemplate.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getTemplateWithWrapper(internalField: FieldBlockProperties): string {
		let contentEdit;

		if (internalField.editMode !== FieldEditMode.Display && !!internalField.editStyle) {
			if (internalField.collaborationEnabled ?? false) {
				contentEdit = (
					<CollaborationHBox width="100%" alignItems="End">
						{EditStyle.getTemplate(internalField)}
						{EditStyle.getCollaborationAvatar(internalField)}
					</CollaborationHBox>
				);
			} else {
				contentEdit = EditStyle.getTemplate(internalField);
			}
		}

		return contentEdit || "";
	},

	/**
	 * Generates the InputMask template.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getInputMaskTemplate(internalField: FieldBlockProperties): string {
		const optionalMaskInputRules = [];
		const dataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects<DataFieldTypes>(
			internalField.metaPath,
			internalField.contextPath
		);
		const textAlign = getTextAlignment(
			dataModelObjectPath,
			internalField.formatOptions,
			internalField.editModeAsObject as BindingToolkitExpression<string>
		);
		if (internalField.mask?.maskRule) {
			for (const rule of internalField.mask.maskRule) {
				optionalMaskInputRules.push(<MaskInputRule maskFormatSymbol={rule.symbol} regex={rule.regex} />);
			}
		}

		return (
			<MaskInput
				core:require="{FieldAPI: 'sap/fe/macros/field/FieldAPI'}"
				id={internalField.editStyleId}
				value={internalField.valueBindingExpression}
				placeholder={internalField.editStylePlaceholder}
				width="100%"
				editable={internalField.editableExpression}
				ariaLabelledBy={internalField.ariaLabelledBy as unknown as Array<Control | string>}
				mask={internalField.mask?.mask}
				enabled={internalField.enabledExpression}
				required={internalField.requiredExpression}
				fieldGroupIds={internalField.fieldGroupIds}
				textAlign={textAlign}
				placeholderSymbol={internalField.mask?.placeholderSymbol}
				liveChange={internalField.eventHandlers.liveChange as (oEvent: MaskInput$LiveChangeEvent) => void}
				validateFieldGroup={internalField.eventHandlers.validateFieldGroup as (oEvent: Control$ValidateFieldGroupEvent) => void}
			>
				{{
					rules: optionalMaskInputRules,
					customData: <CustomData key="sourcePath" value={internalField.dataSourcePath} />
				}}
			</MaskInput>
		);
	},

	/**
	 * Entry point for further templating processings.
	 * @param internalField Reference to the current internal field instance
	 * @returns An XML-based string with the definition of the field control
	 */
	getTemplate: (internalField: FieldBlockProperties): string | undefined => {
		let innerFieldContent;
		switch (internalField.editStyle) {
			case "CheckBox":
				innerFieldContent = EditStyle.getCheckBoxTemplate(internalField);
				break;
			case "DatePicker":
			case "DateTimePicker":
			case "TimePicker": {
				innerFieldContent = EditStyle.getDateTimePickerGeneric(internalField, internalField.editStyle);
				break;
			}
			case "Input": {
				innerFieldContent = EditStyle.getInputTemplate(internalField);
				break;
			}

			case "InputWithValueHelp": {
				innerFieldContent = EditStyle.getInputWithValueHelpTemplate(internalField);
				break;
			}
			case "RatingIndicator":
				innerFieldContent = EditStyle.getRatingIndicatorTemplate(internalField);
				break;
			case "TextArea":
				innerFieldContent = EditStyle.getTextAreaTemplate(internalField);
				break;
			case "InputMask":
				innerFieldContent = EditStyle.getInputMaskTemplate(internalField);
				break;
			default:
		}

		return innerFieldContent;
	}
};

export default EditStyle;
