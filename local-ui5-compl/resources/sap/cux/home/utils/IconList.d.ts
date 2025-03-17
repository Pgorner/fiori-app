declare module "sap/cux/home/utils/IconList" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    const ICONS: Icons;
    type IconCollection = {
        title: string;
        icons: {
            [key: string]: string[];
        };
    };
    type Icons = {
        [key: string]: IconCollection;
    };
}
//# sourceMappingURL=IconList.d.ts.map