declare module "sap/cux/home/utils/CardSkeleton" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    const CardSkeleton: {
        _version: string;
        "sap.app": {
            id: string;
            type: string;
            title: string;
            subTitle: string;
            applicationVersion: {
                version: string;
            };
            shortTitle: string;
            info: string;
            description: string;
            tags: {
                keywords: string[];
            };
        };
        "sap.card": {
            extension: string;
            type: string;
            header: {
                title: string;
                subTitle: string;
            };
            content: {
                data: {
                    request: {
                        url: string;
                        method: string;
                        parameters: {
                            $format: string;
                        };
                    };
                    path: string;
                };
                item: {
                    title: string;
                    description: string;
                    attributesLayoutType: string;
                    attributes: {
                        value: string;
                    }[];
                };
                maxItems: number;
            };
        };
    };
}
//# sourceMappingURL=CardSkeleton.d.ts.map