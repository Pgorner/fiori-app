/* eslint-disable */
sap.ui.define([], function(){
    var isPhone = false;
    var sDevice = isPhone ? "phone" : "desktop";
    var iSegmentsInGeneralTeaser = 2;

    return {
        isPhone,
        sDevice,
        iSegmentsInGeneralTeaser
    };
});