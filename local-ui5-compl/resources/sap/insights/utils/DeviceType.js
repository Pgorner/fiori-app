/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/Device","./AppConstants"],function(e,i,t){"use strict";var s={phone:240,tablet:600,desktop:1024,xxsmall:240,xsmall:320,small:480,medium:560,large:768,xlarge:960,xxlarge:1120,xxxlarge:1440};var a=e.extend("sap.insights.utils.DeviceType",{});a.getDeviceType=function(){var e;if(i.resize.width>=s.xsmall&&i.resize.width<s.tablet){e=t.DEVICE_TYPES.Mobile}else if(i.resize.width>=s.tablet&&i.resize.width<s.desktop){e=t.DEVICE_TYPES.Tablet}else{e=t.DEVICE_TYPES.Desktop}return e};a.getDialogBasedDevice=function(){var e;if(i.resize.width<1024){e=t.DEVICE_TYPES.Mobile}else{e=t.DEVICE_TYPES.Desktop}return e};a.getDeviceWidth=function(){return i.resize.width};return a});
//# sourceMappingURL=DeviceType.js.map