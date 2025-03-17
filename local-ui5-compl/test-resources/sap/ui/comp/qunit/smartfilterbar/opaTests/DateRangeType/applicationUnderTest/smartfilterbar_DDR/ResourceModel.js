sap.ui.define(["sap/ui/model/resource/ResourceModel"],
	function (ResourceModel) {
		"use strict";
		var oResourceModels = {

			/**
			 * Returns the ResourceModel .
			 * @param {string} sName The name of i18n file to be read
			 * @returns {object} Return the resource model
			 *
			 * @protected
			 */
			getI18nModel: function (sName) {
				var sBundleName = ["applicationUnderTest.smartfilterbar_DDR.i18n.", sName].join("");
				return new ResourceModel({
					bundleName: sBundleName
				});
			},

			/**
			 * Returns the resource model of the i18n File
			 * @returns {object} Return the resource model of given filename
			 *
			 * @protected
			 */
			geti18nResourceModel: function () {
				var oResourceModel = this.getI18nModel("i18n");
				return oResourceModel.getResourceBundle();
			}

		};
		return oResourceModels;
	}, /* bExport= */ true);
