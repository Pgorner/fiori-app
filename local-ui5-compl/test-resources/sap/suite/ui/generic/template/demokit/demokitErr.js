sap.ui.define(["demokits/mockFunctions", "sap/m/Button", "sap/m/Label", "sap/m/ComboBox", "sap/m/HBox", "sap/ui/core/Item"],
	function(mockFunctions, Button, Label, ComboBox, HBox, Item) {
		"use strict";
	oML.log(MS_LOG_TAG_FLOW, "demokitErr:loading:");

	var oUriParameters = new URL(window.location.href).searchParams;
	var bMockLog = oUriParameters.get("mockLog") || false;
	var bMockBox = oUriParameters.get("mockBox") || false;
	var sMethod = oUriParameters.get("method") || 'GET';
	var iStatusCode = parseInt(oUriParameters.get("statusCode"),10) || 200;
	var sPath = oUriParameters.get("path") || "/.*/";
	var sMessages = oUriParameters.get("messages") || '';

	// show dialog only when requested
	if (bMockBox) {
		var oUpdate = new Button({
			press : onChange,
			text : 'Update URL'
		});
		// to prevent checkmarx from finding client cross frame scripting attacks -->
		var oMethodLabel = new Label({
			text : "Http-Method"
		});
		var oMethod = new ComboBox({
			items : [new Item({
				key : 'GET',
				text : "GET"
			}), new Item({
				key : 'POST',
				text : "POST"
			}), new Item({
				key : 'PUT',
				text : "PUT"
			}), new Item({
				key : 'DELETE',
				text : "DELETE"
			})]
		});

		var oStatusCodeLabel = new Label({
			text : "Status Code"
		});
		var oStatusCode = new ComboBox({
			items : [new Item({
				key : 200,
				text : "200"
			}), new Item({
				key : 201,
				text : "201"
			}), new Item({
				key : 202,
				text : "202"
			}), new Item({
				key : 400,
				text : "400"
			}), new Item({
				key : 401,
				text : "401"
			}), new Item({
				key : 403,
				text : "403"
			}), new Item({
				key : 404,
				text : "404"
			}), new Item({
				key : 423,
				text : "423"
			}), new Item({
				key : 500,
				text : "500"
			})]
		});

		var oPathLabel = new Label({
			text : "Path"
		});

		var oPath = new ComboBox({
			items : [new Item({
				key : '.*',
				text : ".*"
			}), new Item({
				key : '(Create|Copy|Delete|)',
				text : "(Create|Copy|Delete|)"
			}), new Item({
				key : '.*$expand.*',
				text : ".*$expand.*"
			}), new Item({
				key : '.*_ToCustomer.*',
				text : ".*ToCustomer.*"
			}), new Item({
				key : '.*$metadata.*',
				text : ".*$metadata.*"
			})]
		});

		var oMessagesLabel = new Label({
			text : "Messages"
		});

		var oMessage = new ComboBox({
			items : [new Item({
				key : 'E',
				text : "E"
			}), new Item({
				key : 'W',
				text : "W"
			}), new Item({
				key : 'I',
				text : "I"
			}), new Item({
				key : 'S',
				text : "S"
			}), new Item({
				key : 'W/Product',
				text : "W/Product"
			}), new Item({
				key : 'E/TRANSIENT',
				text : "E/TRANSIENT"
			}), new Item({
				key : 'W/TRANSIENT',
				text : "W/TRANSIENT"
			}), new Item({
				key : 'I/TRANSIENT',
				text : "I/TRANSIENT"
			}), new Item({
				key : 'S/TRANSIENT',
				text : "S/TRANSIENT"
			}), new Item({
				key : 'E,W,I,S',
				text : "E,W,I,S"
			})]
		});


		oMethod.setSelectedKey(sMethod);
		oStatusCode.setSelectedKey(iStatusCode);
		oPath.setValue(sPath);
		// oPath.setSelectedKey(sPath);
		oMessage.setValue(sMessages);
		// oMessage.setSelectedKey(sMessages);

		var oHBox = new HBox({
			items : [oMethodLabel, oMethod, oStatusCodeLabel, oStatusCode, oPathLabel, oPath, oMessagesLabel, oMessage, oUpdate]
		});
		oHBox.addStyleClass("mockSettings");
		oHBox.placeAt("content");
	} else {
		var oLabel = new Label({
			text : "Mock Server"
		});

		var oHBox = new HBox({
			items : [oLabel]
		});
		oHBox.addStyleClass("mockSettings");
		oHBox.placeAt("content");

	}


	function onChange() {
		oML.log(MS_LOG_TAG_FLOW, "demokitErr:onChange:");
		window.location.search = "?method=" + oMethod.getValue() + "&statusCode=" + oStatusCode.getValue() + "&path="
			+ oPath.getValue() + "&messages=" + oMessage.getValue() + "&mockLog=" + bMockLog + "&mockBox=" + bMockBox;
	}

},true);
