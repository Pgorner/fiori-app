sap.ui.define(
	[
		"sap/apf/ui/utils/printModel",
		"sap/apf/utils/exportToGlobal",
		"sap/base/security/encodeXML",
		"sap/m/Text",
		"sap/ui/core/HTML",
		"sap/ui/layout/HorizontalLayout",
		"sap/ui/layout/VerticalLayout"
	],
	function(printModel, exportToGlobal, encodeXML, Text, HTML, HorizontalLayout, VerticalLayout) {
		"use strict";
		/**
		 * @alias sap.apf.ui.utils.PrintView
		 */
		function PrintView(oInject, printModel) {
			this.oUiApi = oInject.uiApi;
			this.oCoreApi = oInject.oCoreApi;
			this.printModel = printModel;
		}
		PrintView.prototype.constructor = PrintView;
		/**
		 * @method _getHeaderForFirstPage creates a header for the first page of print
		 * @returns header for first page of print
		 */
		PrintView.prototype.getHeaderForFirstPage = function() {
			var date = new Date();
			var sAppName = this.printModel.getApplicationName();
			sAppName = this.oCoreApi.getTextNotHtmlEncoded(sAppName);
			var sAnalysisPathTitle = this.printModel.getHeaderForFirstPage();
			var appName, analysisPathTitle, appDate;
			appName = new Text({
				text : sAppName + ":"
			}).addStyleClass("printHeaderTitle");
			analysisPathTitle = new Text({
				text : sAnalysisPathTitle
			}).addStyleClass("printHeaderTitle");
			appDate = new Text({
				text : date.toTimeString()
			}).addStyleClass("printHeaderDate");
			var headerFirstPageLayout = new HorizontalLayout({
				id : 'idAPFheaderLayout',
				content : [ appName, analysisPathTitle, appDate ],
				sanitizeContent : true
			}).addStyleClass("subHeaderPrintWrapper");
			return headerFirstPageLayout;
		};
		PrintView.prototype.getPrintLayoutForFacetFiltersAndFooters = function() {
			var formattedFilters = [];
			var mFilterName = "", mFilterValue = "";
			var oFiltersLayout = new VerticalLayout({
				id : 'idAPFFacetAndFooterLayout'
			});
			formattedFilters = this.printModel.getFiltersToPrint();
			for( var i = 0; i < formattedFilters.length; i++) {
				mFilterName = new Text({
					text : formattedFilters[i].sFilterName
				}).addStyleClass("printFilterName");
				mFilterValue = new Text({
					text : formattedFilters[i].sFilterValue
				}).addStyleClass("printFilterValue");
				oFiltersLayout.addContent(mFilterName);
				oFiltersLayout.addContent(mFilterValue);
			}
			return oFiltersLayout;
		};
		/**
		 * @method _getPrintLayoutForEachStep defines layout used by each step when being printed
		 * @usage _getPrintLayoutForEachStep has to be used to get the layout for individual steps in analysis path.
		 * @param oStep
		 *            is used to get the step information
		 * @param nIndex
		 *            is index of the step being printed
		 * @param nStepsLength
		 *            is the total number of steps in an Analysis Path
		 * @returns the printLayout for a step in an Analysis Path.
		 */
		PrintView.prototype.getPrintLayoutForEachStep = function(oStep, nIndex, nStepsLength) {
			var oChartLayout = new VerticalLayout({
				id : 'idAPFChartLayout' + nIndex
			});
			oChartLayout.addContent(this.printModel.getRepresentationForPrint(oStep));
			var oStepLayout = new VerticalLayout({
				id : 'idAPFStepLayout' + nIndex,
				content : [ _getHeaderForEachStep(nIndex, nStepsLength, this), oChartLayout ]
			}).addStyleClass("representationContent"); // @comment : apfoPrintLayout class not provided in css
			return oStepLayout;
		};
		/**
		 * @method _getHeaderForEachStep creates a header for each step page
		 * @returns header for step page
		 */
		function _getHeaderForEachStep(nIndex, nStepsLength, oPrintViewInstance) {
			var date = new Date();
			var sAppName = oPrintViewInstance.printModel.getApplicationName();
			var sAnalysisPathTitle = oPrintViewInstance.printModel.getHeaderForFirstPage();
			var headerForEachStep = new HTML({
				id : 'idAPFHeaderForEachStep' + nIndex,
				content : [ '<div class="subHeaderPrintWrapper"><p class="printHeaderTitle"> ' + oPrintViewInstance.oCoreApi.getTextHtmlEncoded(sAppName) + ' : ' + encodeXML(sAnalysisPathTitle) + '</p>',
						'<p class="printHeaderDate"> ' + date.toTimeString() + ' </p></div><div class="clear"></div>',
						'<br><div class="printChipName"><p>' + oPrintViewInstance.oCoreApi.getTextHtmlEncoded("print-step-number", [ nIndex, nStepsLength ]) + '</p></div>' ].join(""),
				sanitizeContent : true
			});
			return headerForEachStep;
		}

		// compatibility export as the global name and the module name differ
		exportToGlobal("sap.apf.ui.utils.PrintView", PrintView);

		return PrintView;
	}
);
