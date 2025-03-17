/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../sina/SinaObject"], function (___sina_SinaObject) {
  "use strict";

  const SinaObject = ___sina_SinaObject["SinaObject"];
  class AbstractProvider extends SinaObject {
    label;
    serverInfo;

    // abstract supports(service: any, capability: any): boolean;
    // abstract loadServerInfo(): Promise<{}>;
    // abstract loadBusinessObjectDataSources(): Promise<any>;
    // abstract assembleOrderBy(query: Query): Array<any>;
    // abstract translateOrder(order: string): string;

    // abstract getFilterValueFromConditionTree(dimension: any, conditionTree: any);
    // abstract buildQueryUrl(queryPrefix: string, queryPostfix: string): string;
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    logUserEvent(userEvent) {}
    getDebugInfo() {
      return "ESH Search API Provider: " + this.id;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isQueryPropertySupported(path) {
      // currently only implemented in abap odata provider
      return false;
    }
    async resetPersonalizedSearchDataAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    config) {
      // currently only implemented in abap odata and inav2 provider
      return Promise.resolve();
    }
    // async saveConfigurationAsync(config: Configuration): Promise<any> {
    //     // currently only implemented in abap odata and inav2 provider
    //     return;
    // }
  }
  var __exports = {
    __esModule: true
  };
  __exports.AbstractProvider = AbstractProvider;
  return __exports;
});
})();