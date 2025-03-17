/// <reference types="openui5" />
declare module "sap/cards/ap/common/formatters/CardFormatters" {
    import UI5Date from "sap/ui/core/date/UI5Date";
    const CriticalityConstants: {
        StateValues: {
            None: string;
            Negative: string;
            Critical: string;
            Positive: string;
        };
        ColorValues: {
            None: string;
            Negative: string;
            Critical: string;
            Positive: string;
        };
    };
    const CriticalityTypes: {
        Negative: string;
        Critical: string;
        Positive: string;
        Information: string;
    };
    type Criticality = {
        EnumMember: string;
    };
    type CriticalityState = {
        None: string;
        Negative: string;
        Critical: string;
        Positive: string;
    };
    type KPIFormatterConfig = {
        NumberOfFractionalDigits: number;
        percentageAvailable: boolean;
    };
    type CurrencyFormatterConfig = {
        scaleFactor: number;
        numberOfFractionalDigits: number;
    };
    type TargetFormatterConfig = {
        NumberOfFractionalDigits: number;
        manifestTarget: number;
    };
    type TrendIconFormatterConfig = {
        bIsRefValBinding: boolean;
        bIsDownDiffBinding: boolean;
        bIsUpDiffBinding: boolean;
        referenceValue: number;
        downDifference: number;
        upDifference: number;
    };
    type DateFormatterConfig = {
        UTC: boolean;
    };
    type NumberFormatterConfig = {
        numberOfFractionalDigits: number;
        style: string;
        showScale: boolean;
        scaleFactor: number;
        maxFractionDigits: number;
        minFractionDigits: number;
        shortRefNumber: number;
    };
    type ValueColorFormatterConfig = {
        sImprovementDirection: string;
        bIsDeviationLowBinding: boolean;
        bIsDeviationHighBinding: boolean;
        bIsToleranceLowBinding: boolean;
        bIsToleranceHighBinding: boolean;
        deviationLow: number;
        deviationHigh: number;
        toleranceLow: number;
        toleranceHigh: number;
        oCriticalityConfigValues: CriticalityState;
    };
    /**
     * Checks if the provided string ends with the specified suffix.
     *
     *  @param {string} value The string to check.
     *  @param {string} suffix The suffix to look for.
     *  @return {string | boolean} Returns true if the string ends with the suffix, otherwise false.
     *
     */
    const endsWith: (value: string, suffix: string) => boolean;
    /**
     * Returns the criticality state for the provided criticality value.
     *
     * @param {Criticality | undefined} criticality - The criticality value containing an EnumMember with criticality values.
     * @param {CriticalityState | undefined} criticalityState - The criticality state values for the criticality values.
     * @return {string} - The criticality state for the provided criticality value.
     */
    const criticality2state: (criticality: Criticality, criticalityState: CriticalityState | undefined) => string;
    /**
     * Returns the trend icon for the provided aggregate value.
     *
     * @param {number | string} aggregateValue - The value provided to get the trend icon based on the values of referenceValue, downDifferenceValue, and upDifferenceValue.
     * @param {number} referenceValue - The reference value used to calculate the trend direction.
     * @param {number} downDifferenceValue - The threshold for determining a "Down" trend.
     * @param {number} upDifferenceValue - The threshold for determining an "Up" trend.
     * @return {string | undefined} - Returns the trend icon for the provided aggregate value.
     */
    const calculateTrendDirection: (aggregateValue: number | string, referenceValue: number, downDifferenceValue: number, upDifferenceValue: number) => string | undefined;
    /**
     * Returns the criticality state for the provided value.
     *
     *  @param  {number} value value provided for which criticality state is returned based on the improvement direction value provided
     *  @param  {string} improvementDirection If this value is Minimize/Minimizing, toleranceHigh/deviationHigh will be used for getting criticality state
                                        If this value is Maximize/Maximizing, toleranceLow/deviationLow will be used for getting criticality state
                                        If this value is Target, toleranceLow,toleranceHigh /deviationLow,deviationHigh will be used for getting criticality state
     *  @param  {string | number} deviationLowValue value provided used in getting criticality state when improvement direction is Maximize/Maximizing
     *  @param  {string | number} deviationHighValue value provided used in getting criticality state when improvement direction is Minimize/Minimizing
     *  @param  {string | number} toleranceLowValue  value provided used in getting criticality state when improvement direction is Maximize/Maximizing
     *  @param  {string | number} toleranceHighValue value provided used in getting criticality state when improvement direction is Minimize/Minimizing
     *  @param  {CriticalityState} criticalityState will have criticality state values for EnumMember of oCriticality provided to criticality2state()
     *  @return {string | undefined} returns criticality state for the value provided based on the improvement direction value provided
     *
     */
    const calculateCriticalityState: (value: number, improvementDirection: string, deviationLowValue: string | number, deviationHighValue: string | number, toleranceLowValue: string | number, toleranceHighValue: string | number, criticalityState: CriticalityState) => string;
    /**
     * Returns formatted KPI value.
     *
     * @param {string} value
     * @param {KPIFormatterConfig} formatterOptions
     * @param {boolean} isUnit - Determines the formatting style based on percentage availability.
     * @return {string} - Returns formatted KPI value.
     */
    const formatKPIValue: (value: string, formatterOptions: KPIFormatterConfig, isUnit: boolean) => string;
    /**
     * Returns formatted date value based on the provided pattern.
     *
     * @param {string} value - The value to be formatted. If 'YYYYM', pattern is 'yearmonth', <M> no of months will be added to the <YYYY> in the date formatted.
     *                                   If 'YYYYQ', pattern is 'yearquarter', <Q> no of quarters will be added to the <YYYY> in the date formatted.
     *                                   If 'YYYYW', pattern is 'yearweek', <W> no of weeks will be added to the <YYYY> in the date formatted.
     * @param {string} pattern - The pattern provided which can be 'yearmonth', 'yearquarter', or 'yearweek'.
     * @return {UI5Date | Date | undefined} - Returns formatted date value based on the provided pattern.
     */
    const formatDateValue: (value: string, pattern: string) => UI5Date | Date | undefined;
    /**
     * Returns formatted target value.
     *
     * @param {number} kpiValue - The KPI value provided which will be taken as scale factor when it is not zero.
     * @param {number} targetValue - The target value provided which will be formatted based on the number of fractional digits & scale factor.
     *                                If this is undefined, manifestTarget of formatterOptions will be used as value to be formatted.
     *                                This will be taken as scale factor when KPI value provided is zero.
     * @param {TargetFormatterConfig} formatterOptions - Can have manifestTarget and will have NumberOfFractionalDigits.
     * @return {string | undefined} - Returns formatted target value based on provided KPI value and target value.
     */
    const targetValueFormatter: (kpiValue: number, targetValue: number, formatterOptions: TargetFormatterConfig) => string | undefined;
    /**
     *  Returns the criticality state for the provided value.
     *
     *  @param  {number} value value provided to get the criticality state based on properties of staticValues provided
     *  @param  {ValueColorFormatterConfig} formatterOptions will have values of improvement direction, bIsDeviationLowBinding, bIsDeviationHighBinding, bIsToleranceLowBinding, bIsToleranceHighBinding, deviationLow, deviationHigh, toleranceLow, toleranceHigh, oCriticalityConfigValues
     *  @param  {number} defaultValue value for deviationLow, deviationHigh, toleranceLow, toleranceHigh which will be provided to calculateCriticalityState(), when bIsDeviationLowBinding, bIsDeviationHighBinding, bIsToleranceLowBinding, bIsToleranceHighBinding informatterOptions is true
     *  @return {string | undefined} returns criticality state for the value provided
     *
     */
    const formatValueColor: (value: number, formatterOptions: ValueColorFormatterConfig, defaultValue: number) => string;
    /**
     * Returns the trend icon for the provided value.
     *
     * @param {number | string} value - The value provided which will be passed to calculateTrendDirection() to get trend icon based on properties of formatterOptions provided.
     * @param {TrendIconFormatterConfig} formatterOptions - Contains properties referenceValue, downDifference, upDifference which will be provided for formatTrendIcon() to get trend icon.
     * @param {number} defaultValue - The default value for referenceValue, downDifference, upDifference in calculateTrendDirection(), when their respective bindings in formatterOptions are true.
     * @return {string | undefined} - Returns trend icon for the value provided.
     */
    const formatTrendIcon: (value: number | string, formatterOptions: TrendIconFormatterConfig, defaultValue: number) => string | undefined;
    /**
     * Returns formatted values of value1 & value2 provided, depending on values of formatterOptions.
     *
     * @param {string} value1 - Will be formatted based on values of formatterOptions & displayed if 0 is included in textFragments array.
     * @param {string} value2 - Will be formatted based on values of formatterOptions & displayed if 1 is included in textFragments array.
     * @param {NumberFormatterConfig | undefined} formatterOptions - Will have properties numberOfFractionalDigits, style, showScale, scaleFactor.
     * @param {Array<number>} textFragments - If provided array includes [1, 0] formatted values of value2, value1 will be displayed in that order.
     * @return {string} - Returns formatted values of value1 & value2 provided, depending on values of formatterOptions.
     */
    const formatNumber: (value1: string, value2: string, formatterOptions: NumberFormatterConfig | undefined, textFragments: Array<number>) => string;
    /**
     * Returns criticality values depending on provided sCriticality and type values.
     *
     * @param {string | number} criticalityValue - The value provided to get the criticality state.
     * @param {string} type - State criticality values will be returned if this value is 'state', color criticality values will be returned if this value is 'color'.
     * @return {string | undefined} - Returns criticality values based on provided criticality and type values.
     */
    const formatCriticality: (criticalityValue: string | number, type: string) => string | undefined;
    /**
     * Returns formatted percentage value.
     *
     * @param {string} value - The string value provided which will be appended with a percentage symbol.
     * @return {string} - Returns the string formatted with a percentage symbol.
     */
    const formatWithPercentage: (value?: string) => string;
    /**
     * Returns computed percentage value.
     *
     * @param {string | number} value - Value to be divided by the target provided.
     * @param {string | number} target - Target provided to divide the value provided to compute percentage.
     * @param {string} [isUnit] - Optional parameter, when '%' is provided target is not used to calculate percentage.
     * @return {string} - Returns percentage value computed.
     */
    const computePercentage: (value: string | number, target: string | number, isUnit?: string) => string | undefined;
    /**
     * Returns message for the provided criticality state.
     *
     * @param {string | number} value - Criticality state provided.
     * @return {string | undefined} - Returns criticality icon message based on the provided criticality state.
     */
    const formatCriticalityIcon: (value?: string | number) => string;
    /**
     * Returns criticality button type based on the criticality state provided.
     *
     * @param {string | number} val - Criticality state provided.
     * @return {string} - Returns criticality button type based on the provided criticality state.
     */
    const formatCriticalityButtonType: (val?: string | number) => string;
    /**
     * Returns formatted string value after replacing tab space \t with a white space & a non-breaking whitespace.
     *
     * @param {string | boolean | number} value - Value provided to be formatted if it's a string; otherwise, the provided value will be returned.
     * @return {string} - Returns formatted string value after replacing tab spaces with a white space & a non-breaking whitespace.
     */
    const formatToKeepWhitespace: (value: string | boolean | number) => string;
    /**
     * Returns percentage change based on provided kpiValue & targetValue.
     *
     * @param {number | string} kpiValue - The value provided from which target value provided will be subtracted to calculate percentage change.
     * @param {number | string} targetValue - The value provided which will be subtracted from the kpi value provided to calculate percentage change.
     * @param {TargetFormatterConfig} formatterOptions - Contains number of fractional digits to be displayed with percentage change.
     * @return {string | undefined} - Returns calculated percentage change.
     */
    const returnPercentageChange: (kpiValue: number | string, targetValue: number | string, formatterOptions: TargetFormatterConfig) => string | undefined;
    /**
     * Returns formatted currency value based on the number of fractional digits, scale factor, currency code text, and currency unit.
     *
     * @param {number} value - Value provided which will be formatted with currency unit and type based on the number of fractional digits & scale factor.
     * @param {CurrencyFormatterConfig} formatterOptions - Contains number of fractional digits & scale factor.
     * @param {boolean} bIncludeText - Determines if the currency type should be appended.
     * @param {string} sCurrency - Currency unit provided, currency value will be prefixed with this currency unit.
     * @param {string} sCurrencyCodeText - Currency type provided, currency value will be suffixed with this currency type if bIncludeText is true.
     * @return {string} - Returns formatted currency value.
     */
    const formatCurrency: (value: float, formatterOptions: CurrencyFormatterConfig, includeText: boolean, currency: string, currencyCodeText: string) => string;
    /**
     * Returns formatted value of provided header count.
     *
     * @param {string | number} sValue - Part of the value provided before separator. Will be rounded off with no of fractional digits 1 & 1000 as scale factor.
     * @return {string | undefined} - Returns formatted header count value.
     */
    const formatHeaderCount: (value: string | number) => string | undefined;
    /**
     * Returns formatted value of provided date string.
     *
     * @param {string} dateValue - Date string provided which will be taken & formatted in pattern 'M/d/yy', if no locale value is provided to getInstance() of DateFormat.
     * @param {DateFormatterConfig} formatterOptions - Object having a boolean value which is used to format provided date string with respect to UTC if it is true.
     * @return {string | undefined} - Returns formatted date value based on oLocale & UTC value provided, default oLocale value is "en-US".
     */
    const formatDate: (dateValue: string, formatterOptions: DateFormatterConfig) => string | undefined;
    /**
     * Returns criticality state for the provided criticality value.
     *
     * @param {string | number} value - Provided value based on which EnumMember of criticality is selected. This is provided to criticality2state() further to get criticality state.
     * @return {string | undefined} - Returns criticality state for the provided criticality value.
     */
    const kpiValueCriticality: (value: string | number) => string;
    /**
     * Returns criticality value state for the provided criticality value.
     *
     * @param {string | number} value - Provided value which is used to get criticality value state.
     * @return {string | undefined} - Returns criticality value state for the provided criticality value.
     */
    const formatCriticalityValueState: (value?: string | number) => string | undefined;
    /**
     * Returns criticality color value for the provided criticality value.
     *
     * @param {string | number} value - Provided value which is used to get criticality color value.
     * @return {string} - Returns criticality color value for the provided criticality value.
     */
    const formatCriticalityColorMicroChart: (value?: string | number) => string;
    const getFormatters: () => {
        formatKPIValue: (value: string, formatterOptions: KPIFormatterConfig, isUnit: boolean) => string;
        formatDateValue: (value: string, pattern: string) => UI5Date | Date | undefined;
        targetValueFormatter: (kpiValue: number, targetValue: number, formatterOptions: TargetFormatterConfig) => string | undefined;
        formatValueColor: (value: number, formatterOptions: ValueColorFormatterConfig, defaultValue: number) => string;
        formatTrendIcon: (value: number | string, formatterOptions: TrendIconFormatterConfig, defaultValue: number) => string | undefined;
        formatNumber: (value1: string, value2: string, formatterOptions: NumberFormatterConfig | undefined, textFragments: Array<number>) => string;
        formatCriticality: (criticalityValue: string | number, type: string) => string | undefined;
        formatWithPercentage: (value?: string) => string;
        computePercentage: (value: string | number, target: string | number, isUnit?: string) => string | undefined;
        formatCriticalityIcon: (value?: string | number) => string;
        formatCriticalityButtonType: (val?: string | number) => string;
        formatToKeepWhitespace: (value: string | boolean | number) => string;
        returnPercentageChange: (kpiValue: number | string, targetValue: number | string, formatterOptions: TargetFormatterConfig) => string | undefined;
        formatCurrency: (value: float, formatterOptions: CurrencyFormatterConfig, includeText: boolean, currency: string, currencyCodeText: string) => string;
        formatHeaderCount: (value: string | number) => string | undefined;
        formatDate: (dateValue: string, formatterOptions: DateFormatterConfig) => string | undefined;
        kpiValueCriticality: (value: string | number) => string;
        formatCriticalityValueState: (value?: string | number) => string | undefined;
        formatCriticalityColorMicroChart: (value?: string | number) => string;
    };
}
//# sourceMappingURL=CardFormatters.d.ts.map