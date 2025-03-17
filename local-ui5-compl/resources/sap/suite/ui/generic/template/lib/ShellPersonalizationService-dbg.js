sap.ui.define([
  "sap/ui/base/Object",
  "sap/base/util/extend",
  "sap/suite/ui/generic/template/genericUtilities/testableHelper",
  "sap/suite/ui/generic/template/genericUtilities/FeLogger"
], function (
  BaseObject,
  extend,
  testableHelper,
  FeLogger
) {
  "use strict";

  function getMethods({ oAppComponent }) {

    var shellPersonalizationService;
    var applicationPersonalizers = {};

    var sClassName = "lib.ShellPersonalizationService";
    var oLogger = new FeLogger(sClassName).getLogger();

    /**
     * Gets the personalizer from the shell service.
     * We set some defaults for the scope object.
     * @param persId Personalization object
     * @param scope Scope object
     * @param component
     * @returns {Promise<PersonalizerType> | undefined} Personalizer object which handles personalization
     */
    async function getPersonalizer(persId, scope, component) {
      if (!hasInitialized()) {
        oLogger.error("Personalization service is not initialized");
        return;
      }
      scope = {
        // merge some defaults
        keyCategory: shellPersonalizationService.constants.keyCategory.FIXED_KEY,
        writeFrequency: shellPersonalizationService.constants.writeFrequency.LOW,
        clientStorageAllowed: false,
        validity: Infinity,
        ...scope
      };
      return shellPersonalizationService.getPersonalizer(persId, scope, component);
    }

    /**
     * Prepares the container name for personalizer.
     * @returns Container name
     */
    function getContainerName() {
      // personalizer logs error if name longer than 40 symbols
      var sContainer = `App#${(oAppComponent).getManifest()["sap.app"].id}`;
      return sContainer;
    }

    /**
     * Initializes the personalizer to access the Application data stored in the shell Personalization.
     * @param {string} itemName The name of the item for which the personalizer is created.
     * @returns {Promise<PersonalizerType>} A personalizer
     */
    async function getApplicationPersonalizer(itemName) {
      if (!applicationPersonalizers[itemName]) {
        applicationPersonalizers[itemName] = getPersonalizer(
          {
            container: getContainerName(),
            item: itemName
          },
          {},
          oAppComponent
        );
      }
      return applicationPersonalizers[itemName];
    }

    /**
     * Returns data from the personalization service.
     * @param {string} itemName
     * @returns {Promise<object | undefined>} Data
     */
    async function getApplicationPersonalizationData(itemName) {
      var oAppPersonalizer = await getApplicationPersonalizer(itemName);
      var oPersData = await oAppPersonalizer?.getPersData();
      return oPersData;
    }

    /**
     * Stores an object in the personalization service.
     * @param {string} itemName
     * @param {object} data
     * @returns {Promise<void>} A promise
     */
    async function setApplicationPersonalizationData(itemName, data) {
      var oAppPersonalizer = await getApplicationPersonalizer(itemName);
      oAppPersonalizer.setPersData(data);
    }

    /**
     * Checks whether the shell personalization service has been initialized
     * @returns True or false
     */
    function hasInitialized() {
      return !!shellPersonalizationService;
    }

    /**
     * Initializes the shell personalization service
     */
    function init() {
      var UShellContainer = sap.ui.require("sap/ushell/Container");
      if (hasInitialized() || !UShellContainer) {
        return Promise.resolve();
      }
      return UShellContainer.getServiceAsync("PersonalizationV2").then((oShellPersonalizationService) => {
        setShellPersonalizationService(oShellPersonalizationService);
      });
    }

    function setShellPersonalizationService(service) {
      shellPersonalizationService = service;
    }

    var setShellPersonalizationService = testableHelper.testable(setShellPersonalizationService, "setShellPersonalizationService");

    return {
      init: init,
      hasInitialized: hasInitialized,
      getApplicationPersonalizationData: getApplicationPersonalizationData,
      setApplicationPersonalizationData: setApplicationPersonalizationData
    };
  }

  return BaseObject.extend("sap.suite.ui.generic.template.lib.ShellPersonalizationService", {
    constructor: function (oTemplateContract) {
      extend(this, getMethods(oTemplateContract));
    }
  });
});