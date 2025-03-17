/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/m/MessageBox", "sap/m/library", "sap/ui/base/Object", "sap/ui/core/Element", "sap/ui/core/Fragment", "sap/ui/core/library", "sap/ui/model/json/JSONModel", "sap/ui/model/odata/v2/ODataModel", "sap/ui/model/resource/ResourceModel", "../ToDoPanel", "./DataFormatUtils"], function (Log, MessageBox, sap_m_library, BaseObject, Element, Fragment, sap_ui_core_library, JSONModel, ODataModel, ResourceModel, ___ToDoPanel, __DataFormatUtils) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  const ButtonType = sap_m_library["ButtonType"];
  const ValueState = sap_ui_core_library["ValueState"];
  const TaskPriority = ___ToDoPanel["TaskPriority"];
  const DataFormatUtils = _interopRequireDefault(__DataFormatUtils);
  var ReasonRequired = /*#__PURE__*/function (ReasonRequired) {
    ReasonRequired["Required"] = "REQUIRED";
    ReasonRequired["Optional"] = "OPTIONAL";
    return ReasonRequired;
  }(ReasonRequired || {});
  const decideButtonNature = decisionOption => {
    switch (decisionOption.Nature?.toUpperCase()) {
      case "POSITIVE":
        return ButtonType.Accept;
      case "NEGATIVE":
        return ButtonType.Reject;
      case "NEUTRAL":
        return ButtonType.Neutral;
      default:
        return ButtonType.Default;
    }
  };
  const getActionButton = (decisionOption, i18nBundle, task, baseUrl) => {
    return {
      text: decisionOption.DecisionText,
      type: decideButtonNature(decisionOption) || ButtonType.Default,
      pressHandler: DecisionDialog.decisionDialogMethod.bind(null, decisionOption, i18nBundle, task, baseUrl)
    };
  };

  /**
   * Gets the icon frame badge based on the task priority.
   *
   * This method returns a specific badge string for tasks with high or very high priority.
   * For tasks with lower priorities, it returns an empty string.
   *
   * @param {TaskPriority} priority - The priority level of the task.
   * @returns {string} The badge string for high priority tasks, or an empty string for others.
   */
  function getIconFrameBadge(priority) {
    let iconBadge = "";
    if (priority === TaskPriority.VERY_HIGH || priority === TaskPriority.HIGH) {
      iconBadge = "sap-icon://high-priority";
    }
    return iconBadge;
  }

  /**
   * Converts a priority string to a Priority enum value.
   * If the priority string is not recognized, it returns the default value "None".
   *
   * @param {TaskPriority} priority - The priority string to convert.
   * @returns {ValueState} The corresponding Priority enum value.
   */
  function getIconFrameBadgeValueState(priority) {
    return priority === TaskPriority.VERY_HIGH || priority === TaskPriority.HIGH ? ValueState.Error : ValueState.None;
  }

  /**
   *
   * Helper class for Decision Dialog handling.
   *
   * @extends BaseObject
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.utils.DecisionDialog
   */
  const DecisionDialog = BaseObject.extend("sap.cux.home.utils.DecisionDialog", {
    constructor: function _constructor(decisionOption, i18nBundle, task, baseUrl, refreshView) {
      BaseObject.prototype.constructor.call(this);
      this.decisionOption = decisionOption;
      this.i18nBundle = i18nBundle;
      this.baseUrl = baseUrl;
      this.refreshView = refreshView;
      this.task = task;
    },
    /**
     * Handles the change event of the reason option ComboBox.
     *
     * @private
     * @param {Event} event - The event object.
     * @returns {void}
     */
    handleReasonOptionChange: function _handleReasonOptionChange(event) {
      const comboBox = event.getSource();
      const comboBoxValue = comboBox.getValue();
      const selectedItem = comboBox.getSelectedItem();
      this.confirmationDialogPromise.then(confirmationDialog => {
        const comboBoxRequired = this.confirmationDialogModel.getData().dialogSettings.reasonOptionsSettings.required;
        // Set the tooltip useful when the currently selected item's text is truncated
        comboBox.setTooltip(comboBoxValue);
        comboBox.setValueState(selectedItem === null ? ValueState.Error : ValueState.None);

        // Special case where if reason options is optional and all
        // the text is deleted value state should be none (corner case)
        if (!comboBoxRequired && comboBoxValue === "") {
          comboBox.setValueState(ValueState.None);
        }

        // Special case where if value in combo box gets partially deleted by the user
        // there is no selection yet button is not disabled
        if (!comboBoxRequired && comboBoxValue !== "" && selectedItem === null) {
          confirmationDialog.getBeginButton().setEnabled(false);
          return;
        }

        // Update the submit button state (disabled / enabled)
        this._toggleSubmitButtonState();
      }).catch(error => {
        Log.error(error instanceof Error ? error.message : String(error));
      });
    },
    /**
     * Toggles the state of the submit button based on the dialog settings.
     *
     * @private
     * @returns {void}
     */
    _toggleSubmitButtonState: function _toggleSubmitButtonState() {
      const dialogData = this.confirmationDialogModel.getData();
      const noteRequired = dialogData.dialogSettings.noteMandatory;
      const noteFilled = Element.getElementById("confirmDialogTextarea").getValue().trim().length > 0;
      const comboBoxRequired = dialogData.dialogSettings.reasonOptionsSettings.required;
      const comboBoxFilled = Element.getElementById("reasonOptionsSelect").getSelectedItem() !== null;
      const noteFlag = noteRequired && noteFilled || !noteRequired;
      const comboBoxFlag = comboBoxRequired && comboBoxFilled || !comboBoxRequired;
      this.confirmationDialogModel.setProperty("/submitButtonEnabled", noteFlag && comboBoxFlag);
    },
    /**
     * Reads reason options from the backend.
     *
     * @private
     * @param {string} origin - The SAP origin.
     * @param {string} instance - The instance ID.
     * @param {string} decisionKey - The decision key.
     * @param {Function} onSuccess - The success callback function.
     * @param {Function} onError - The error callback function.
     * @returns {void}
     */
    readReasonOptions: function _readReasonOptions(origin, instance, decisionKey, onSuccess, onError) {
      const sPath = "/ReasonOptions";
      const oUrlParams = {
        SAP__Origin: `'${origin}'`,
        InstanceID: `'${instance}'`,
        DecisionKey: `'${decisionKey}'`
      };
      const fnSuccess = oData => {
        if (oData && oData.results) {
          if (onSuccess) {
            onSuccess(oData.results);
          }
        }
      };
      const fnError = oError => {
        if (onError) {
          onError(oError);
        }
      };
      this.dataServiceModel.read(sPath, {
        urlParameters: oUrlParams,
        success: fnSuccess,
        error: fnError,
        groupId: "reasonOptions"
      });
    },
    /**
     * Load the reason options which are part of this decision option.
     *
     * @private
     * @returns {Promise<ReasonOptionSettings | null>} - containing resolved array of reason options
     */
    loadReasonOptions: function _loadReasonOptions() {
      try {
        const _this = this;
        const metaModel = _this.dataServiceModel.getMetaModel();
        return Promise.resolve(metaModel.loaded()).then(function () {
          if (metaModel.getODataFunctionImport("ReasonOptions")) {
            return new Promise((resolve, reject) => {
              _this.readReasonOptions(_this.decisionOption.SAP__Origin, _this.decisionOption.InstanceID, _this.decisionOption.DecisionKey, reasonOptions => {
                const reasonOptionsSettings = {
                  show: (_this.decisionOption.ReasonRequired === ReasonRequired.Required || _this.decisionOption.ReasonRequired === ReasonRequired.Optional) && reasonOptions.length > 0,
                  required: _this.decisionOption.ReasonRequired === ReasonRequired.Required,
                  reasonOptions: reasonOptions
                };
                resolve(reasonOptionsSettings);
              }, oError => {
                reject(oError);
              });
            });
          } else {
            return null;
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Open the decision dialog for the inbox task selected.
     *
     * @private
     * @param {DecisionDialogSettings} dialogSettings - contains the settings for the decision dialog
     */
    openDecisionDialog: function _openDecisionDialog(dialogSettings) {
      this.confirmationDialogModel = new JSONModel({
        submitButtonEnabled: !dialogSettings?.noteMandatory && !dialogSettings?.reasonOptionsSettings?.required,
        dialogSettings
      });
      this.confirmationDialogPromise = Fragment.load({
        type: "XML",
        name: "sap.cux.home.utils.fragment.showDecisionDialog",
        controller: this
      }).then(confirmationDialogFragment => {
        const confirmationDialog = confirmationDialogFragment;
        const i18nModel = new ResourceModel({
          bundle: this.i18nBundle
        });
        const priorityText = Element.getElementById("task-priority-text");
        priorityText.addStyleClass(this.task.Priority);
        confirmationDialog.setModel(this.confirmationDialogModel);
        confirmationDialog.setModel(i18nModel, "i18n");
        confirmationDialog.open();
        return confirmationDialog;
      }).catch(error => {
        Log.error(error instanceof Error ? error.message : String(error));
      });
    },
    /**
     * Submit handler for the decision dialog
     *
     * @private
     */
    confirmActionHandler: function _confirmActionHandler() {
      this.confirmationDialogPromise.then(confirmationDialog => {
        const dialogSettings = (confirmationDialog.getModel()?.getProperty("/")).dialogSettings;
        const reasonOptionsSettings = dialogSettings.reasonOptionsSettings;

        // Get the reason option value from the combo box
        const reasonOptionSelectedItem = reasonOptionsSettings.show ? Element.getElementById("reasonOptionsSelect")?.getSelectedItem() : null;
        const reasonCode = reasonOptionSelectedItem !== null && reasonOptionSelectedItem?.getKey() !== "defaultSelectedKey" ? reasonOptionSelectedItem.getKey() : null;

        // Get the note value from the text area
        const note = dialogSettings.showNote ? Element.getElementById("confirmDialogTextarea")?.getValue() : null;
        dialogSettings.confirmActionHandler(note, reasonCode);
      }).catch(error => {
        Log.error(error instanceof Error ? error.message : String(error));
      });
    },
    /**
     * Handler for cancel action in the decision dialog
     *
     * @private
     */
    handleCancel: function _handleCancel() {
      this.confirmationDialogPromise.then(confirmationDialog => {
        const dialogSettings = (confirmationDialog.getModel()?.getProperty("/")).dialogSettings;
        confirmationDialog._bClosedViaButton = true;
        confirmationDialog.close();
        dialogSettings.cancelActionHandler();
        if (this.confirmationDialogModel.getProperty("/dialogSettings/showFeedbackMessage")) {
          this.dataServiceModel.refresh();
          this.refreshView(true);
        }
      }).catch(error => {
        Log.error(error instanceof Error ? error.message : String(error));
      });
    },
    /**
     * After close dialog handler in the decision dialog
     *
     * @private
     */
    handleAfterClose: function _handleAfterClose() {
      this.confirmationDialogPromise.then(confirmationDialog => {
        if (confirmationDialog._bClosedViaButton) {
          // dialog is closed via button
          confirmationDialog._bClosedViaButton = false;
        } else {
          // dialog is closed by other means (e.g. pressing Escape)
          const dialogSettings = (confirmationDialog.getModel()?.getProperty("/")).dialogSettings;
          dialogSettings.cancelActionHandler();
        }
        confirmationDialog.destroy();
      }).catch(error => {
        Log.error(error instanceof Error ? error.message : String(error));
      });
    },
    /**
     * Creates an OData request with the specified parameters.
     *
     * @private
     * @param {string} path - The path of the OData request.
     * @param {Record<string, string>} urlParams - The URL parameters of the request.
     * @param {Function} fnSuccess - The success callback function.
     * @param {Function} fnError - The error callback function.
     * @returns {void}
     */
    createODataRequest: function _createODataRequest(path, urlParams, fnSuccess, fnError) {
      const settings = {
        success: (data, response) => {
          Log.info("successful action");
          fnSuccess?.(data, response);
        },
        error: error => {
          const message = this.i18nBundle.getText("DataManager.HTTPRequestFailed");
          const details = error.response ? error.response.body : null;
          const parameters = {
            message: message,
            responseText: details
          };
          this.dataServiceModel.fireRequestFailed(parameters);
          fnError(error);
        },
        urlParameters: urlParams
      };
      this.dataServiceModel.create(path, {}, settings);
    },
    /**
     * Sends an action to the backend.
     *
     * @private
     * @param {string} importName - The name of the function import or action.
     * @param {DecisionOption} decision - The decision option.
     * @param {string} note - The note to be included with the action.
     * @param {string} reasonOptionCode - The reason option code.
     * @param {Task} task - The task associated with the action.
     * @returns {void}
     */
    sendAction: function _sendAction(importName, decision, note, reasonOptionCode, task) {
      const urlParams = {
        SAP__Origin: `'${task.SAP__Origin}'`,
        InstanceID: `'${task.InstanceID}'`
      };
      if (decision.DecisionKey) {
        urlParams.DecisionKey = `'${decision.DecisionKey}'`;
      }
      if (note?.length > 0) {
        urlParams.Comments = `'${note}'`;
      }
      if (reasonOptionCode) {
        urlParams.ReasonCode = `'${reasonOptionCode}'`;
      }
      const onSuccess = () => {
        this.confirmationDialogPromise.then(confirmationDialog => {
          confirmationDialog.setBusy(false);
          this.confirmationDialogModel.setProperty("/dialogSettings/showFeedbackMessage", true);
        }).catch(error => {
          Log.error(error instanceof Error ? error.message : String(error));
        });
      };
      const onError = error => {
        if (error.responseText) {
          const oError = JSON.parse(error.responseText);
          MessageBox.error(oError?.error?.message?.value);
        }
        this.handleCancel();
      };
      this.createODataRequest(`/${importName}`, urlParams, onSuccess, onError);
    },
    /**
     * Shows the decision dialog.
     *
     * @private
     * @returns {Promise<void>}
     */
    showDecisionDialog: function _showDecisionDialog() {
      try {
        const _this2 = this;
        _this2.dataServiceModel = _this2.dataServiceModel || new ODataModel(_this2.baseUrl);
        const {
          TaskTitle: title,
          Priority
        } = _this2.task;
        const decisionDialogSettings = {
          noteMandatory: _this2.decisionOption.CommentMandatory,
          question: _this2.i18nBundle.getText("XMSG_DECISION_QUESTION", [_this2.decisionOption.DecisionText]),
          title,
          badgeIcon: getIconFrameBadge(Priority),
          badgeValueState: getIconFrameBadgeValueState(Priority),
          priorityText: _this2.i18nBundle.getText(DataFormatUtils.toTaskPriorityText(Priority)),
          confirmButtonLabel: _this2.i18nBundle.getText("XBUT_SUBMIT"),
          showNote: true,
          showFeedbackMessage: false,
          reasonOptionsSettings: {
            show: false,
            required: false
          },
          textAreaLabel: _this2.i18nBundle.getText("XFLD_TextArea_Decision"),
          confirmActionHandler: (note, reasonOptionKey) => {
            _this2.sendAction("Decision", _this2.decisionOption, note, reasonOptionKey, _this2.task);
          },
          cancelActionHandler: () => {}
        };
        const _temp = _catch(function () {
          return Promise.resolve(_this2.dataServiceModel.metadataLoaded()).then(function () {
            const reasonOptionsLoadedPromise = _this2.decisionOption?.ReasonRequired === ReasonRequired.Required || _this2.decisionOption?.ReasonRequired === ReasonRequired.Optional ? _this2.loadReasonOptions() : null;

            // reason options won't be loaded
            if (!reasonOptionsLoadedPromise) {
              _this2.openDecisionDialog(decisionDialogSettings);
            } else {
              // based on reasonOptionsLoadedPromise, reason options will be loaded
              reasonOptionsLoadedPromise.then(reasonOptionsSettings => {
                if (reasonOptionsSettings !== null) {
                  decisionDialogSettings.reasonOptionsSettings = reasonOptionsSettings;

                  // In case of optional reason option combo box, a (None) option is created as to have a default selection
                  if (decisionDialogSettings.reasonOptionsSettings?.reasonOptions && !decisionDialogSettings.reasonOptionsSettings?.required) {
                    const noneText = `(${_this2.i18nBundle.getText("XSEL_DECISION_REASON_NONE_OPTION")})`;
                    decisionDialogSettings.reasonOptionsSettings.reasonOptions.unshift({
                      Name: noneText,
                      Code: "defaultSelectedKey"
                    });
                  }
                  _this2.openDecisionDialog(decisionDialogSettings);
                }
              }).catch(() => {
                Log.error("Could not load the reason options properly");
              });
            }
          });
        }, function () {
          Log.error("Could not load metadata model for inbox");
        });
        return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  });
  /**
   * Initiates the decisionDialog
   *
   * @static
   * @param {DecisionOption} decisionOption - Decision Option
   * @param {ResourceModel} i18nBundle - The resource bundle for internationalization.
   * @param {Task} task - Task Instance
   * @param {Refresh} refresh - Refresh function
   */
  DecisionDialog.decisionDialogMethod = function decisionDialogMethod(decisionOption, i18nBundle, task, baseUrl, refresh) {
    const dialogUtils = new DecisionDialog(decisionOption, i18nBundle, task, baseUrl, refresh);
    return dialogUtils.showDecisionDialog();
  };
  /**
   * Retrieves task actions based on the task and multi-select decision results.
   *
   * @static
   * @param {Task} task - The task for which actions are retrieved.
   * @param {string} baseUrl - The base URL.
   * @param {MultiSelectDecisionResult} multiSelectDecisionResults - The multi-select decision results.
   * @param {ResourceBundle} i18nBundle - The resource bundle for internationalization.
   * @returns {ActionButton[]} An array of action buttons.
   */
  DecisionDialog.getTaskActions = function getTaskActions(task, baseUrl, multiSelectDecisionResults, i18nBundle) {
    const actions = [];
    const displayedTypes = new Set();
    const multiSelectDecisionOptions = multiSelectDecisionResults[task.SAP__Origin + task.TaskDefinitionID];
    if (multiSelectDecisionOptions) {
      for (const decisionOption of multiSelectDecisionOptions) {
        if (!displayedTypes.has(decisionOption.Nature) || !decisionOption.Nature) {
          actions.push(getActionButton(decisionOption, i18nBundle, task, baseUrl));
          displayedTypes.add(decisionOption.Nature);
        } else {
          const action = getActionButton(decisionOption, i18nBundle, task, baseUrl);
          action.type = ButtonType.Default;
          actions.push(action);
        }
      }
    }
    return actions;
  };
  DecisionDialog.getIconFrameBadge = getIconFrameBadge;
  DecisionDialog.getIconFrameBadgeValueState = getIconFrameBadgeValueState;
  return DecisionDialog;
});
//# sourceMappingURL=DecisionDialog-dbg-dbg.js.map
