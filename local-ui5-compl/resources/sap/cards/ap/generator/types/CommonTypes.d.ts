declare module "sap/cards/ap/generator/types/CommonTypes" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    enum ColorIndicator {
        Error = "Error",
        Success = "Good",
        None = "Neutral",
        Warning = "Critical",
        Critical = "Warning",
        Good = "Success",
        Neutral = "None"
    }
    type CriticalityValue = {
        activeCalculation?: boolean;
        name?: string;
        deviationRangeLowValue?: string;
        deviationRangeHighValue?: string;
        toleranceRangeLowValue?: string;
        toleranceRangeHighValue?: string;
        improvementDirection?: string;
    };
}
//# sourceMappingURL=CommonTypes.d.ts.map