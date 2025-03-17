sap.ui.define([
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/statusindicator/util/AnimationPropertiesResolver",
	"sap/suite/ui/commons/statusindicator/StatusIndicator",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (library, AnimationPropertiesResolver, StatusIndicator, sinon) {
	"use strict";

	var Factory = function () {};

	Factory.prototype.createStatusIndicator = function () {
		return sinon.createStubInstance(StatusIndicator);
	};

	Factory.prototype.createDummyPropertiesResolver = function (bIsSemantic) {
		var oInstance = sinon.createStubInstance(AnimationPropertiesResolver);
		oInstance._getStatusIndicatorValue.returns(20);
		oInstance.getValue.returns(20);
		if (bIsSemantic) {
			oInstance.getColor.returns("Critical");
		} else {
			oInstance.getColor.returns("#123456");
		}
		
		return oInstance;
	};

	return new Factory();
});