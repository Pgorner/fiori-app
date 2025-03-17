window["sap-ushell-config"] = {
	defaultRenderer: "fiori2",
	renderers: {
		defaultRenderer: "fiori2",
		fiori2: {
			componentData: {
				config: {
					enablePersonalization: false,
					enableSearch: false,
					search: "hidden",
					appState: "headerless",
					rootIntent: "SO0-display"
				}
			}
		}
	},
	services: {
		AppState: {
			config: {
				transient: false
			}
		},
		ClientSideTargetResolution: {
			adapter: {
				config: {
					inbounds: {
						"SO0-display": {
							semanticObject: "SO0",
							action: "display",
							title: "SO0",
							signature: {
								additionalParameters: "allowed",
								parameters: {
									"sap-tag": {
										defaultValue: {
											format: "value",
											value: "primaryAction"
										}
									}
								}
							},
							resolutionResult: {
								additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.ReceiveParametersTestApp",
								appId: "#Action-toshowparameters",
								applicationType: "URL",
								url: "/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
								description: ""
							}
						},
						"SO1-display": {
							semanticObject: "SO1",
							action: "display",
							title: "SO1",
							signature: {
								additionalParameters: "allowed",
								parameters: {
									"sap-tag": {
										defaultValue: {
											format: "value",
											value: "superiorAction"
										}
									}
								}
							},
							resolutionResult: {
								additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.ReceiveParametersTestApp",
								appId: "#Action-toshowparameters",
								applicationType: "URL",
								url: "/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
								description: ""
							}
						},
						"SO2-display": {
							semanticObject: "SO2",
							action: "display",
							title: "SO2",
							signature: {
								additionalParameters: "allowed",
								parameters: {
									"sap-tag": {
										defaultValue: {
											format: "value",
											value: "superiorAction"
										}
									}
								}
							},
							resolutionResult: {
								additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.ReceiveParametersTestApp",
								appId: "#Action-toshowparameters",
								applicationType: "URL",
								url: "/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
								description: ""
							}
						}
					}
				}
			}
		}
	},
	applications: {
		"FieldQuickview-display": {
			additionalInformation: "SAPUI5.Component=sap.fe.core.fpmExplorer.fieldQuickView.FieldQuickView",
			applicationType: "URL",
			url: "./field/fieldQuickView/",
			title: "Field QuickView",
			description: "Field QuickView"
		},
		"Action-toshowparameters": {
			additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.ReceiveParametersTestApp",
			applicationType: "URL",
			url: "/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
			description: ""
		}
	}
};
