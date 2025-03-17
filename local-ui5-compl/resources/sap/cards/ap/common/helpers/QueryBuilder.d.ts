declare module "sap/cards/ap/common/helpers/QueryBuilder" {
    /**
     * Updates the content URL with expand query parameters for an integration card.
     *
     * This function checks if the content URL already contains a placeholder for expand query parameters.
     * If not, it appends this placeholder to the URL. Then, it retrieves the expand query parameters from
     * the integration card manifest. If no parameters are found, it removes the placeholder from the URL.
     * Otherwise, it replaces the placeholder with the actual expand query parameters.
     *
     * @param {string} contentUrl - The original content URL that may or may not contain the expand query placeholder.
     * @param {CardManifest} integrationCardManifest - The manifest of the integration card, which includes configuration for expand queries.
     * @returns {string} The updated content URL with the appropriate expand query parameters inserted, or the placeholder removed if no parameters are found.
     */
    const updateExpandQuery: (contentUrl: string, integrationCardManifest: CardManifest) => string;
    /**
     * Separates expand query parameters into navigation properties with select queries and standalone navigation properties.
     *
     * This function processes an array of expand query parameters and categorizes them into two groups:
     * - Navigation properties with select queries: These are properties that include nested select queries, indicated by parentheses.
     * - Standalone navigation properties: These are properties without nested select queries.
     *
     * The categorization is achieved by iterating through the expand query parameters and using a stack to track
     * nested structures. The function identifies parameters that start with an opening bracket but do not close,
     * parameters that close but do not open, and parameters that are standalone or fully enclosed within brackets.
     *
     * @param {string[]} expandQueryParams - An array of expand query parameters to be categorized.
     * @returns {{ navigationPropertiesWithSelect: string[], navigationProperties: string[] }} An object containing two arrays:
     *          `navigationPropertiesWithSelect` for properties with select queries, and `navigationProperties` for standalone properties.
     */
    const getSeparatedProperties: (expandQueryParams: string[]) => {
        navigationPropertiesWithSelect: string[];
        navigationProperties: string[];
    };
    /**
     * Formats the expand query parameters for OData requests.
     *
     * This function takes a map where each key represents a navigation property and its value is an array of properties to select.
     * It constructs a string for the `$expand` query parameter of an OData request. For navigation properties without any select
     * properties, it appends just the property name. For those with select properties, it appends the property name followed by
     * `($select=...)` specifying the properties to select. The resulting string is a comma-separated list of these formatted properties,
     * suitable for inclusion in an OData query URL.
     *
     * @param {Map<string, string[]>} mapProperties - A map where keys are navigation property names and values are arrays of property names to select.
     * @returns {string} A formatted string representing the `$expand` query parameter for an OData request.
     */
    const formatExpandQuery: (mapProperties: Map<string, string[]>) => string;
    /**
     * Formats the expand query parameters for OData requests.
     *
     * This function takes an array of expand query parameters and separates them into two categories:
     * navigation properties with select queries and standalone navigation properties. It then constructs
     * a map where each key is a navigation property and its value is an array of properties to select.
     * For navigation properties with select queries, it parses and aggregates the properties to select.
     * Standalone navigation properties are added with an empty array as their value. Finally, it formats
     * this map into a string suitable for the `$expand` query parameter in an OData request.
     *
     * @param {string[]} expandQueryParams - An array of expand query parameters to be formatted.
     * @returns {string} A formatted string representing the `$expand` query parameter for an OData request.
     */
    const getFormattedExpandQuery: (expandQueryParams: string[]) => string;
    /**
     *
     * Function to get the expand query parameters for the adaptive card content url
     *
     * @param cardManifest
     * @returns
     */
    const getExpandQueryParams: (cardManifest: CardManifest) => string;
    /**
     * Function to form the select query parameters for the adaptive card content url
     *
     * @param cardManifest
     * @returns {string} The select query parameters
     * @private
     */
    const getSelectQueryParams: (cardManifest: CardManifest) => string;
    /**
     * Updates the content URL with select query parameters for an integration card.
     *
     * This function checks if the content URL already contains a placeholder for select query parameters.
     * If not, it appends this placeholder to the URL. Then, it retrieves the select query parameters from
     * the integration card manifest. If parameters are found, it replaces the placeholder in the URL with
     * these parameters. Otherwise, it removes the placeholder from the URL, preparing it for potential
     * expansion handling in the future.
     *
     * @param {string} contentUrl - The original content URL that may or may not contain the select query placeholder.
     * @param {CardManifest} integrationCardManifest - The manifest of the integration card, which includes configuration for select queries.
     * @returns {string} The updated content URL with the appropriate select query parameters inserted, or the placeholder removed if no parameters are found.
     */
    const updateSelectQuery: (contentUrl: string, integrationCardManifest: CardManifest) => string;
}
//# sourceMappingURL=QueryBuilder.d.ts.map