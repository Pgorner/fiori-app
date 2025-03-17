/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global QUnit */
sap.ui.define(
	[
		"sap/ui/base/Object",
		"sap/ui/test/Opa5",
		"./Utils",
		"./BaseArrangements",
		"./BaseActions",
		"./BaseAssertions",
		"./Shell",
		"sap/ui/test/opaQunit",
		"sap/base/Log",
		"sap/base/util/ObjectPath"
	],
	function (BaseObject, Opa5, Utils, BaseArrangements, BaseActions, BaseAssertions, Shell, opaQunit, Log, ObjectPath) {
		"use strict";

		/**
		 * Sync all JourneyRunner instances.
		 * @type {Promise<void>}
		 * @private
		 */
		var _pRunning = Promise.resolve();

		var _oDefaultRunner;

		/**
		 * Constructs a new JourneyRunner instance.
		 * @class A JourneyRunner for executing integration tests with given settings.
		 * @param {object} [mSettings] The settings object
		 * @param {Object<string, sap.fe.test.ListReport | sap.fe.test.ObjectPage>} [mSettings.pages] The available Opa pages
		 * @param {sap.ui.test.Opa5.Config} [mSettings.opaConfig] The Opa configuration applied via {@link sap.ui.test.Opa5#sap.ui.test.Opa5.extendConfig}
		 * @param {string} [mSettings.launchUrl] The URL to the launching page (usually a FLP.html)
		 * @param {Object<string, string | boolean>} [mSettings.launchParameters] The URL launch parameters
		 * @param {boolean} [mSettings.async] If false (default), only one JourneyRunner is executed at a time
		 * @alias sap.fe.test.JourneyRunner
		 * @public
		 */
		var JourneyRunner = BaseObject.extend("sap.fe.test.JourneyRunner", {
			constructor: function (mSettings) {
				BaseObject.apply(this);
				// store a copy of the settings object
				this._mInstanceSettings = Utils.mergeObjects(
					{
						pages: {
							onTheShell: new Shell()
						}
					},
					mSettings
				);
			},

			/**
			 * Executes the journeys in the given order.
			 *
			 * The settings provided as first parameter are merged into the base settings of the JourneyRunner instance.
			 * @param {object} [mSettings] The settings object for the tests to run. Overrides instance settings
			 * @param {Object<string, sap.fe.test.ListReport | sap.fe.test.ObjectPage>} [mSettings.pages] The available Opa pages
			 * @param {sap.ui.test.Opa5.Config} [mSettings.opaConfig] The Opa configuration applied via {@link sap.ui.test.Opa5#sap.ui.test.Opa5.extendConfig}
			 * @param {string} [mSettings.launchUrl] The URL to the launching page (usually a FLP.html)
			 * @param {Object<string, string | boolean>} [mSettings.launchParameters] The URL launch parameters
			 * @param {boolean} [mSettings.async] If false (default), only one JourneyRunner is executed at a time
			 * @param {Function[] | string[]} _vJourneys The journeys to be executed. If a journey is represented as a string, it will be interpreted
			 * as a module path to the file that should be loaded. Else it is expected to be a function.
			 * Alternatively, instead of being wrapped in an array, the journeys can also be given as separate parameters:
			 * <pre>.run(mSettings, Journey1, Journey2, ...)</pre>
			 * @returns {object} A <code>Promise</code> that is resolved after all tests have been executed
			 * @function
			 * @name sap.fe.test.JourneyRunner#run
			 * @public
			 */
			run: function (mSettings, _vJourneys) {
				var iJourneyParameterIndex = 1;
				if (!Utils.isOfType(mSettings, Object)) {
					iJourneyParameterIndex = 0;
					mSettings = Utils.mergeObjects(this._mInstanceSettings);
				} else {
					mSettings = Utils.mergeObjects(this._mInstanceSettings, mSettings);
				}

				var aJourneys = Array.prototype.slice.call(arguments, iJourneyParameterIndex); // journey-related parameter(s) as array
				if (aJourneys && aJourneys.length && Array.isArray(aJourneys[0])) {
					// if the first journey parameter is an array...
					aJourneys = aJourneys[0]; // ...then unwrap it, to use this array itself
				}
				var bAsync = mSettings.async,
					pSyncPromise;

				if (bAsync) {
					pSyncPromise = Promise.resolve();
				} else {
					pSyncPromise = _pRunning;
				}

				pSyncPromise = pSyncPromise
					.then(this._preRunActions.bind(this, mSettings))
					.then(this._runActions.bind(this, aJourneys))
					.then(this._postRunActions.bind(this, mSettings))
					.catch(function (oError) {
						Log.error("JourneyRunner.run failed", oError);
					});

				if (!bAsync) {
					_pRunning = pSyncPromise;
				}

				return pSyncPromise;
			},

			/**
			 * Returns the base action instance to be used for {@link sap.ui.test.Opa5#sap.ui.test.Opa5.extendConfig} <code>actions</code> setting.
			 *
			 * This function is only used if <code>actions</code> is not defined via the runner settings.
			 * It is meant to be overridden by a custom JourneyRunner implementation to provide custom base actions.
			 *
			 * By default, an instance of {@link sap.fe.test.BaseActions} will be returned.
			 * @returns {sap.ui.test.Opa} An Opa instance for the base actions
			 * @function
			 * @name sap.fe.test.JourneyRunner#getBaseActions
			 * @protected
			 */
			getBaseActions: function () {
				return new BaseActions();
			},

			/**
			 * Returns the base assertions instance to be used for {@link sap.ui.test.Opa5#sap.ui.test.Opa5.extendConfig} <code>assertions</code> setting.
			 *
			 * This function is only used if <code>assertions</code> is not defined via the runner settings.
			 * It is meant to be overridden by a custom JourneyRunner implementation to provide custom base assertions.
			 *
			 * By default, an instance of {@link sap.fe.test.BaseAssertions} will be returned.
			 * @returns {sap.ui.test.Opa} An Opa instance for the base assertions
			 * @function
			 * @name sap.fe.test.JourneyRunner#getBaseAssertions
			 * @protected
			 */
			getBaseAssertions: function () {
				return new BaseAssertions();
			},

			/**
			 * Returns the base arrangements instance to be used for {@link sap.ui.test.Opa5#sap.ui.test.Opa5.extendConfig} <code>arrangements</code> setting.
			 *
			 * This function is only used if <code>arrangements</code> is not defined via the runner settings.
			 * It is meant to be overridden by a custom JourneyRunner implementation to provide custom base assertions.
			 *
			 * By default, an instance of {@link sap.fe.test.BaseArrangements} will be returned.
			 * @param {object} mSettings The settings object of the runner instance
			 * @returns {sap.ui.test.Opa} An Opa instance for the base arrangements
			 * @function
			 * @name sap.fe.test.JourneyRunner#getBaseArrangements
			 * @protected
			 */
			getBaseArrangements: function (mSettings) {
				return new BaseArrangements(mSettings);
			},

			_preRunActions: function (mSettings) {
				Opa5.extendConfig(this._getOpaConfig(mSettings));
				Opa5.createPageObjects(mSettings.pages);
			},

			_runActions: function (aJourneys) {
				var that = this,
					pPromiseChain = Promise.resolve(),
					fnRunnerResolve,
					pRunnerEnds = new Promise(function (resolve) {
						fnRunnerResolve = resolve;
					});

				Log.info("JourneyRunner started");

				QUnit.done(function () {
					Log.info("JourneyRunner ended");
					fnRunnerResolve();
				});

				aJourneys.forEach(function (vJourney) {
					if (Utils.isOfType(vJourney, String)) {
						pPromiseChain = pPromiseChain.then(function () {
							return new Promise(function (resolve) {
								sap.ui.require([vJourney], function (oJourney) {
									resolve(oJourney);
								});
							});
						});
					} else {
						pPromiseChain = pPromiseChain.then(function () {
							return vJourney;
						});
					}
					pPromiseChain = pPromiseChain.then(that._runJourney);
				});
				return pPromiseChain.then(function () {
					return pRunnerEnds;
				});
			},

			_runJourney: function (vJourney) {
				if (Utils.isOfType(vJourney, Function)) {
					vJourney.call();
				}
			},

			_postRunActions: function (mSettings) {
				this._removePages(mSettings.pages);
				Opa5.resetConfig();
			},

			_removePages: function (mPages) {
				var that = this;
				if (mPages) {
					Object.keys(mPages).forEach(function (sPageName) {
						var mPage = mPages[sPageName],
							sClassName = that._createClassName(mPage.namespace || "sap.ui.test.opa.pageObject", sPageName);
						// remove path entry to avoid error log flooding from OPA5 - it is newly created anyways
						ObjectPath.set(sClassName, undefined);
					});
				}
			},

			_createClassName: function (sNameSpace, sName) {
				return sNameSpace + "." + sName;
			},

			_getOpaConfig: function (mSettings) {
				var oConfig = Object.assign(
					{
						viewNamespace: "sap.fe.templates",
						autoWait: true,
						timeout: 30,
						pollingInterval: 50,
						logLevel: "ERROR",
						disableHistoryOverride: true,
						asyncPolling: true
					},
					mSettings.opaConfig
				);

				if (!oConfig.actions) {
					oConfig.actions = this.getBaseActions(mSettings);
				}
				if (!oConfig.assertions) {
					oConfig.assertions = this.getBaseAssertions(mSettings);
				}
				if (!oConfig.arrangements) {
					oConfig.arrangements = this.getBaseArrangements(mSettings);
				}

				return oConfig;
			}
		});

		/**
		 * Gets the global journey runner instance.
		 * @returns {object} The global default {@link sap.fe.test.JourneyRunner} instance
		 * @function
		 * @public
		 * @static
		 */
		JourneyRunner.getDefaultRunner = function () {
			if (!_oDefaultRunner) {
				_oDefaultRunner = new JourneyRunner();
			}
			return _oDefaultRunner;
		};

		/**
		 * Sets the global journey runner instance.
		 * @param {sap.fe.test.JourneyRunner} oDefaultRunner Defines the global default {@link sap.fe.test.JourneyRunner} instance
		 * @function
		 * @public
		 * @static
		 */
		JourneyRunner.setDefaultRunner = function (oDefaultRunner) {
			if (_oDefaultRunner) {
				_oDefaultRunner.destroy();
			}
			_oDefaultRunner = oDefaultRunner;
		};

		/**
		 * Static function to run the default runner with given parameters.
		 * Shortcut for <pre>JourneyRunner.getDefaultRunner().run(mSettings, Journey1, Journey2, ...)</pre>
		 * See {@link sap.fe.test.JourneyRunner#run} for parameter details.
		 * @function
		 * @public
		 * @static
		 */
		JourneyRunner.run = function () {
			var oRunner = JourneyRunner.getDefaultRunner();
			oRunner.run.apply(oRunner, arguments);
		};

		return JourneyRunner;
	}
);
