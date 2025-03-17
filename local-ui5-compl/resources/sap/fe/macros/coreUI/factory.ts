import type AppComponent from "sap/fe/core/AppComponent";
import { setCoreUIFactory, type CoreUIFactory, type StandardDialog, type StandardParameterDialog } from "sap/fe/core/UIProvider";
import CreateDialog from "sap/fe/macros/coreUI/CreateDialog";
import ParameterDialog from "sap/fe/macros/coreUI/ParameterDialog";
import type Control from "sap/ui/core/Control";
import type ODataV4Context from "sap/ui/model/odata/v4/Context";

const factory: CoreUIFactory = {
	newCreateDialog(
		contextToUpdate: ODataV4Context,
		fieldNames: string[],
		appComponent: AppComponent,
		mode: "Standalone" | "WithNavigation",
		parentControl?: Control
	): StandardDialog {
		return new CreateDialog(contextToUpdate, fieldNames, appComponent, mode, parentControl);
	},
	newParameterDialog(
		action,
		actionContext,
		parameters,
		parameterValues,
		entitySetName,
		view,
		messageHandler,
		strictHandlingUtilities,
		callbacks,
		ignoreETag
	): StandardParameterDialog {
		return new ParameterDialog(
			action,
			actionContext,
			parameters,
			parameterValues,
			entitySetName,
			view,
			messageHandler,
			strictHandlingUtilities,
			callbacks,
			ignoreETag
		);
	}
};

setCoreUIFactory(factory);
