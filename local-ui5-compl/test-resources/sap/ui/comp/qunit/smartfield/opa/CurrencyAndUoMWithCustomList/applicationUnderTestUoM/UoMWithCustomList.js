(function () {
	"use strict";

	sap.ui.require(["sap/ui/core/Core"], function(Core) {

		Core.ready(function () {

			sap.ui.require([
				"sap/m/StandardListItem",
				"sap/ui/core/message/ControlMessageProcessor",
				"sap/ui/core/mvc/XMLView",
				"sap/ui/core/mvc/Controller",
				"sap/ui/model/odata/v2/ODataModel",
				"sap/ui/core/util/MockServer",
				"sap/ui/core/Core"
			], function (
				StandardListItem,
				ControlMessageProcessor,
				XMLView,
				Controller,
				ODataModel,
				MockServer,
				Core
			) {
				var MyController = Controller.extend("mainView.controller", {
					onInit: function () {
						var oModel, oView;
						var sServiceName = "testService";

						this.setupMockServer(sServiceName);

						oModel = new ODataModel(sServiceName + "/", {
							useBatch: false,
							defaultBindingMode: "TwoWay"
						});

						oView = this.getView();
						oView.setModel(oModel);

						oModel.getMetaModel().loaded().then(function () {
							this.byId("smartForm").bindElement("/Employees('0001')");
						}.bind(this));

						this._oModel = oModel;
						var messageManager = Core.getMessageManager();
						messageManager.registerObject(this.getView(), true);
						var oMessageProcessor = new ControlMessageProcessor();
						messageManager.registerMessageProcessor(oMessageProcessor);
					},
					submitPending: function () {
						this._oModel.submitChanges();
					},
					onExit: function () {
						this._oMockServer.stop();
					},
					checkModelMessages: function (event) {
						var sMessage = Core.getMessageManager().getMessageModel().getData().map(function (errorMessage) {
							return errorMessage.message;
						});
						this.byId("modelMessages").addItem(new StandardListItem({
							title: "Model message errors length: " + sMessage.length
						}));
						this.byId("modelMessages").addItem(new StandardListItem({
							title: "Model message errors: " + sMessage
						}));
					},
					setupMockServer: function (service) {
						var basePath = service;

						var mockServer = new MockServer({
							rootUri: basePath
						});

						var reqList = mockServer.getRequests();

						// $metadata
						reqList.push({
							method: 'GET',
							path: '/\\$metadata(.*)',
							response: function (req, resp) {
								var data = document.getElementById("metadata").textContent;
								req.respondXML(200, {}, data);
							}
						});

						// Data
						reqList.push({
							method: 'GET',
							path: '/\\Employees(.*)',
							response: function (req, resp) {
								var data = document.getElementById("dataSection").textContent;
								req.respondJSON(200, {}, data);
							}
						});

						// Data

						reqList.push({
							method: 'GET',
							path: '/\\UoMVH[\/?](.*)',
							response: function (req, resp) {
								req.respondJSON(200, {}, dataSectionUoMVH);
							}
						});

						reqList.push({
							method: 'GET',
							path: '/\\SAP__UnitsOfMeasure(.*)',
							response: function (req, resp) {
								req.respondJSON(200, {}, SAP__UnitsOfMeasure);
							}
						});

						mockServer.setRequests(reqList);
						mockServer.simulate(basePath + '/$metadata',
							{
								sMockdataBaseUrl: basePath + '/Employees',
								bGenerateMissingMockData: true
							});
						mockServer.start();
					}
				});

				XMLView.create({
					id: "idView",
					definition: document.getElementById("mainViewUoM").textContent,
					controller: new MyController()
				}).then(function (oView) {
					oView.placeAt("content");
				});

				var dataSectionUoMVH = {
						"d": {
							"__count": "9",
							"results": [
								{
									"__metadata": {
										"uri": "testService.UoMVH/StringVH('KG')",
										"type": "MyNameSpace.UoMVH"
									},
									"UOMKEY": "KG",
									"UOMDESCR": "Kilogram"
								},
								{
									"__metadata": {
										"uri": "testService.UoMVH/StringVH('TO')",
										"type": "MyNameSpace.UoMVH"
									},
									"UOMKEY": "TO",
									"UOMDESCR": "Ton"
								},
								{
									"__metadata": {
										"uri": "testService.UoMVH/StringVH('MG')",
										"type": "MyNameSpace.UoMVH"
									},
									"UOMKEY": "MG",
									"UOMDESCR": "Milligram"
								},
								{
									"__metadata": {
										"uri": "testService.UoMVH/StringVH('MGG')",
										"type": "MyNameSpace.UoMVH"
									},
									"UOMKEY": "MGG",
									"UOMDESCR": "Milligram/gram"
								},
								{
									"__metadata": {
										"uri": "testService.UoMVH/StringVH('MGK')",
										"type": "MyNameSpace.UoMVH"
									},
									"UOMKEY": "MGK",
									"UOMDESCR": "Milligram/kilogram"
								},
								{
									"__metadata": {
										"uri": "testService.UoMVH/StringVH('MUG')",
										"type": "MyNameSpace.UoMVH"
									},
									"UOMKEY": "MUG",
									"UOMDESCR": "Microgramm"
								},
								{
									"__metadata": {
										"uri": "testService.UoMVH/StringVH('G')",
										"type": "MyNameSpace.UoMVH"
									},
									"UOMKEY": "G",
									"UOMDESCR": "Gram"
								},
								{
									"__metadata": {
										"uri": "testService.UoMVH/StringVH('GAU')",
										"type": "MyNameSpace.UoMVH"
									},
									"UOMKEY": "GAU",
									"UOMDESCR": "Gram Gold"
								},
								{
									"__metadata": {
										"uri": "testService.UoMVH/StringVH('G%2FL')",
										"type": "MyNameSpace.UoMVH"
									},
									"UOMKEY": "G/L",
									"UOMDESCR": "Gram Active Ingredient/Liter"
								},
								{
									"__metadata": {
										"uri": "testService.UoMVH/StringVH('EML')",
										"type": "MyNameSpace.UoMVH"
									},
									"UOMKEY": "EML",
									"UOMDESCR": "Enzyme Units/Milliliter"
								}
							]
						}
					},
					SAP__UnitsOfMeasure = {
						"d": {
							"results": [
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('%25')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('%25')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "%",
									"ISOCode": "P1",
									"ExternalCode": "%",
									"Text": "Percentage",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('%25%25')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('%25%25')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "%%",
									"ISOCode": "",
									"ExternalCode": "010",
									"Text": "",
									"DecimalPlaces": 2
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('%25O')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('%25O')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "%O",
									"ISOCode": "",
									"ExternalCode": "%O",
									"Text": "Per mille",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('%2FMI')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('%2FMI')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "/MI",
									"ISOCode": "007",
									"ExternalCode": "009",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('001')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('001')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "001",
									"ISOCode": "",
									"ExternalCode": "002",
									"Text": "KT per PC",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('002')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('002')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "002",
									"ISOCode": "",
									"ExternalCode": "016",
									"Text": "KT per M",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('003')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('003')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "003",
									"ISOCode": "001",
									"ExternalCode": "/NL",
									"Text": "",
									"DecimalPlaces": 1
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('004')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('004')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "004",
									"ISOCode": "002",
									"ExternalCode": "/PL",
									"Text": "",
									"DecimalPlaces": 1
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('005')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('005')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "005",
									"ISOCode": "",
									"ExternalCode": "U/L",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('006')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('006')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "006",
									"ISOCode": "004",
									"ExternalCode": "GDL",
									"Text": "",
									"DecimalPlaces": 1
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('007')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('007')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "007",
									"ISOCode": "005",
									"ExternalCode": "MGD",
									"Text": "",
									"DecimalPlaces": 2
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('021')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('021')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "021",
									"ISOCode": "",
									"ExternalCode": "021",
									"Text": "M per PC",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('1')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('1')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "1",
									"ISOCode": "",
									"ExternalCode": "ONE",
									"Text": "One",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('10')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('10')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "10",
									"ISOCode": "",
									"ExternalCode": "D",
									"Text": "Days",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('15M')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('15M')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "15M",
									"ISOCode": "M15",
									"ExternalCode": "15M",
									"Text": "15 minutes",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('22S')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('22S')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "22S",
									"ISOCode": "",
									"ExternalCode": "22S",
									"Text": "Square millimeter/second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('2M')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('2M')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "2M",
									"ISOCode": "2M",
									"ExternalCode": "CMS",
									"Text": "Centimeter/second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('2X')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('2X')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "2X",
									"ISOCode": "2X",
									"ExternalCode": "000",
									"Text": "Meter/Minute",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('4G')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('4G')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "4G",
									"ISOCode": "4G",
									"ExternalCode": "µL",
									"Text": "Microliter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('4O')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('4O')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "4O",
									"ISOCode": "4O",
									"ExternalCode": "µF",
									"Text": "Microfarad",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('4T')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('4T')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "4T",
									"ISOCode": "4T",
									"ExternalCode": "PF",
									"Text": "Picofarad",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('999')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('999')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "999",
									"ISOCode": "",
									"ExternalCode": "999",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('A')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('A')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "A",
									"ISOCode": "AMP",
									"ExternalCode": "A",
									"Text": "Ampere",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('A87')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('A87')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "A87",
									"ISOCode": "A87",
									"ExternalCode": "GOH",
									"Text": "Gigaohm",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('A93')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('A93')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "A93",
									"ISOCode": "A93",
									"ExternalCode": "GM3",
									"Text": "Gram/cubic meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('ACR')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('ACR')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "ACR",
									"ISOCode": "ACR",
									"ExternalCode": "ACR",
									"Text": "Acre",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('B34')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('B34')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "B34",
									"ISOCode": "B34",
									"ExternalCode": "KD3",
									"Text": "Kilogram/cubic decimeter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('B45')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('B45')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "B45",
									"ISOCode": "B45",
									"ExternalCode": "KML",
									"Text": "Kilomole",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('B47')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('B47')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "B47",
									"ISOCode": "B47",
									"ExternalCode": "NI",
									"Text": "Kilonewton",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('B73')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('B73')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "B73",
									"ISOCode": "B73",
									"ExternalCode": "MN",
									"Text": "Meganewton",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('B75')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('B75')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "B75",
									"ISOCode": "B75",
									"ExternalCode": "MGO",
									"Text": "Megaohm",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('B78')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('B78')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "B78",
									"ISOCode": "B78",
									"ExternalCode": "MHV",
									"Text": "Megavolt",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('B84')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('B84')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "B84",
									"ISOCode": "B84",
									"ExternalCode": "µA",
									"Text": "Microampere",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('BAG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('BAG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "BAG",
									"ISOCode": "BG",
									"ExternalCode": "BAG",
									"Text": "Bag",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('BAR')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('BAR')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "BAR",
									"ISOCode": "BAR",
									"ExternalCode": "BAR",
									"Text": "bar",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TO')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TO')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TO",
									"ISOCode": "TNE",
									"ExternalCode": "TO",
									"Text": "Ton",
									"DecimalPlaces": 1
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KG",
									"ISOCode": "KGM",
									"ExternalCode": "KG",
									"Text": "Kilogram",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('H')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('H')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "H",
									"ISOCode": "",
									"ExternalCode": "H",
									"Text": "Hours",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('BOT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('BOT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "BOT",
									"ISOCode": "BO",
									"ExternalCode": "BT",
									"Text": "Bottle",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('BOX')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('BOX')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "BOX",
									"ISOCode": "BX",
									"ExternalCode": "BOX",
									"Text": "Cardboard box",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('BQK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('BQK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "BQK",
									"ISOCode": "A18",
									"ExternalCode": "BQK",
									"Text": "Becquerel/kilogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('BT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('BT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "BT",
									"ISOCode": "BO",
									"ExternalCode": "003",
									"Text": "Bottle",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MIN')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MIN')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MIN",
									"ISOCode": "MIN",
									"ExternalCode": "MIN",
									"Text": "Minutes",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('S')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('S')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "S",
									"ISOCode": "SEC",
									"ExternalCode": "S",
									"Text": "Seconds",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('C')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('C')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "C",
									"ISOCode": "",
									"ExternalCode": "C",
									"Text": "Degrees Celsius",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('C10')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('C10')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "C10",
									"ISOCode": "C10",
									"ExternalCode": "RF",
									"Text": "Millifarad",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('C36')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('C36')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "C36",
									"ISOCode": "",
									"ExternalCode": "M/M",
									"Text": "Mole per Cubic Meter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('C38')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('C38')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "C38",
									"ISOCode": "C38",
									"ExternalCode": "M/L",
									"Text": "Mole per Liter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('C39')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('C39')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "C39",
									"ISOCode": "C39",
									"ExternalCode": "NA",
									"Text": "Nanoampere",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('C3S')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('C3S')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "C3S",
									"ISOCode": "2J",
									"ExternalCode": "C3S",
									"Text": "Cubic centimeter/second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('C41')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('C41')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "C41",
									"ISOCode": "C41",
									"ExternalCode": "R-U",
									"Text": "Nanofarad",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('C56')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('C56')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "C56",
									"ISOCode": "C56",
									"ExternalCode": "NMM",
									"Text": "Newton/square millimeter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CCM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CCM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CCM",
									"ISOCode": "CMQ",
									"ExternalCode": "CCM",
									"Text": "Cubic centimeter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CD')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CD')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CD",
									"ISOCode": "CDL",
									"ExternalCode": "CD",
									"Text": "Candela",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CDM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CDM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CDM",
									"ISOCode": "DMQ",
									"ExternalCode": "CD3",
									"Text": "Cubic decimeter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CFU')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CFU')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CFU",
									"ISOCode": "",
									"ExternalCode": "CFU",
									"Text": "CFU",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CHG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CHG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CHG",
									"ISOCode": "",
									"ExternalCode": "CHG",
									"Text": "Charge",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CM",
									"ISOCode": "CMT",
									"ExternalCode": "CM",
									"Text": "Centimeter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CM2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CM2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CM2",
									"ISOCode": "CMK",
									"ExternalCode": "CM2",
									"Text": "Square centimeter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CMH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CMH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CMH",
									"ISOCode": "",
									"ExternalCode": "CMH",
									"Text": "Centimeter/hour",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CPA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CPA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CPA",
									"ISOCode": "",
									"ExternalCode": "CP",
									"Text": "Centipoise",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CS",
									"ISOCode": "CS",
									"ExternalCode": "CV",
									"Text": "Case",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CSE')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CSE')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CSE",
									"ISOCode": "CSE",
									"ExternalCode": "CSE",
									"Text": "Case",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CTL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CTL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CTL",
									"ISOCode": "CLT",
									"ExternalCode": "CL",
									"Text": "Centiliter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('CWT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('CWT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "CWT",
									"ISOCode": "",
									"ExternalCode": "CWT",
									"Text": "Hundred Weight",
									"DecimalPlaces": 5
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('D10')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('D10')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "D10",
									"ISOCode": "D10",
									"ExternalCode": "S/M",
									"Text": "Siemens per meter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('D41')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('D41')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "D41",
									"ISOCode": "D41",
									"ExternalCode": "TOM",
									"Text": "Tonne/cubic meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('D46')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('D46')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "D46",
									"ISOCode": "D46",
									"ExternalCode": "VAM",
									"Text": "Volt - ampere",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('DEG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('DEG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "DEG",
									"ISOCode": "DD",
									"ExternalCode": "DEG",
									"Text": "Degree",
									"DecimalPlaces": 99
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('DM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('DM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "DM",
									"ISOCode": "DMT",
									"ExternalCode": "DM",
									"Text": "Decimeter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('DR')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('DR')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "DR",
									"ISOCode": "DR",
									"ExternalCode": "DR",
									"Text": "Drum",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('DZ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('DZ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "DZ",
									"ISOCode": "DZN",
									"ExternalCode": "DZ",
									"Text": "Dozen",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('EA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('EA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "EA",
									"ISOCode": "EA",
									"ExternalCode": "EA",
									"Text": "Each",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('EE')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('EE')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "EE",
									"ISOCode": "",
									"ExternalCode": "EU",
									"Text": "Enzyme Units",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('EH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('EH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "EH",
									"ISOCode": "",
									"ExternalCode": "UN",
									"Text": "Unit",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('EML')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('EML')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "EML",
									"ISOCode": "",
									"ExternalCode": "EML",
									"Text": "Enzyme Units/Milliliter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('F')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('F')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "F",
									"ISOCode": "FAR",
									"ExternalCode": "F",
									"Text": "Farad",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('FA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('FA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "FA",
									"ISOCode": "FAH",
									"ExternalCode": "°F",
									"Text": "Fahrenheit",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('FT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('FT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "FT",
									"ISOCode": "FOT",
									"ExternalCode": "FT",
									"Text": "Foot",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('FT2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('FT2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "FT2",
									"ISOCode": "FTK",
									"ExternalCode": "FT2",
									"Text": "Square foot",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('FT3')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('FT3')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "FT3",
									"ISOCode": "FTQ",
									"ExternalCode": "FT3",
									"Text": "Cubic foot",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('FUM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('FUM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "FUM",
									"ISOCode": "",
									"ExternalCode": "FUM",
									"Text": "Forecast Unit of Measure",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('G')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('G')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "G",
									"ISOCode": "GRM",
									"ExternalCode": "G",
									"Text": "Gram",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('G%2FL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('G%2FL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "G/L",
									"ISOCode": "",
									"ExternalCode": "G/L",
									"Text": "Gram Active Ingredient/Liter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GAU')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GAU')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GAU",
									"ISOCode": "",
									"ExternalCode": "GAU",
									"Text": "Gram Gold",
									"DecimalPlaces": 99
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GC')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GC')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GC",
									"ISOCode": "CEL",
									"ExternalCode": "°C",
									"Text": "Degrees Celsius",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GHG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GHG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GHG",
									"ISOCode": "",
									"ExternalCode": "GHG",
									"Text": "Gram/hectogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GJ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GJ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GJ",
									"ISOCode": "GV",
									"ExternalCode": "GJ",
									"Text": "Gigajoule",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GKG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GKG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GKG",
									"ISOCode": "GK",
									"ExternalCode": "GKG",
									"Text": "Gram/kilogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GLI')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GLI')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GLI",
									"ISOCode": "GL",
									"ExternalCode": "GLI",
									"Text": "Gram/liter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GLL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GLL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GLL",
									"ISOCode": "GLL",
									"ExternalCode": "GAL",
									"Text": "Gallon (US)",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GLM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GLM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GLM",
									"ISOCode": "",
									"ExternalCode": "GPM",
									"Text": "Gallons per mile (US)",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GM",
									"ISOCode": "",
									"ExternalCode": "GM",
									"Text": "Gram/Mole",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GM2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GM2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GM2",
									"ISOCode": "GM",
									"ExternalCode": "GM2",
									"Text": "Gram/square meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GPH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GPH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GPH",
									"ISOCode": "",
									"ExternalCode": "GPH",
									"Text": "Gallons per hour (US)",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GQ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GQ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GQ",
									"ISOCode": "GQ",
									"ExternalCode": "µGQ",
									"Text": "Microgram/cubic meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GRO')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GRO')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GRO",
									"ISOCode": "GRO",
									"ExternalCode": "GRO",
									"Text": "Gross",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GV')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GV')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GV",
									"ISOCode": "",
									"ExternalCode": "GC3",
									"Text": "Gramm/Cubic centimeter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('GW')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('GW')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "GW",
									"ISOCode": "",
									"ExternalCode": "GAI",
									"Text": "Gram Active Ingredient",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KWH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KWH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KWH",
									"ISOCode": "KWH",
									"ExternalCode": "KWH",
									"Text": "Kilowatt hour",
									"DecimalPlaces": 99
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('HAR')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('HAR')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "HAR",
									"ISOCode": "HAR",
									"ExternalCode": "HA",
									"Text": "Hectare",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('HL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('HL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "HL",
									"ISOCode": "HLT",
									"ExternalCode": "HL",
									"Text": "Hectoliter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('HPA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('HPA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "HPA",
									"ISOCode": "A97",
									"ExternalCode": "HPA",
									"Text": "Hectopascal",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('HUR')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('HUR')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "HUR",
									"ISOCode": "HR",
									"ExternalCode": "HUR",
									"Text": "Hours",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('HZ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('HZ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "HZ",
									"ISOCode": "HTZ",
									"ExternalCode": "HZ",
									"Text": "Hertz (1/second)",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('IN')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('IN')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "IN",
									"ISOCode": "INH",
									"ExternalCode": "\"",
									"Text": "Inch",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('IN2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('IN2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "IN2",
									"ISOCode": "INK",
									"ExternalCode": "\"2",
									"Text": "Square inch",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('IN3')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('IN3')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "IN3",
									"ISOCode": "INQ",
									"ExternalCode": "\"3",
									"Text": "Cubic inch",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('J')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('J')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "J",
									"ISOCode": "JOU",
									"ExternalCode": "J",
									"Text": "Joule",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('JHR')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('JHR')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "JHR",
									"ISOCode": "ANN",
									"ExternalCode": "YR",
									"Text": "Years",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('JKG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('JKG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "JKG",
									"ISOCode": "J2",
									"ExternalCode": "JKG",
									"Text": "Joule/Kilogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('JKK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('JKK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "JKK",
									"ISOCode": "B11",
									"ExternalCode": "JKK",
									"Text": "Specific Heat Capacity",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('JMO')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('JMO')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "JMO",
									"ISOCode": "B15",
									"ExternalCode": "JMO",
									"Text": "Joule/Mole",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('K')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('K')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "K",
									"ISOCode": "KEL",
									"ExternalCode": "K",
									"Text": "Kelvin",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KA",
									"ISOCode": "B22",
									"ExternalCode": "KA",
									"Text": "Kiloampere",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KAN')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KAN')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KAN",
									"ISOCode": "CA",
									"ExternalCode": "CAN",
									"Text": "Canister",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KAR')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KAR')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KAR",
									"ISOCode": "CT",
									"ExternalCode": "CAR",
									"Text": "Carton",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KBK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KBK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KBK",
									"ISOCode": "B25",
									"ExternalCode": "KBK",
									"Text": "Kilobecquerel/Kilogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MWH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MWH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MWH",
									"ISOCode": "MWH",
									"ExternalCode": "MWH",
									"Text": "Megawatt hour",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KGF')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KGF')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KGF",
									"ISOCode": "28",
									"ExternalCode": "KGF",
									"Text": "Kilogram/Square meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KGK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KGK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KGK",
									"ISOCode": "",
									"ExternalCode": "KGK",
									"Text": "Kilogram/Kilogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KGM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KGM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KGM",
									"ISOCode": "",
									"ExternalCode": "KGM",
									"Text": "Kilogram/Mole",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KGS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KGS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KGS",
									"ISOCode": "KGS",
									"ExternalCode": "KGS",
									"Text": "Kilogram/second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KGV')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KGV')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KGV",
									"ISOCode": "KMQ",
									"ExternalCode": "KGV",
									"Text": "Kilogram/cubic meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KGW')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KGW')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KGW",
									"ISOCode": "",
									"ExternalCode": "KAI",
									"Text": "Kilogram Active Ingredient",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KHZ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KHZ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KHZ",
									"ISOCode": "KHZ",
									"ExternalCode": "KHZ",
									"Text": "Kilohertz",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KI')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KI')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KI",
									"ISOCode": "CR",
									"ExternalCode": "CRT",
									"Text": "Crate",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KIT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KIT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KIT",
									"ISOCode": "CT",
									"ExternalCode": "KIT",
									"Text": "Patient Kit",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KJ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KJ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KJ",
									"ISOCode": "KJO",
									"ExternalCode": "KJ",
									"Text": "Kilojoule",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KJK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KJK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KJK",
									"ISOCode": "B42",
									"ExternalCode": "KJK",
									"Text": "Kilojoule/kilogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KJM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KJM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KJM",
									"ISOCode": "B44",
									"ExternalCode": "KJM",
									"Text": "Kilojoule/Mole",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KM",
									"ISOCode": "KMT",
									"ExternalCode": "KM",
									"Text": "Kilometer",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KM2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KM2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KM2",
									"ISOCode": "KMK",
									"ExternalCode": "KM2",
									"Text": "Square kilometer",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KMH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KMH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KMH",
									"ISOCode": "KMH",
									"ExternalCode": "KMH",
									"Text": "Kilometer/hour",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KMK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KMK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KMK",
									"ISOCode": "",
									"ExternalCode": "KMK",
									"Text": "Cubic meter/Cubic meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KMN')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KMN')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KMN",
									"ISOCode": "",
									"ExternalCode": "KMN",
									"Text": "Kelvin/Minute",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KMS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KMS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KMS",
									"ISOCode": "",
									"ExternalCode": "KMS",
									"Text": "Kelvin/Second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KNM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KNM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KNM",
									"ISOCode": "",
									"ExternalCode": "KNM",
									"Text": "Kilonewton per square meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KOH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KOH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KOH",
									"ISOCode": "B49",
									"ExternalCode": "KOH",
									"Text": "Kiloohm",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KPA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KPA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KPA",
									"ISOCode": "",
									"ExternalCode": "KPA",
									"Text": "Kilopascal",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KT",
									"ISOCode": "",
									"ExternalCode": "KT",
									"Text": "Kiloton",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KV')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KV')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KV",
									"ISOCode": "KVT",
									"ExternalCode": "KV",
									"Text": "Kilovolt",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KVA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KVA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KVA",
									"ISOCode": "KVA",
									"ExternalCode": "KVA",
									"Text": "Kilovolt - ampere",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KW')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KW')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KW",
									"ISOCode": "KWT",
									"ExternalCode": "KW",
									"Text": "Kilowatt",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KW1')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KW1')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KW1",
									"ISOCode": "",
									"ExternalCode": "KI1",
									"Text": "KG Active ingredient aroma",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KW2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KW2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KW2",
									"ISOCode": "",
									"ExternalCode": "KI2",
									"Text": "KG Active ingred. fruit pulp",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('KWK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('KWK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "KWK",
									"ISOCode": "",
									"ExternalCode": "KIK",
									"Text": "kg Active Ingredient/kg",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('L')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('L')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "L",
									"ISOCode": "LTR",
									"ExternalCode": "L",
									"Text": "Liter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('L2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('L2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "L2",
									"ISOCode": "L2",
									"ExternalCode": "LMI",
									"Text": "Liter/Minute",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LAG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LAG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LAG",
									"ISOCode": "",
									"ExternalCode": "LAG",
									"Text": "Stor",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LB')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LB')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LB",
									"ISOCode": "LBR",
									"ExternalCode": "LB",
									"Text": "Pound",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LE')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LE')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LE",
									"ISOCode": "C62",
									"ExternalCode": "AU",
									"Text": "Activity unit",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LF')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LF')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LF",
									"ISOCode": "",
									"ExternalCode": "017",
									"Text": "",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LH",
									"ISOCode": "",
									"ExternalCode": "L/H",
									"Text": "Liter per hour",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LHK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LHK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LHK",
									"ISOCode": "",
									"ExternalCode": "LHK",
									"Text": "Liter per 100 km",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LMS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LMS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LMS",
									"ISOCode": "",
									"ExternalCode": "LMS",
									"Text": "Liter/Mole Second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LPH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LPH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LPH",
									"ISOCode": "",
									"ExternalCode": "LPH",
									"Text": "Liter per hour",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LPL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LPL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LPL",
									"ISOCode": "",
									"ExternalCode": "LPL",
									"Text": "liters per liter",
									"DecimalPlaces": 2
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LS",
									"ISOCode": "",
									"ExternalCode": "004",
									"Text": "",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LSL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LSL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LSL",
									"ISOCode": "",
									"ExternalCode": "LIL",
									"Text": "Liter Active ingredient/Liter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('LW1')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('LW1')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "LW1",
									"ISOCode": "",
									"ExternalCode": "LI1",
									"Text": "Liter Active ingredient 1",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M",
									"ISOCode": "MTR",
									"ExternalCode": "M",
									"Text": "Meter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M%25')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M%25')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M%",
									"ISOCode": "",
									"ExternalCode": "M%",
									"Text": "Percent mass",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M%25O')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M%25O')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M%O",
									"ISOCode": "",
									"ExternalCode": "M%O",
									"Text": "Permille mass",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M%2FS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M%2FS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M/S",
									"ISOCode": "MTS",
									"ExternalCode": "M/S",
									"Text": "Meter/second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M2",
									"ISOCode": "MTK",
									"ExternalCode": "M2",
									"Text": "Square meter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M2H')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M2H')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M2H",
									"ISOCode": "",
									"ExternalCode": "M2H",
									"Text": "mm/1h",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M2I')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M2I')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M2I",
									"ISOCode": "",
									"ExternalCode": "M-2",
									"Text": "1/Square Meter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M2S')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M2S')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M2S",
									"ISOCode": "S4",
									"ExternalCode": "M2S",
									"Text": "Square meter/second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M3')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M3')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M3",
									"ISOCode": "MTQ",
									"ExternalCode": "M3",
									"Text": "Cubic meter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M3D')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M3D')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M3D",
									"ISOCode": "",
									"ExternalCode": "M3D",
									"Text": "Cubic meter/day",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('M3S')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('M3S')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "M3S",
									"ISOCode": "MQS",
									"ExternalCode": "M3S",
									"Text": "Cubic meter/second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MA",
									"ISOCode": "4K",
									"ExternalCode": "MA",
									"Text": "Milliampere",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MBA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MBA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MBA",
									"ISOCode": "MBR",
									"ExternalCode": "MBA",
									"Text": "Millibar",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MBZ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MBZ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MBZ",
									"ISOCode": "",
									"ExternalCode": "MBZ",
									"Text": "Meterbar/second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MEJ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MEJ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MEJ",
									"ISOCode": "3B",
									"ExternalCode": "MEJ",
									"Text": "Megajoule",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MET')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MET')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MET",
									"ISOCode": "",
									"ExternalCode": "MET",
									"Text": "Meter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MG",
									"ISOCode": "MGM",
									"ExternalCode": "MG",
									"Text": "Milligram",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MGF')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MGF')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MGF",
									"ISOCode": "",
									"ExternalCode": "MGE",
									"Text": "Milligram/Square centimeter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MGG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MGG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MGG",
									"ISOCode": "",
									"ExternalCode": "MGG",
									"Text": "Milligram/gram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MGK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MGK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MGK",
									"ISOCode": "NA",
									"ExternalCode": "MGK",
									"Text": "Milligram/kilogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MGL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MGL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MGL",
									"ISOCode": "M1",
									"ExternalCode": "MGL",
									"Text": "Milligram/liter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MGQ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MGQ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MGQ",
									"ISOCode": "GP",
									"ExternalCode": "MGQ",
									"Text": "Milligram/cubic meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MGW')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MGW')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MGW",
									"ISOCode": "MAW",
									"ExternalCode": "MGW",
									"Text": "Megawatt",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MHG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MHG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MHG",
									"ISOCode": "006",
									"ExternalCode": "MHG",
									"Text": "mmHG",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MHZ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MHZ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MHZ",
									"ISOCode": "MHZ",
									"ExternalCode": "MHZ",
									"Text": "Megahertz",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MI')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MI')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MI",
									"ISOCode": "SMI",
									"ExternalCode": "MI",
									"Text": "Mile",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MI2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MI2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MI2",
									"ISOCode": "MIK",
									"ExternalCode": "MI2",
									"Text": "Square mile",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MIB')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MIB')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MIB",
									"ISOCode": "",
									"ExternalCode": "005",
									"Text": "",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MIM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MIM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MIM",
									"ISOCode": "4H",
									"ExternalCode": "µM",
									"Text": "Micrometer",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MIS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MIS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MIS",
									"ISOCode": "B98",
									"ExternalCode": "MIS",
									"Text": "Microsecond",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MJ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MJ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MJ",
									"ISOCode": "C15",
									"ExternalCode": "MIJ",
									"Text": "Millijoule",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('ML')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('ML')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "ML",
									"ISOCode": "MLT",
									"ExternalCode": "ML",
									"Text": "Milliliter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MLK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MLK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MLK",
									"ISOCode": "",
									"ExternalCode": "MLK",
									"Text": "Milliliter/cubic meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MLM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MLM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MLM",
									"ISOCode": "",
									"ExternalCode": "MLM",
									"Text": "Mililiter/Minute",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MLW')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MLW')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MLW",
									"ISOCode": "",
									"ExternalCode": "MLI",
									"Text": "Milliliter Active Ingredient",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MM",
									"ISOCode": "MMT",
									"ExternalCode": "MM",
									"Text": "Millimeter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MM2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MM2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MM2",
									"ISOCode": "MMK",
									"ExternalCode": "MM2",
									"Text": "Square millimeter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MMA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MMA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MMA",
									"ISOCode": "",
									"ExternalCode": "MMA",
									"Text": "Millimeter/year",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MMG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MMG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MMG",
									"ISOCode": "",
									"ExternalCode": "MMG",
									"Text": "Millimole/Gram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MMH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MMH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MMH",
									"ISOCode": "",
									"ExternalCode": "MMH",
									"Text": "Millimeter/hour",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MMK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MMK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MMK",
									"ISOCode": "D87",
									"ExternalCode": "MMK",
									"Text": "Millimole/Kilogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MMO')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MMO')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MMO",
									"ISOCode": "C18",
									"ExternalCode": "MMO",
									"Text": "Millimole",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MMQ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MMQ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MMQ",
									"ISOCode": "MMQ",
									"ExternalCode": "MM3",
									"Text": "Cubic millimeter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MMS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MMS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MMS",
									"ISOCode": "C16",
									"ExternalCode": "MMS",
									"Text": "Millimeter/second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MNM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MNM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MNM",
									"ISOCode": "C22",
									"ExternalCode": "MNM",
									"Text": "Millinewton/meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MOK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MOK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MOK",
									"ISOCode": "C19",
									"ExternalCode": "MOK",
									"Text": "Mole/Kilogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MOL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MOL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MOL",
									"ISOCode": "C34",
									"ExternalCode": "MOL",
									"Text": "Mole",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MON')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MON')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MON",
									"ISOCode": "MON",
									"ExternalCode": "MON",
									"Text": "Months",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MPA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MPA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MPA",
									"ISOCode": "MPA",
									"ExternalCode": "MPA",
									"Text": "Megapascal",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MPB')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MPB')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MPB",
									"ISOCode": "",
									"ExternalCode": "MPB",
									"Text": "Mass parts per billion",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MPG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MPG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MPG",
									"ISOCode": "",
									"ExternalCode": "MPG",
									"Text": "Miles per gallon (US)",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MPM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MPM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MPM",
									"ISOCode": "",
									"ExternalCode": "MPM",
									"Text": "Mass parts per million",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MPS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MPS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MPS",
									"ISOCode": "C24",
									"ExternalCode": "MPS",
									"Text": "Millipascal second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MPT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MPT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MPT",
									"ISOCode": "",
									"ExternalCode": "MPT",
									"Text": "Mass parts per trillion",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MPZ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MPZ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MPZ",
									"ISOCode": "",
									"ExternalCode": "MPZ",
									"Text": "Meterpascal/second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MQH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MQH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MQH",
									"ISOCode": "MQH",
									"ExternalCode": "M3H",
									"Text": "Cubic meter/hour",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MS",
									"ISOCode": "C26",
									"ExternalCode": "MSE",
									"Text": "Millisecond",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MS2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MS2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MS2",
									"ISOCode": "MSK",
									"ExternalCode": "MS2",
									"Text": "Meter/Square Second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MTE')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MTE')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MTE",
									"ISOCode": "C29",
									"ExternalCode": "MTE",
									"Text": "Millitesla",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MTL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MTL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MTL",
									"ISOCode": "",
									"ExternalCode": "MTL",
									"Text": "Mil/ul",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MTS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MTS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MTS",
									"ISOCode": "",
									"ExternalCode": "M/H",
									"Text": "Meter/Hour",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MUG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MUG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MUG",
									"ISOCode": "",
									"ExternalCode": "µG",
									"Text": "Microgramm",
									"DecimalPlaces": 6
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MV')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MV')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MV",
									"ISOCode": "2Z",
									"ExternalCode": "MV",
									"Text": "Millivolt",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MVA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MVA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MVA",
									"ISOCode": "MVA",
									"ExternalCode": "MVA",
									"Text": "Megavolt - ampere",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MW')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MW')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MW",
									"ISOCode": "C31",
									"ExternalCode": "MW",
									"Text": "Milliwatt",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('MYL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('MYL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "MYL",
									"ISOCode": "",
									"ExternalCode": "/µ",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('N')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('N')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "N",
									"ISOCode": "NEW",
									"ExternalCode": "N",
									"Text": "Newton",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('NAM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('NAM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "NAM",
									"ISOCode": "C45",
									"ExternalCode": "NAM",
									"Text": "Nanometer",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('NM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('NM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "NM",
									"ISOCode": "4P",
									"ExternalCode": "NM",
									"Text": "Newton/meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('NO')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('NO')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "NO",
									"ISOCode": "",
									"ExternalCode": "NO",
									"Text": "Without unit of measure",
									"DecimalPlaces": 2
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('NS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('NS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "NS",
									"ISOCode": "C47",
									"ExternalCode": "NS",
									"Text": "Nanosecond",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('OCM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('OCM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "OCM",
									"ISOCode": "C60",
									"ExternalCode": "OCM",
									"Text": "Specific Electrical Resistance",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('OHM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('OHM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "OHM",
									"ISOCode": "OHM",
									"ExternalCode": "OHM",
									"Text": "Ohm",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('OM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('OM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "OM",
									"ISOCode": "C61",
									"ExternalCode": "OM",
									"Text": "Specific Electrical Resistance",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('OPH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('OPH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "OPH",
									"ISOCode": "",
									"ExternalCode": "OPH",
									"Text": "Operating hours",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('OZ')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('OZ')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "OZ",
									"ISOCode": "ONZ",
									"ExternalCode": "OZ",
									"Text": "Ounce",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('OZA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('OZA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "OZA",
									"ISOCode": "OZA",
									"ExternalCode": "FOZ",
									"Text": "Fluid ounce (US)",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('P')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('P')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "P",
									"ISOCode": "",
									"ExternalCode": "P",
									"Text": "Points",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PA",
									"ISOCode": "PAL",
									"ExternalCode": "PA",
									"Text": "Pascal",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PAA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PAA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PAA",
									"ISOCode": "PR",
									"ExternalCode": "PAA",
									"Text": "Pair",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PAK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PAK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PAK",
									"ISOCode": "PK",
									"ExternalCode": "PAC",
									"Text": "Pack",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PAL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PAL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PAL",
									"ISOCode": "PF",
									"ExternalCode": "PAL",
									"Text": "Pallet",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PAS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PAS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PAS",
									"ISOCode": "C65",
									"ExternalCode": "PAS",
									"Text": "Pascal second",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PC')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PC')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PC",
									"ISOCode": "",
									"ExternalCode": "013",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PDA')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PDA')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PDA",
									"ISOCode": "",
									"ExternalCode": "PDA",
									"Text": "Consultant Day",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PER')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PER')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PER",
									"ISOCode": "",
									"ExternalCode": "PER",
									"Text": "Persons",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PGR')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PGR')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PGR",
									"ISOCode": "",
									"ExternalCode": "PGR",
									"Text": "Pikogram",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PH",
									"ISOCode": "",
									"ExternalCode": "PH",
									"Text": "pH value",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PKT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PKT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PKT",
									"ISOCode": "",
									"ExternalCode": "PKT",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PMI')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PMI')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PMI",
									"ISOCode": "",
									"ExternalCode": "PMI",
									"Text": "1/minute",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PMR')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PMR')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PMR",
									"ISOCode": "",
									"ExternalCode": "PMR",
									"Text": "Permeation Rate SI",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PNS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PNS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PNS",
									"ISOCode": "",
									"ExternalCode": "PNS",
									"Text": "GRNSPack",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PPB')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PPB')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PPB",
									"ISOCode": "61",
									"ExternalCode": "PPB",
									"Text": "Parts per billion",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PPM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PPM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PPM",
									"ISOCode": "59",
									"ExternalCode": "PPM",
									"Text": "Part per million",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PPT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PPT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PPT",
									"ISOCode": "",
									"ExternalCode": "PPT",
									"Text": "Parts per trillion",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PRM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PRM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PRM",
									"ISOCode": "",
									"ExternalCode": "PRM",
									"Text": "Permeation Rate",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PRS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PRS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PRS",
									"ISOCode": "IE",
									"ExternalCode": "PRS",
									"Text": "Number of Persons",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PS",
									"ISOCode": "",
									"ExternalCode": "PS",
									"Text": "Picosecond",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PSI')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PSI')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PSI",
									"ISOCode": "",
									"ExternalCode": "PSI",
									"Text": "Pound/square inch",
									"DecimalPlaces": 1
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PT",
									"ISOCode": "PT",
									"ExternalCode": "PT",
									"Text": "Pint (US)",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('PTS')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('PTS')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "PTS",
									"ISOCode": "PTS",
									"ExternalCode": "006",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('QT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('QT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "QT",
									"ISOCode": "QT",
									"ExternalCode": "QT",
									"Text": "Quart (US)",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('REP')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('REP')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "REP",
									"ISOCode": "",
									"ExternalCode": "REP",
									"Text": "Rep",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('RHO')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('RHO')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "RHO",
									"ISOCode": "",
									"ExternalCode": "RHO",
									"Text": "Gram/Cubic Centimeter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('RL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('RL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "RL",
									"ISOCode": "RL",
									"ExternalCode": "RL",
									"Text": "Reel",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('RM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('RM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "RM",
									"ISOCode": "",
									"ExternalCode": "RM",
									"Text": "Ream",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('ROL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('ROL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "ROL",
									"ISOCode": "RO",
									"ExternalCode": "ROL",
									"Text": "Roll",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('RPM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('RPM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "RPM",
									"ISOCode": "",
									"ExternalCode": "RPM",
									"Text": "Rotation per minute",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('RZ1')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('RZ1')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "RZ1",
									"ISOCode": "3H",
									"ExternalCode": "015",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('SCM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('SCM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "SCM",
									"ISOCode": "SCM",
									"ExternalCode": "SCM",
									"Text": "SCM",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('SET')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('SET')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "SET",
									"ISOCode": "SET",
									"ExternalCode": "SET",
									"Text": "SET",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('SHT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('SHT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "SHT",
									"ISOCode": "ST",
									"ExternalCode": "SHT",
									"Text": "Sheet",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('ST')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('ST')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "ST",
									"ISOCode": "PCE",
									"ExternalCode": "PC",
									"Text": "Piece",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('STD')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('STD')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "STD",
									"ISOCode": "HUR",
									"ExternalCode": "HR",
									"Text": "Hours",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TAG')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TAG')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TAG",
									"ISOCode": "DAY",
									"ExternalCode": "DAY",
									"Text": "Days",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TC3')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TC3')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TC3",
									"ISOCode": "",
									"ExternalCode": "TC3",
									"Text": "1/cubic centimeter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TE')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TE')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TE",
									"ISOCode": "",
									"ExternalCode": "TE",
									"Text": "Each time",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TES')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TES')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TES",
									"ISOCode": "D33",
									"ExternalCode": "TES",
									"Text": "Tesla",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TH",
									"ISOCode": "MIL",
									"ExternalCode": "TS",
									"Text": "Thousands",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TK",
									"ISOCode": "",
									"ExternalCode": "TP",
									"Text": "Tank pallet",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TL",
									"ISOCode": "",
									"ExternalCode": "TL",
									"Text": "Truck Load",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TM",
									"ISOCode": "",
									"ExternalCode": "TM",
									"Text": "Meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TM3')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TM3')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TM3",
									"ISOCode": "",
									"ExternalCode": "TM3",
									"Text": "1/cubic meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TON')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TON')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TON",
									"ISOCode": "",
									"ExternalCode": "TON",
									"Text": "US Ton",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('TST')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('TST')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "TST",
									"ISOCode": "",
									"ExternalCode": "001",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('UGL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('UGL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "UGL",
									"ISOCode": "",
									"ExternalCode": "µGL",
									"Text": "Microgram/liter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('UK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('UK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "UK",
									"ISOCode": "PA",
									"ExternalCode": "UK",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('UNX')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('UNX')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "UNX",
									"ISOCode": "",
									"ExternalCode": "022",
									"Text": "",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('V')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('V')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "V",
									"ISOCode": "VLT",
									"ExternalCode": "V",
									"Text": "Volt",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('V%25')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('V%25')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "V%",
									"ISOCode": "",
									"ExternalCode": "V%",
									"Text": "Percent volume",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('V%25O')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('V%25O')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "V%O",
									"ISOCode": "",
									"ExternalCode": "V%O",
									"Text": "Permille volume",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('V01')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('V01')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "V01",
									"ISOCode": "",
									"ExternalCode": "MSC",
									"Text": "Microsiemens per centimeter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('V02')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('V02')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "V02",
									"ISOCode": "",
									"ExternalCode": "MPL",
									"Text": "Millimole per Liter",
									"DecimalPlaces": 3
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('VAL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('VAL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "VAL",
									"ISOCode": "",
									"ExternalCode": "VAL",
									"Text": "Value-Only Material",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('VPB')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('VPB')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "VPB",
									"ISOCode": "",
									"ExternalCode": "VPB",
									"Text": "Volume parts per billion",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('VPM')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('VPM')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "VPM",
									"ISOCode": "",
									"ExternalCode": "VPM",
									"Text": "Volume parts per million",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('VPT')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('VPT')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "VPT",
									"ISOCode": "",
									"ExternalCode": "VPT",
									"Text": "Volume parts per trillion",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('W')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('W')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "W",
									"ISOCode": "WTT",
									"ExternalCode": "W",
									"Text": "Watt",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('WCH')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('WCH')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "WCH",
									"ISOCode": "WEE",
									"ExternalCode": "WK",
									"Text": "Weeks",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('WMK')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('WMK')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "WMK",
									"ISOCode": "D53",
									"ExternalCode": "WMK",
									"Text": "Heat Conductivity",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('WTL')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('WTL')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "WTL",
									"ISOCode": "",
									"ExternalCode": "WKY",
									"Text": "Evaporation Rate",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('YD')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('YD')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "YD",
									"ISOCode": "YRD",
									"ExternalCode": "YD",
									"Text": "Yards",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('YD2')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('YD2')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "YD2",
									"ISOCode": "YDK",
									"ExternalCode": "YD2",
									"Text": "Square Yard",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('YD3')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('YD3')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "YD3",
									"ISOCode": "YDQ",
									"ExternalCode": "YD3",
									"Text": "Cubic yard",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('bbl')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('bbl')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "bbl",
									"ISOCode": "",
									"ExternalCode": "bbl",
									"Text": "British Thermal Unit/US Barrel",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('bft')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('bft')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "bft",
									"ISOCode": "B0",
									"ExternalCode": "bft",
									"Text": "British Thermal Unit/Cubic Ft",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('bgl')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('bgl')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "bgl",
									"ISOCode": "",
									"ExternalCode": "bgl",
									"Text": "British Thermal Unit/US Gallon",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('btl')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('btl')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "btl",
									"ISOCode": "",
									"ExternalCode": "btl",
									"Text": "British Thermal Unit/US Pound",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('gj3')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('gj3')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "gj3",
									"ISOCode": "",
									"ExternalCode": "gj3",
									"Text": "Gigajoule/1000 Cubic Meters",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('gjm')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('gjm')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "gjm",
									"ISOCode": "",
									"ExternalCode": "gjm",
									"Text": "Gigajoule/Cubic Meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('gjt')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('gjt')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "gjt",
									"ISOCode": "",
									"ExternalCode": "gjt",
									"Text": "Gigajoule/US Ton",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('jm3')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('jm3')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "jm3",
									"ISOCode": "",
									"ExternalCode": "jm3",
									"Text": "Joule/Cubic Meter",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('kgb')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('kgb')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "kgb",
									"ISOCode": "",
									"ExternalCode": "kgb",
									"Text": "Kilogram/US Barrel",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('kgj')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('kgj')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "kgj",
									"ISOCode": "",
									"ExternalCode": "kgj",
									"Text": "Kilogram/Joule",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('kgm')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('kgm')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "kgm",
									"ISOCode": "",
									"ExternalCode": "kgm",
									"Text": "Kilogram/Million BTU",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('kgs')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('kgs')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "kgs",
									"ISOCode": "",
									"ExternalCode": "kgs",
									"Text": "Kilogram/Standard Cubic Foot",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('kgt')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('kgt')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "kgt",
									"ISOCode": "",
									"ExternalCode": "kgt",
									"Text": "Kilogram/US Ton",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('kml')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('kml')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "kml",
									"ISOCode": "",
									"ExternalCode": "kml",
									"Text": "Kilogram/Kilogram Mole",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('lbb')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('lbb')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "lbb",
									"ISOCode": "",
									"ExternalCode": "lbb",
									"Text": "US Pound/British Thermal Unit",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('lbg')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('lbg')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "lbg",
									"ISOCode": "GE",
									"ExternalCode": "lbg",
									"Text": "Pound/gallon (US)",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('lbl')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('lbl')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "lbl",
									"ISOCode": "",
									"ExternalCode": "lbl",
									"Text": "US Pound/US Pound Mole",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('lbm')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('lbm')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "lbm",
									"ISOCode": "",
									"ExternalCode": "lbm",
									"Text": "US Pound/Million BTU",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('lbs')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('lbs')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "lbs",
									"ISOCode": "",
									"ExternalCode": "lbs",
									"Text": "US Pound/Standard Cubic Foot",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('lbt')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('lbt')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "lbt",
									"ISOCode": "",
									"ExternalCode": "lbt",
									"Text": "US Pound/US Ton",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('mbb')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('mbb')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "mbb",
									"ISOCode": "",
									"ExternalCode": "mbb",
									"Text": "Million BTU/US Barrel",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('mbt')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('mbt')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "mbt",
									"ISOCode": "",
									"ExternalCode": "mbt",
									"Text": "Million BTU/US Ton",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('tbl')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('tbl')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "tbl",
									"ISOCode": "",
									"ExternalCode": "tbl",
									"Text": "Ton/US Barrel",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('tbt')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('tbt')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "tbt",
									"ISOCode": "",
									"ExternalCode": "tbt",
									"Text": "Ton/British Thermal Unit",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('tgl')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('tgl')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "tgl",
									"ISOCode": "",
									"ExternalCode": "tgl",
									"Text": "US Ton/US Gallon",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('tjl')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('tjl')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "tjl",
									"ISOCode": "",
									"ExternalCode": "tjl",
									"Text": "Ton/Joule",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('tm3')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('tm3')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "tm3",
									"ISOCode": "",
									"ExternalCode": "tm3",
									"Text": "Ton/1000 Cubic Meters",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('tt')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('tt')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "tt",
									"ISOCode": "",
									"ExternalCode": "tt",
									"Text": "Ton/Ton",
									"DecimalPlaces": 0
								},
								{
									"__metadata": {
										"id": "testService.SAP__Units/SAP__UnitsOfMeasure('ttj')",
										"uri": "testService.SAP__Units/SAP__UnitsOfMeasure('ttj')",
										"type": "EmployeesNamespace.SAP__UnitOfMeasure"
									},
									"UnitCode": "ttj",
									"ISOCode": "",
									"ExternalCode": "ttj",
									"Text": "Ton/Terajoule",
									"DecimalPlaces": 0
								}
							]
						}
					};
			});

		});
	});

})();
