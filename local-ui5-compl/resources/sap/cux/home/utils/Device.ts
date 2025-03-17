/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Device from "sap/ui/Device";

/** Device widths in px */
const DeviceWidth = {
	Mobile: 600,
	Tablet: 1024,
	Desktop: 1440
};

export enum DeviceType {
	Mobile = "Mobile",
	Tablet = "Tablet",
	Desktop = "Desktop",
	LargeDesktop = "LargeDesktop"
}

/**
 * Calculates the device type based on the given width.
 *
 * @param {number} [width=Device.resize.width] - The width of the device. Defaults to the current device width.
 * @returns {DeviceType} - The calculated device type.
 */
export function calculateDeviceType(width: number = Device.resize.width): DeviceType {
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
export function fetchElementProperties(domRef: Element, properties: string[]): Record<string, number> {
	const oProperties: Record<string, number> = {};
	properties.forEach((property) => {
		oProperties[property] = parseFloat(window.getComputedStyle(domRef).getPropertyValue(property));
	});

	return oProperties;
}
