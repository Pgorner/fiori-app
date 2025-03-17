import { generate } from "sap/fe/core/helpers/StableIdHelper";
import ValueHelp from "sap/fe/macros/ValueHelp";
import HBox from "sap/m/HBox";
import VBox from "sap/m/VBox";
import type { Control$ValidateFieldGroupEvent } from "sap/ui/core/Control";
import type { TextAlign } from "sap/ui/core/library";
import FieldEditMode from "sap/ui/mdc/enums/FieldEditMode";
import type Context from "sap/ui/model/Context";
import FieldWrapper from "../../controls/FieldWrapper";
import FieldHelper from "../../field/FieldHelper";
import DisplayStyle from "./DisplayStyle";
import EditStyle from "./EditStyle";
import type { FieldBlockProperties } from "./FieldStructureHelper";

/**
 * The function calculates the corresponding ValueHelp field in case it´s
 * defined for the specific control.
 * @param internalField
 * @returns An XML-based string with a possible ValueHelp control.
 */
export function getPossibleValueHelpTemplate(internalField: FieldBlockProperties): string {
	const vhp = FieldHelper.valueHelpProperty(internalField.valueHelpMetaPath as unknown as Context);
	const vhpCtx = (internalField.valueHelpMetaPath as unknown as Context)
		.getModel()
		.createBindingContext(vhp, internalField.valueHelpMetaPath as unknown as Context);
	const hasValueHelpAnnotations = FieldHelper.hasValueHelpAnnotation(vhpCtx.getObject("@"));
	if (hasValueHelpAnnotations && internalField.showValueHelpTemplate == true) {
		// depending on whether this one has a value help annotation included, add the dependent
		return (
			<ValueHelp
				_flexId={`${internalField.id}-content_FieldValueHelp`}
				metaPath={vhpCtx.getPath()}
				contextPath={internalField.contextPath?.getPath()}
			/>
		);
	}
	return "";
}

/**
 * Create the fieldWrapper control for use cases with display and edit styles.
 * @param internalField Reference to the current internal field instance
 * @returns An XML-based string with the definition of the field control
 */
export function createFieldWrapper(internalField: FieldBlockProperties): string {
	let fieldWrapperID;
	if (internalField._flexId) {
		fieldWrapperID = internalField._flexId;
	} else if (internalField.idPrefix) {
		fieldWrapperID = generate([internalField.idPrefix, "Field-content"]);
	} else {
		fieldWrapperID = undefined;
	}

	// compute the display part and the edit part for the fieldwrapper control
	const contentDisplay = DisplayStyle.getTemplate(internalField);
	// content edit part needs to be wrapped further with an hbox in case of collaboration mode
	// that´s why we need to call this special helper here which finally calls internally EditStyle.getTemplate
	// const contentEdit = EditStyle.getTemplateWithWrapper(internalField, controller, handleChange, fieldAPI);
	const contentEdit = EditStyle.getTemplateWithWrapper(internalField);

	return (
		<FieldWrapper
			id={fieldWrapperID}
			editMode={internalField.editMode}
			visible={internalField.visible}
			width="100%"
			textAlign={internalField.textAlign as TextAlign}
			class={internalField.class}
			// TODO Field needs to be migrated
			validateFieldGroup={".collaborativeDraft.handleContentFocusOut" as unknown as (oEvent: Control$ValidateFieldGroupEvent) => void}
		>
			{{
				contentDisplay: contentDisplay,
				contentEdit: contentEdit
			}}
		</FieldWrapper>
	);
}

/**
 * Helps to calculate the field structure wrapper.
 * @param internalField Reference to the current internal field instance
 * @returns An XML-based string with the definition of the field control
 */
export function getFieldStructureTemplate(internalField: FieldBlockProperties): string {
	//compute the field in case of mentioned display styles
	if (
		internalField.displayStyle === "Avatar" ||
		internalField.displayStyle === "Contact" ||
		internalField.displayStyle === "Button" ||
		internalField.displayStyle === "File"
	) {
		// check for special handling in case a file type is used with the collaboration mode
		// (renders an avatar directly)
		if (
			internalField.displayStyle === "File" &&
			(internalField.collaborationEnabled ?? false) &&
			internalField.editMode !== FieldEditMode.Display
		) {
			return (
				<HBox width="100%" alignItems="End">
					<VBox width="100%">{DisplayStyle.getFileTemplate(internalField)}</VBox>
					{EditStyle.getCollaborationAvatar(internalField)}
				</HBox>
			);
		} else {
			//for all other cases render the displayStyles with a field api wrapper
			return DisplayStyle.getTemplate(internalField);
		}
	} else if (internalField.formatOptions.fieldMode === "nowrapper" && internalField.editMode === FieldEditMode.Display) {
		//renders a display based building block (e.g. a button) that has no field api wrapper around it.
		return DisplayStyle.getTemplate(internalField);
	} else {
		//for all other cases create a field wrapper
		return createFieldWrapper(internalField);
	}
}
