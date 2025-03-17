(function () {
	window["sap-ushell-config"] = {
		defaultRenderer : "fiori2",
		bootstrapPlugins: {
			"RuntimeAuthoringPlugin" : {
				component: "sap.ushell.plugins.rta",
				config: {
					validateAppVersion: false
				}
			}
		},
		renderers: {
			fiori2: {
				componentData: {
					config: {
						enableMergeAppAndShellHeaders: true,
						search: "hidden"
					}
				}
			}
		},
		applications: {
			"masterDetail-display": {
				"additionalInformation": "SAPUI5.Component=sap.ui.demoapps.rta.fiorielements",
				"applicationType": "URL",
				"url": "../",
				"description": "UI Adaptation at Runtime for SAP Fiori Elements",
				"title": "Products Manage"
			}
		},
		services: {
			ClientSideTargetResolution: {
                adapter: {
                    config: {
                        inbounds: {}
                    }
                }
            },
			EndUserFeedback: {
				adapter: {
					config: {
						enabled: true
					}
				}
			}
		}
	};
})();