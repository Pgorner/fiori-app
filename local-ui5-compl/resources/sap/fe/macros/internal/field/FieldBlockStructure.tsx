import { generate } from "sap/fe/core/helpers/StableIdHelper";
import FieldEditMode from "sap/ui/mdc/enums/FieldEditMode";
import type { EventHandler } from "types/extension_types";
import FieldAPI from "../../field/FieldAPI";
import { getPossibleValueHelpTemplate } from "./FieldStructure";
import type { FieldBlockProperties } from "./FieldStructureHelper";

export function getTemplateWithFieldApi(internalField: FieldBlockProperties, template: string): string {
	let id;

	if (internalField.formatOptions.fieldMode === "nowrapper" && internalField.editMode === FieldEditMode.Display) {
		return template;
	}

	if (internalField._apiId) {
		id = internalField._apiId;
	} else if (internalField.idPrefix) {
		id = generate([internalField.idPrefix, "Field"]);
	} else {
		id = undefined;
	}

	if (internalField.change === null || internalField.change === "null") {
		internalField.change = undefined;
	}

	return (
		<FieldAPI
			core:require="{TableAPI: 'sap/fe/macros/table/TableAPI'}"
			change={internalField.change as unknown as EventHandler}
			liveChange={internalField.onLiveChange as unknown as EventHandler}
			focusin={".collaborativeDraft.handleContentFocusIn" as unknown as EventHandler}
			id={id}
			_flexId={internalField._flexId}
			idPrefix={internalField.idPrefix}
			vhIdPrefix={internalField.vhIdPrefix}
			contextPath={internalField.contextPath?.getPath()}
			metaPath={internalField.metaPath.getPath()}
			navigateAfterAction={internalField.navigateAfterAction}
			editMode={internalField.editMode}
			wrap={internalField.wrap}
			class={internalField.class}
			ariaLabelledBy={internalField.ariaLabelledBy}
			textAlign={internalField.textAlign}
			semanticObject={internalField.semanticObject}
			showErrorObjectStatus={internalField.showErrorObjectStatus}
			readOnly={internalField.readOnly}
			value={internalField.value}
			description={internalField.description}
			required={internalField.requiredExpression as unknown as boolean | undefined}
			editable={internalField.editableExpression as unknown as boolean | undefined}
			collaborationEnabled={internalField.collaborationEnabled}
			visible={internalField.visible as unknown as boolean | undefined}
			mainPropertyRelativePath={internalField.mainPropertyRelativePath}
			customValueBinding={internalField.value?.slice(0, 1) === "{" ? internalField.value : undefined} // we don't need the customValueBinding set if internalField.value is not a binding as this is only used to enable binding refreshes
		>
			{template}
			{{ dependents: getPossibleValueHelpTemplate(internalField) }}
		</FieldAPI>
	);
}
