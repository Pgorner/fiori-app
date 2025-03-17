declare module "sap/cux/home/utils/Device" {
    /** Device widths in px */
    const DeviceWidth: {
        Mobile: number;
        Tablet: number;
        Desktop: number;
    };
    enum DeviceType {
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
    function calculateDeviceType(width?: number): DeviceType;
    /**
     * Fetches the specified CSS properties of a given DOM element and returns them as a record.
     *
     * @param {Element} domRef - The DOM element from which to fetch the properties.
     * @param {string[]} properties - An array of property names to fetch.
     * @returns {Record<string, number>} - A record where the keys are property names and the values are the corresponding property values as numbers.
     */
    function fetchElementProperties(domRef: Element, properties: string[]): Record<string, number>;
}
//# sourceMappingURL=Device.d.ts.map