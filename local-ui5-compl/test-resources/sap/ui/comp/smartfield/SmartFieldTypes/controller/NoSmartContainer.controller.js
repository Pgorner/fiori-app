sap.ui.define([
    'test/sap/ui/comp/smartfield/SmartFieldTypes/controller/BaseController',
    "sap/ui/comp/smartfield/SmartField",
    "sap/ui/comp/smartfield/SmartLabel"
], function(
    BaseController,
    SmartField,
    SmartLabel
) {
	"use strict";

	return BaseController.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.controller.NoSmartContainer", {
		onInit: function() {
			this.oDetail = this.byId("detail");

			this.setModelAndBindings("NoSmartContainer");
            const oVBox = this.byId("myVbox");
            const oVBoxLabel = this.byId("myVboxLabel");

            const oSmartLabel = new SmartLabel({visible: false});
            oSmartLabel.setLabelFor("myField");
            oVBoxLabel.addItem(oSmartLabel);

            this.oSmartLabel = oSmartLabel;

            setTimeout(function () {
                const oSmartField = new SmartField("myField", {visible: false, value: "{ProductId}"});
                oVBox.addItem(oSmartField);
                this._oSmartField = oSmartField;
            }.bind(this), 0);

		},
        doClone: function () {
            var oClone = this.byId("ListItem").clone();
            this.byId("List").addItem(oClone);
            window.clone2 = oClone.getContent()[0];
        },
        setVisible: function () {
            this._oSmartField.setVisible(true);
        }
    });
});