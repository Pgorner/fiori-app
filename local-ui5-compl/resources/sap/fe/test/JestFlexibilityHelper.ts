export function createFlexibilityChangesObject(viewId: String, flexChanges: { [x: string]: object[] }): object {
	const FILENAME = "id_1656068872000_483_flVariant";
	const viewIdPrefix = viewId + "--";
	const variantDependentControlChanges = getVariantDependentControlChanges(flexChanges, FILENAME, viewIdPrefix) ?? [];
	const changes = getChanges(flexChanges) ?? [];

	return {
		appDescriptorChanges: [],
		//changes: changes,
		ui2personalization: {},
		comp: {
			variants: [],
			changes: [],
			defaultVariants: [],
			standardVariants: []
		},
		changes: {
			changes,
			variants: [
				{
					fileName: FILENAME,
					fileType: "ctrl_variant",
					variantManagementReference: `${viewIdPrefix}fe::PageVariantManagement`,
					variantReference: `${viewIdPrefix}fe::PageVariantManagement`,
					reference: "catalog-admin-ui.Component",
					packageName: "$TMP",
					content: {
						title: "Default with additional fields and cols"
					},
					self: `apps/catalog-admin-ui/variants/${FILENAME}.ctrl_variant`,
					layer: "USER",
					texts: {},
					namespace: "apps/catalog-admin-ui/variants/",
					creation: "2022-06-24T11:07:52.139Z",
					originalLanguage: "EN",
					conditions: {},
					contexts: {},
					support: {
						generator: "Change.createInitialFileContent",
						service: "",
						user: "",
						sapui5Version: "1.80.0"
					}
				}
			],
			variantChanges: [
				{
					fileName: "id_1656068872134_509_setExecuteOnSelect",
					fileType: "ctrl_variant_change",
					changeType: "setExecuteOnSelect",
					moduleName: "",
					reference: "catalog-admin-ui.Component",
					packageName: "$TMP",
					content: {
						executeOnSelect: true
					},
					selector: {
						id: FILENAME,
						idIsLocal: false
					},
					layer: "USER",
					texts: {},
					namespace: "apps/catalog-admin-ui/changes/",
					projectId: "catalog-admin-ui",
					creation: "2022-06-24T11:07:52.146Z",
					originalLanguage: "EN",
					support: {
						generator: "Change.createInitialFileContent",
						service: "",
						user: "",
						sapui5Version: "1.80.0",
						sourceChangeFileName: "",
						compositeCommand: "",
						command: ""
					},
					oDataInformation: {},
					dependentSelector: {},
					jsOnly: false,
					variantReference: "",
					appDescriptorChange: false
				}
			],
			variantDependentControlChanges: variantDependentControlChanges,
			variantManagementChanges: [
				{
					fileName: "id_1656068872132_508_setDefault",
					fileType: "ctrl_variant_management_change",
					changeType: "setDefault",
					moduleName: "",
					reference: "catalog-admin-ui.Component",
					packageName: "$TMP",
					content: {
						defaultVariant: FILENAME
					},
					selector: {
						id: `${viewIdPrefix}fe::PageVariantManagement`,
						idIsLocal: false
					},
					layer: "USER",
					texts: {},
					namespace: "apps/catalog-admin-ui/changes/",
					projectId: "catalog-admin-ui",
					creation: "2022-06-24T11:07:52.145Z",
					originalLanguage: "EN",
					support: {
						generator: "Change.createInitialFileContent",
						service: "",
						user: "",
						sapui5Version: "1.80.0",
						sourceChangeFileName: "",
						compositeCommand: "",
						command: ""
					},
					oDataInformation: {},
					dependentSelector: {},
					jsOnly: false,
					variantReference: "",
					appDescriptorChange: false
				}
			]
		},

		cacheKey: "1432039092"
	};
}

function getVariantDependentControlChanges(flexChanges: { [x: string]: any[] }, filename: string, viewIdPrefix: string) {
	return flexChanges.variantDependentControlChanges?.map((variant) => {
		variant.variantReference = filename;
		variant.selector.id = viewIdPrefix + variant.selector.id;
		return variant;
	});
}

function getChanges(flexChanges: { [x: string]: any[] }) {
	return flexChanges.changes?.map((variant) => {
		return variant;
	});
}
