/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
	"./ExportDialog",
	"./ExportBase",
	"./ExportUtils",
	"./library",
	"./util/PDFCapabilities",
	"sap/base/i18n/Localization",
	"sap/base/Log",
	"sap/m/BusyDialog",
	"sap/ui/base/Object",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/util/openWindow"
], function(ExportDialog, ExportBase, ExportUtils, Library, PDFCapabilities, Localization, Log, BusyDialog, BaseObject, ODataModel, openWindow) {
	"use strict";

	const FileType = Library.FileType;
	const EdmType = Library.EdmType;
	const Status = Library.Status;

	/**
	 * @class The <code>sap.ui.export.PortableDocument</code> class allows you to export table data from a UI5 application to a Portable Document Format (*.PDF) file.
	 *
	 * @author SAP SE
	 * @version 1.132.1
	 *
	 * @since 1.96
	 * @alias sap.ui.export.PortableDocument
	 * @extends sap.ui.export.ExportBase
	 * @private
	 */
	const PortableDocument = ExportBase.extend("sap.ui.export.PortableDocument", {

		constructor: function(mSettings, mCapabilities, mCloudFileInfo) {
			ExportBase.call(this, mSettings, mCapabilities);

			if (!BaseObject.isA(this._mCapabilities, "sap.ui.export.util.PDFCapabilities")) {
				this._mCapabilities = new PDFCapabilities(this._mCapabilities);
			}

			if (mCloudFileInfo?.FileShare && mCloudFileInfo?.ParentFileShareItem) {
				this._mCloudFileInfo = mCloudFileInfo;
			}

			/* Only apply supported properties */
			["paperSize", "orientation", "font", "fontSize", "doEnableAccessibility", "fitToPage", "signature", "signatureReason", "pdfArchive", "showPageNumber"].forEach((sProperty) => {
				if (typeof mSettings[sProperty] !== "undefined") {
					this._mSettings[sProperty] = mSettings[sProperty];
				}
			});
		}
	});

	/**
	 * Sets the data source configuration that will be used for exporting the data. If the passed parameter is null,
	 * the call will be ignored.
	 *
	 * @param {object|sap.ui.model.ListBinding|sap.ui.model.TreeBinding} oDataSource Possible types are a data
	 * source configuration, a <code>sap.ui.model.ListBinding</code> or <code>sap.ui.model.TreeBinding</code>
	 * @returns {object|null} - Valid dataSource object or null in case the dataSource configuration is not supported
	 *
	 * @since 1.96
	 * @public
	 */
	PortableDocument.prototype.processDataSource = function(oDataSource) {
		let mDataSource = null;
		const sDataSourceType = typeof oDataSource;

		if (!oDataSource) {
			return null;
		}

		if (sDataSourceType != "object") {
			Log.error("Spreadsheet#processDataSource: Unable to apply data source of type " + sDataSourceType);

			return null;
		}

		if (oDataSource.dataUrl && oDataSource.serviceUrl) {
			mDataSource = oDataSource;
		}

		if (oDataSource.isA && oDataSource.isA(["sap.ui.model.ListBinding", "sap.ui.model.TreeBinding"])) {
			mDataSource = this.createDataSourceFromBinding(oDataSource);
		}

		return mDataSource;
	};

	/**
	 * Creates a valid dataSource configuration
	 *
	 * @param {sap.ui.model.ListBinding|sap.ui.model.TreeBinding} oBinding - A subclass of <code>sap.ui.model.ListBinding</code> or <code>sap.ui.model.TreeBinding</code>
	 * @returns {object} - Valid data source configuration built upon the ListBinding
	 *
	 * @private
	 */
	 PortableDocument.prototype.createDataSourceFromBinding = function(oBinding) {
		let oDataSource = null;

		if (oBinding.isA(["sap.ui.model.ClientListBinding", "sap.ui.model.ClientTreeBinding"])) {
			Log.error("Unable to create dataSource configuration due to not supported Binding: " + oBinding.getMetadata().getName());
		}

		/**
		 * All other <code>Bindings</code> need to provide a downloadUrl
		 */
		if (typeof oBinding.getDownloadUrl === "function") {
			const oModel = oBinding.getModel(),
				sDataUrl = ExportUtils.interceptUrl(oBinding.getDownloadUrl("pdf")),
				sServiceUrl = ExportUtils.interceptUrl(oModel.sServiceUrl),
				bV4ODataModel = oModel.isA("sap.ui.model.odata.v4.ODataModel");

			const oDataUrl = new URL(sDataUrl, document.baseURI);
			oDataUrl.hash = "";

			// Reference the Model for later use
			this._oModel = oModel;

			/* Remove $format system query option because it would overwrite the "Accept" header */
			oDataUrl.search = oDataUrl.search.split("&").filter((val) => {
				return val.indexOf("$format") == -1;
			}).join("&");

			oDataSource = {
				type: "odata",
				version: bV4ODataModel ? 4 : 2,
				dataUrl: oDataUrl.toString(),
				serviceUrl: this._resolveServiceUrl(sServiceUrl),
				headers: bV4ODataModel ?  oModel.getHttpHeaders(true) : oModel.getHeaders(),
				count: ExportUtils.getCountFromBinding(oBinding)
			};
		}

		return oDataSource;
	};

	/**
	 * Resolves the service URL that contains the DocumentDescription
	 * relative to the current service URL. The returned service URL
	 * always ends with an forward slash.
	 *
	 * @param {string} sCurrentServiceUrl URL of the data service
	 * @returns {string} Converted service url
	 *
	 * @private
	 */
	PortableDocument.prototype._resolveServiceUrl = function(sCurrentServiceUrl) {
		if (!sCurrentServiceUrl.endsWith("/")) {
			sCurrentServiceUrl += "/";
		}

		const isRelative = /^[\./]/.test(sCurrentServiceUrl);
		let sReference = this._mCapabilities.DocumentDescriptionReference;

		if (typeof sReference !== "string" || !sReference) {
			return sCurrentServiceUrl.split("/").slice(0, -5).join("/") + "/default/iwbep/common/0001/";
		}

		sReference = sReference.endsWith("/") ? sReference : sReference.split("/").slice(0, -1).join("/") + "/";
		let oUrl = new URL(sCurrentServiceUrl, document.baseURI);

		oUrl = new URL(sReference, oUrl.href);

		return isRelative ? oUrl.pathname : oUrl.href;
	};

	/**
	 * Creates the DocumentDescription based on the given export
	 * settings and assigns a unique Id to it.
	 *
	 * @param {object} mSettings Export settings
	 * @returns {object} DocumentDescription object that contains all relevant export settings
	 *
	 * @private
	 */
	PortableDocument.prototype._createDocumentDescription = function(mSettings) {
		const oWorkbook = mSettings.workbook;
		const iODataVersion = mSettings.dataSource.version;

		const oDocumentDescription = {
			Title: oWorkbook.context.title,
			Format: {
				PaperSize: mSettings.paperSize,
				Orientation: mSettings.orientation
			},
			PDFStandard: {
				DoEnableAccessibility: mSettings.doEnableAccessibility
			},
			TableColumns: []
		};


		/* Add capability related features */

		/* ArchiveFormat */
		if (this._mCapabilities.ArchiveFormat) {
			oDocumentDescription.PDFStandard.UsePDFAConformance = mSettings.pdfArchive;
		}

		/* CoverPage */
		if (this._mCapabilities.CoverPage) {
			const oMetaInfo = oWorkbook.context.metainfo;
			oDocumentDescription.CoverPage = [];

			if (oMetaInfo instanceof Array) {
				oMetaInfo.forEach((oGroup) => {
					if (iODataVersion === 2) {

						oGroup.items.forEach((oItem) => {
							const oCoverPageGroup = {
								Title: oGroup.name,
								Name: oItem.key,
								Value: oItem.value
							};
							oDocumentDescription.CoverPage.push(oCoverPageGroup);
						});
					} else {
						const oCoverPageGroup = {
							Title: oGroup.name,
							Content: []
						};

						oGroup.items.forEach((oItem) => {
							oCoverPageGroup.Content.push({
								Name: oItem.key,
								Value: oItem.value
							});
						});
						oDocumentDescription.CoverPage.push(oCoverPageGroup);
					}
				});
			}
		}

		/* FitToPage */
		if (this._mCapabilities.FitToPage) {
			oDocumentDescription.Format.FitToPage = {
				IsEnabled: mSettings.fitToPage,
				MinimumFontSize: 4
			};
		}

		/* FontSize */
		if (this._mCapabilities.FontSize) {
			oDocumentDescription.Format.FontSize = Number(mSettings.fontSize);
		}

		/* HeaderFooter */
		if (this._mCapabilities.HeaderFooter && mSettings.showPageNumber) {
			oDocumentDescription.Footer = {
				Center: {
					Type: "PAGENUM"
				}
			};
		}

		/* Signature */
		if (this._mCapabilities.Signature) {
			oDocumentDescription.Signature = {
				DoSign: mSettings.signature,
				Reason: mSettings.signatureReason
			};
		}

		/* TextDirectionLayout */
		if (this._mCapabilities.TextDirectionLayout) {
			oDocumentDescription.Format.TextDirectionLayout = Localization.getRTL() ? "RTL" : "LTR";
		}

		/* Treeview */
		if (this._mCapabilities.Treeview && oWorkbook.hierarchyLevel && oWorkbook.drillState) {
			if (iODataVersion === 2) {
				oDocumentDescription.Hierarchy = {
					DistanceFromRootElement: oWorkbook.hierarchyLevel,
					DrillStateElement: oWorkbook.drillState
				};
			} else {
				oDocumentDescription.Format.TableFormat = "TREE";
			}
		}

		if (this._mCapabilities.UploadToFileShare && this._mCloudFileInfo) {
			oDocumentDescription.FileName = this._mCloudFileInfo.FileShareItemName;
			oDocumentDescription.FileShare = {
				Repository: this._mCloudFileInfo.FileShare,
				Folder: this._mCloudFileInfo.ParentFileShareItem
			};
		}

		/* Eliminate duplicate or unknown columns before adding them to the DocumentDescription */
		oWorkbook.columns.filter((oColumn, iIndex, aArray) => {
			const sProperty = Array.isArray(oColumn.property) ? oColumn.property[0] : oColumn.property;

			if (!sProperty) {
				return false;
			}

			return aArray.findIndex((oOtherColumn) => {
				const sOtherProperty = Array.isArray(oOtherColumn.property) ? oOtherColumn.property[0] : oOtherColumn.property;

				return sProperty === sOtherProperty;
			}) === iIndex;
		}).forEach((oColumnSettings) => {
			const oColumn = {
				Name: Array.isArray(oColumnSettings.property) ? oColumnSettings.property[0] : oColumnSettings.property,
				Header: oColumnSettings.label
			};

			if (this._mCapabilities.IANATimezoneFormat && oColumnSettings.type === EdmType.DateTime) {
				oColumn.Format = {
					DisplayFormat: iODataVersion == 2 ? "IANATSSHOR" : "IANA-Timestamp-Short"
				};

				if (oColumnSettings.timezoneProperty) {
					oColumn.Format.IANATimezoneProperty = oColumnSettings.timezoneProperty;
				} else if (oColumnSettings.timezone) {
					oColumn.Format.IANATimezone = oColumnSettings.timezone;
				}
			}

			oDocumentDescription.TableColumns.push(oColumn);
		});

		return oDocumentDescription;
	};

	/**
	 * Returns the name of the EntitySet that is being used with the given OData version.
	 *
	 * @param {object} mDataSource DataSource object containing information about OData version
	 * @returns {string} Name of the EntitySet according to the OData version
	 *
	 * @private
	 */
	PortableDocument.prototype._getEntitySetName = function(mDataSource) {
		let sCollectionName;
		const iVersion = mDataSource?.version || 2; // Use OData V2 by default

		if (this._mCapabilities && typeof this._mCapabilities.DocumentDescriptionCollection === "string") {
			sCollectionName = this._mCapabilities.DocumentDescriptionCollection;
		}

		return sCollectionName || (iVersion == 4 ? "MyDocumentDescriptions" : "SAP__MyDocumentDescriptions");
	};

	/**
	 * Returns the specific ODataModel that is being used for binding to the DocumentDescription EntitySet
	 *
	 * @param {object} oDataSource DataSource settings of the export configuration
	 * @returns {sap.ui.model.odata.v2.ODataModel|sap.ui.model.odata.v4.ODataModel} ODataModel, either V2 or V4.
	 *
	 * @private
	 */
	PortableDocument.prototype._getModel = function(oDataSource) {
		const iVersion = oDataSource.version || 2;

		return iVersion === 4 ? new ODataModel({
			serviceUrl: oDataSource.serviceUrl
		}) : this._oModel;
	};

	/**
	 * Shows a warning dialog that the exported file might get cut off.
	 * If the count is less than the ResultSizeMaximum of the PDF capabilities,
	 * no dialog will be shown and the export will proceed automatically.
	 *
	 * @param {object} mSettings Export configuration object
	 * @returns {Promise} Promise that gets resolved if the requirements
	 * for the warning are not met or if the user decides to proceed.
	 * When the user cancels the export, the Promise will reject.
	 *
	 * @private
	 */
	PortableDocument.prototype._showWarning = function(mSettings) {
		let oWarningPromise = Promise.resolve();
		const mParams = {
			rows: mSettings.dataSource.count,
			rowLimit: this._mCapabilities.ResultSizeMaximum,
			fileType: FileType.PDF
		};

		if (isNaN(mParams.rows) || (mParams.rows > mParams.rowLimit)) {
			oWarningPromise = ExportDialog.showWarningDialog(mParams);
		}

		return oWarningPromise;
	};

	/**
	 * Evaluates the error message from the given error parameter and shows it in a dialog.
	 *
	 * @param {string|object|Blob} vError Error object that is provided
	 * @returns {Promise} Shows the error message in a dialog and resolves automatically
	 */
	PortableDocument.showErrorMessage = async (vError) => {
		const oResourceBundle = await ExportUtils.getResourceBundle();

		/* Handle ignore Promise rejection due to cancellation by the user */
		if (!vError) {
			return;
		}

		if (typeof vError.text === "function") {
			vError.text()
			.then((sError) => {
				ExportDialog.showErrorMessage(sError);
			})
			.catch(() => {
				ExportDialog.showErrorMessage(oResourceBundle.getText("PDF_GENERIC_ERROR"));
			});
		} else if (vError.message) {
			ExportDialog.showErrorMessage(vError.message);
		}
	};

	/**
	 * Adds the ResultSizeMaximum from the com.sap.vocabularies.PDF.v1.Features
	 * annotation as $top to the data URL. If this property is not available on
	 * the annotation or its value is not a number, it will be ignored.
	 *
	 * @param {string} sUrl Data URL that is used to request the PDF document
	 * @returns {string} The modified data URL that contains $top. The value of $top is
	 * based on the ResultSizeMaximum of the com.sap.vocabularies.PDF.v1.Features
	 * annotation.
	 */
	PortableDocument.prototype._applyResultSize = function(sUrl) {
		const iLimit = parseInt(this._mCapabilities.ResultSizeMaximum);

		if (!isNaN(iLimit) && iLimit > 0) {
			const mDataUrl = new URL(sUrl);

			mDataUrl.search += "&$top=" + iLimit;
			sUrl = mDataUrl.toString();
		}

		return sUrl;
	};

	/**
	 * Applies default settings to the export configuration.
	 *
	 * @param {object} mSettings Export configuration object
	 * @returns {Promise} Promise that gets resolved when the default settings have been applied
	 *
	 * @private
	 */
	PortableDocument.prototype.setDefaultExportSettings = function(mSettings) {
		let oContext = mSettings?.workbook?.context;

		if (!(oContext instanceof Object)) {
			oContext = mSettings.workbook.context = {};
		}

		if (typeof oContext.title === "string" && oContext.title) {
			return Promise.resolve();
		}

		return ExportUtils.getResourceBundle().then((oResourceBundle) => {
			oContext.title = oResourceBundle.getText("XLSX_DEFAULT_TITLE");
		});
	};

	/**
	 * Sends a POST request to the GW service which creates the
	 * DocumentDescription. The corresponding Id is assigned by
	 * the backend and passed to the event handler functions.
	 *
	 * @param {object} oDocumentDescription DocumentDescription instance that is being created
	 * @param {object} oDataSource DataSource settings of the export configuration
	 *
	 * @returns {Promise} A Promise that resolves with the newly created Id of the DocumentDescription
	 *
	 * @private
	 */
	PortableDocument.prototype.postDocumentDescription = function(oDocumentDescription, oDataSource) {
		const oModel = this._getModel(oDataSource);
		const sPath = "/" + this._getEntitySetName(oDataSource);

		if (!oModel || !oModel.isA(["sap.ui.model.odata.v4.ODataModel", "sap.ui.model.odata.v2.ODataModel"])) {
			return Promise.reject("Unsupported Model");
		}

		return new Promise((fnResolve, fnReject) => {

			if (oModel.isA("sap.ui.model.odata.v4.ODataModel")) {
				const oBinding = oModel.bindList(sPath);

				oBinding.attachCreateCompleted((oEvent) => {
					if (oEvent.getParameter("success")) {
						fnResolve(oEvent.getParameter("context").getObject()["Id"]);
					} else {
						fnReject();
					}
				});

				oBinding.create(oDocumentDescription);
			} else {
				const bUseBatch = oModel.bUseBatch;

				oModel.setUseBatch(false);
				oModel.create(sPath, oDocumentDescription, {
					success: (oData) => {
						oModel.setUseBatch(bUseBatch);
						fnResolve(oData["Id"]);
					},
					error: (oError) => {
						oModel.setUseBatch(bUseBatch);
						fnReject(oError);
					}
				});
			}
		});
	};

	/**
	 * Triggers the export process and returns a Promise the
	 * gets resolved as soon as the export is finished.
	 *
	 * @param {object} mSettings Export settings
	 * @returns {Promise} Promise that is being resolved as soon as the PDF export is finished
	 *
	 * @private
	 */
	PortableDocument.prototype.createBuildPromise = async function(mSettings) {
		const oResourceBundle = await ExportUtils.getResourceBundle();
		const oDocumentDescription = this._createDocumentDescription(mSettings);

		let oBusyDialog = new BusyDialog("PDFExportBusyDialog", {
			title: oResourceBundle.getText("PROGRESS_TITLE"),
			text: oResourceBundle.getText("PDF_GENERATION_IN_PROGRESS"),
			showCancelButton: true,
			close: (oEvent) => {
				if (oEvent.getParameter("cancelPressed")) {
					this.cancel();
				}

				oBusyDialog.destroy();
				oBusyDialog = null;
			}
		});

		oBusyDialog.open();

		try {
			await this._showWarning(mSettings);
			this._request = new AbortController();

			const sDocumentDescriptionId = await this.postDocumentDescription(oDocumentDescription, mSettings.dataSource);
			const response = await this.sendRequest(mSettings.dataSource.dataUrl, sDocumentDescriptionId);

			ExportUtils.saveAsFile(response, mSettings.fileName);
			ExportUtils.announceExportStatus(Status.FINISHED, { assertive: true });
		} catch (oError) {
			PortableDocument.showErrorMessage(oError);
		}

		oBusyDialog?.destroy();
	};

	/**
	 * Requests the generated PDF via HTTP GET from the OData service.
	 *
	 * @param {string} sUrl Absolute data URL of the OData entity that should be exported as PDF
	 * @param {string} sDocumentDescriptionId GUID of the DocumentDescription that should be used for creating the PDF
	 * @returns {Promise} A Promise that gets resolved after the XHR request
	 *
	 * @private
	 */
	PortableDocument.prototype.sendRequest = async function(sUrl, sDocumentDescriptionId) {
		if (this._request?.signal.aborted) {
			throw null; // Explicitly reject the Promise without an error to indicate prior user cancellation
		}

		sUrl = this._applyResultSize(sUrl);

		try {
			const response = await fetch(sUrl, {
				signal: this._request?.signal,
				headers: {
					"Accept": this.getMimeType(),
					"SAP-Document-Description-Id": sDocumentDescriptionId
				}
			});

			if (response.redirected && response.url !== sUrl) {
				openWindow(response.url, "_blank");
				return undefined;
			}

			if (response.ok) {
				return response.blob();
			} else {
				throw response.text();
			}
		} catch (oError) {
			if (oError.name === "AbortError") {
				throw null; // Explicitly reject the Promise without an error to indicate user cancellation
			} else {
				throw oError; // Technical request error
			}
		}
	};

	/**
	 * Returns the specific MIME type
	 *
	 * @returns {string} MIME type for Portable Document Format
	 *
	 * @since 1.112
	 * @public
	 */
	PortableDocument.prototype.getMimeType = function() {
		return "application/pdf";
	};

	/**
	 * Cancels the active request. If the request has not been sent
	 * or the response has been received already, this function has
	 * no effect.
	 *
	 * @since 1.96
	 * @public
	 */
	PortableDocument.prototype.cancel = function() {
		this._request?.abort();
	};

	/**
	 * Cleans up the internal structures and removes all event handlers.
	 *
	 * The object must not be used anymore after destroy was called.
	 *
	 * @see sap.ui.export.ExportBase#destroy
	 * @public
	 */
	PortableDocument.prototype.destroy = function() {
		ExportBase.prototype.destroy.apply(this, arguments);

		this._request = null;
		this._oModel = null;
	};

	return PortableDocument;
});
