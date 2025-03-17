/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/Device"], function (Device) {
  "use strict";

  /** Device widths in px */
  const DeviceWidth = {
    Mobile: 600,
    Tablet: 1024,
    Desktop: 1440
  };
  var DeviceType = /*#__PURE__*/function (DeviceType) {
    DeviceType["Mobile"] = "Mobile";
    DeviceType["Tablet"] = "Tablet";
    DeviceType["Desktop"] = "Desktop";
    DeviceType["LargeDesktop"] = "LargeDesktop";
    return DeviceType;
  }(DeviceType || {});
  /**
   * Calculates the device type based on the given width.
   *
   * @param {number} [width=Device.resize.width] - The width of the device. Defaults to the current device width.
   * @returns {DeviceType} - The calculated device type.
   */
  function calculateDeviceType() {
    let width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Device.resize.width;
    if (width < DeviceWidth.Mobile || Device.system.phone) {
      return DeviceType.Mobile;
    } else if (width < DeviceWidth.Tablet) {
      return DeviceType.Tablet;
    } else if (width < DeviceWidth.Desktop) {
      return DeviceType.Desktop;
    } else {
      return DeviceType.LargeDesktop;
    }
  }

  /**
   * Fetches the specified CSS properties of a given DOM element and returns them as a record.
   *
   * @param {Element} domRef - The DOM element from which to fetch the properties.
   * @param {string[]} properties - An array of property names to fetch.
   * @returns {Record<string, number>} - A record where the keys are property names and the values are the corresponding property values as numbers.
   */
  function fetchElementProperties(domRef, properties) {
    const oProperties = {};
    properties.forEach(property => {
      oProperties[property] = parseFloat(window.getComputedStyle(domRef).getPropertyValue(property));
    });
    return oProperties;
  }
  var __exports = {
    __esModule: true
  };
  __exports.DeviceType = DeviceType;
  __exports.calculateDeviceType = calculateDeviceType;
  __exports.fetchElementProperties = fetchElementProperties;
  return __exports;
});
//# sourceMappingURL=Device-dbg-dbg.js.map
