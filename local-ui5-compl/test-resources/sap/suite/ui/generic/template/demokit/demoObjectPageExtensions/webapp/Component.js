sap.ui.define(["sap/suite/ui/generic/template/lib/AppComponent",
               "utils/Utils"
               ],
	/************************************
	 * Reason for suppressing UI5 linter
	 ************************************
	 * UI5 linter throws warning for the metadata as it expects the metadata in object notation.
	 * As the manifest data is computed dynamically (using URL parameters), the regular object notation can't be used.
	 * Hence, suppressing the UI5 linter warning.
	 */
	/* ui5lint-disable async-component-flags */
	function(AppComponent, Utils) {
		return AppComponent.extend("demoObjectPageExtensions.Component", {
		metadata: Utils.getManifest()
	});
	/* ui5lint-enable */
});