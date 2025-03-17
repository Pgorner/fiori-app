/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap, Promise*/

sap.ui.define(
  "sap/sac/df/model/internal/_DFKernel",
  [
    "sap/ui/base/Object",
    "sap/base/Log",
    "sap/sac/df/firefly/library"
  ],
  function (BaseObject, Log, FF) {
    "use strict";
    // Reset storage
    FF.XLocalStorage.setInstance(null);

    /**
         * The DFKernel is a UI5 model which provides access to Firefly kernel - core infrastructure like processes, connections and system definitions.
         * This shared parts can be used by other Controls, Models and Components provided by sap.sac.df library.
         *
         * @class
         * Model implementation to access Firefly kernel
         *
         * @author SAP SE
         * @version 1.132.0
         * @private
         * @experimental
         * @alias sap.sac.df.model._DFKernel
         */
    const DFKernel = BaseObject.extend("sap.sac.df.model._DFKernel", {});

    DFKernel._enableToggles = function (kernel) {
      const oSession = kernel.getKernelProcess().getSession();
      oSession.deactivateFeatureToggle(FF.FeatureToggleOlap.FUSION_SERVICE);
      FF.XStream.of(FF.FeatureToggle.getAllFeatureToggles()).forEach(function (toggle) {
        const xVersion = toggle.getXVersion();
        if (xVersion > FF.FeatureToggleOlap.FUSION_SERVICE.getXVersion() && xVersion <= FF.XVersion.MAX) {
          oSession.activateFeatureToggle(toggle);
        }
      });
      oSession.activateFeatureToggle(FF.FeatureToggleOlap.METADATA_CACHING);

      //Doesn't work for BW!!!
      oSession.deactivateFeatureToggle(FF.FeatureToggleOlap.MEMBER_VALUE_EXCEPTIONS);

      // Enable Formula Editor Toggles
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.SIMPLIFY);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.SYNTAX_HIGHLIGHTING);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.NEW_FUNCTIONS_PHASE1);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.NEW_FUNCTIONS_PHASE2);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.LIST_ITEMS_SEARCH);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.LIST_FUNCTIONS_BY_CATEGORY);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.TOKENIZATION);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.HIERARCHICAL_OBJECTS);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.DIALOG_NEW_LAYOUT);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.MIN);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.MAX);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.DIMENSION_SUPPORT);
      FF.FeFeatureToggle.enable(FF.FeFeatureToggle.HIERARCHICAL_DIMENSIONS);
    };

    DFKernel._setEnvironment = function (oEnvArgs) {
      this.initProgram.setEnvironmentVariable(FF.XEnvironmentConstants.FIREFLY_LOG_SEVERITY, "Print");
      if (oEnvArgs.systemLandscape) {
        if (oEnvArgs.systemLandscape.URI) {
          let fullUri = oEnvArgs.systemLandscape.URI;
          if (!fullUri.startsWith("http")) {
            fullUri = window.location.protocol + "//";
            fullUri += window.location.hostname;
            fullUri += (window.location.port ? ":" + window.location.port : "");
            fullUri += oEnvArgs.systemLandscape.URI;
          }
          this.initProgram.setEnvironmentVariable("ff_system_landscape_uri", fullUri);
        } else if (oEnvArgs.systemLandscape.Systems) {
          this.aSystemLandscapes = [];
          const aKeys = Object.keys(oEnvArgs.systemLandscape.Systems);

          aKeys.forEach(function (key) {
            const oSystem = oEnvArgs.systemLandscape.Systems[key];
            this.aSystemLandscapes.push(oSystem);
          }.bind(this));
        }
      } else if (oEnvArgs.systemType) {

        this.masterSystemName = oEnvArgs.masterSystem || "local" + oEnvArgs.systemType;

        const defaultSystem = {
          systemName: this.masterSystemName,
          systemType: oEnvArgs.systemType,
          protocol: window.location.protocol === "http:" ? "HTTP" : "HTTPS",
          host: window.location.hostname,
          port: window.location.port,
          authentication: "NONE"
        };
        if (defaultSystem.systemType == "DWC") {
          defaultSystem.path = "/lcs/dwc";
        }
        this.aSystemLandscapes = [defaultSystem];
      } else {
        throw new Error("System Configuration is invalid");
      }
      this.masterSystemName = this.masterSystemName || oEnvArgs.masterSystem;

      if (!this.masterSystemName) {
        throw new Error("System Configuration is invalid");
      }
    };

    DFKernel.init = function (mSettings) {
      const that = this;
      if (!that.initPromise) {
        that.initPromise = FF.ui.FFUi5Preloader.load().then(() => {
          return new Promise((resolve) => {
            if (!that.kernelProgram) {
              FF.XLogger.getInstance().setLogFilterLevel(FF.Severity.PRINT);
              that.initProgram = FF.KernelBoot.createByName("DragonflyAppProgram");
              if (!FF.XVersion.V186_DISP_HIERARCHY_FIX_IN_FILTER) {
                throw new Error("XVersion V186_DISP_HIERARCHY_FIX_IN_FILTER is undefined.");
              }
              that.initProgram.setXVersion(FF.XVersion.V186_DISP_HIERARCHY_FIX_IN_FILTER);
              that.initProgram.addProgramStartedListener(function (programStartAction, program) {
                if (!that.kernelProgram) {
                  that.kernelProgram = program;
                  if (that.aSystemLandscapes) {
                    that.addSystemLandscapes(mSettings.systemSettings.keepAliveInterval);
                  }
                  that.kernelProgram.getProcess().getApplication().setClientInfo(null, mSettings.systemSettings.clientIdentifier, null);
                  that.kernelProgram.getSession().deactivateFeatureToggle(FF.FeatureToggleOlap.FUSION_SERVICE);
                  resolve(that.kernelProgram);
                }
              });
              that.initProgram.setEnvironmentVariable(FF.XEnvironmentConstants.FIREFLY_USER_PROFILE_SERIALIZED, mSettings.userProfile);
              that.initProgram.setEnvironmentVariable("ff_mount_30", "/analyticalwidgets:${ff_network_root_dir}" + mSettings.systemSettings.widgetCatalogPath);
              that._setEnvironment(mSettings.systemSettings);
              that.initProgram.setKernelReadyConsumer(that._enableToggles);
              that.initProgram.runFull();
            } else {
              resolve(that.kernelProgram);
            }
          });
        });
      }
      return that.initPromise;
    };

    DFKernel.getSession = function () {
      if (!this.kernelProgram) {
        Log.error("Kernel not initialized");
        return null;
      }
      return this.kernelProgram.getSession();
    },
    DFKernel.getApplication = function () {
      if (!this.kernelProgram) {
        Log.error("Kernel not initialized");
        return null;
      }
      return this.kernelProgram.getApplication();
    },

    DFKernel.addSystemLandscapes = function (globalKeepAliveInterval) {
      const subSystemContainer = this.kernelProgram.getProcess().getKernel().getSubSystemContainer(FF.SubSystemType.SYSTEM_LANDSCAPE);
      const oSystemLandscape = subSystemContainer.getMainApi();
      const oApplication = this.kernelProgram.getApplication();
      oApplication.setSystemLandscape(oSystemLandscape);

      this.aSystemLandscapes.forEach(
        function (oSystem) {
          const oSystemDescription = oSystemLandscape.createSystem();
          oSystemDescription.setName(oSystem.systemName);
          oSystemDescription.setTimeout(10000);
          oSystemDescription.setAuthenticationType(FF.AuthenticationType[oSystem.authentication || "NONE"]);
          const systemType = FF.SystemType[oSystem.systemType];
          oSystemDescription.setSystemType(systemType);
          oSystemDescription.setProtocolType(FF.ProtocolType[oSystem.protocol]);
          oSystemDescription.setHost(oSystem.host);
          oSystemDescription.setPort(oSystem.port);
          oSystemDescription.setPath(oSystem.path);
          if (oSystem.language) {
            oSystemDescription.setLanguage(oSystem.language);
          }
          oSystemLandscape.setSystemByDescription(oSystemDescription);
          if (systemType.isTypeOf(FF.SystemType.BW)) {
            oSystemDescription.setSessionCarrierType(FF.SessionCarrierType.SAP_CONTEXT_ID_HEADER);
            oApplication.getConnectionPool().setMaximumSharedConnections(oSystem.systemName, 10);
          }
          const keepAlive = oSystem.keepAliveIntervalSec | globalKeepAliveInterval | 0;
          oSystemDescription.setKeepAliveDelayMs(keepAlive * 1000);
          oSystemDescription.setKeepAliveIntervalMs(keepAlive * 1000);

        }
      );
      oSystemLandscape.setMasterSystemName(this.masterSystemName);
    };

    return DFKernel;
  }
);
