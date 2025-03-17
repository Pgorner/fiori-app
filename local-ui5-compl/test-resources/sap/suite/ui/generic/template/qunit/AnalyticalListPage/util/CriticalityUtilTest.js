sap.ui.define(
	[ "sap/suite/ui/generic/template/AnalyticalListPage/util/CriticalityUtil",
	  "sap/ui/model/json/JSONModel", "sap/suite/ui/generic/template/genericUtilities/AjaxHelper"],
	function(CriticalityUtil, JSONModel, AjaxHelper) {
		"use strict";

		QUnit.module("CriticalityUtil");

		QUnit.test("Calculate Criticality", function( assert ) {
			//Constructor for Mocking oDataPoint object for Test Cases
			function oDataPoint(iDEnumMember,dLow,dHigh,tLow,tHigh,criticality){
				//Only when criticality is defined
				if (criticality) {
					function Criticality() {
						this.EnumMember = criticality;
					}
					this.Criticality = new Criticality();
				}
				function CriticalityCalculation(){

					function ImprovementDirection(){
						this.EnumMember=iDEnumMember;
					}
					function DeviationRangeLowValue(){
						this.Int=dLow;
					}
					function DeviationRangeHighValue(){
						this.Int=dHigh;
					}
					function ToleranceRangeLowValue(){
						this.Int=tLow;
					}
					function ToleranceRangeHighValue(){
						this.Int=tHigh;
					}
					this.DeviationRangeLowValue=new DeviationRangeLowValue();
					this.DeviationRangeHighValue=new DeviationRangeHighValue();
					this.ToleranceRangeLowValue=new ToleranceRangeLowValue();
					this.ToleranceRangeHighValue=new ToleranceRangeHighValue();
					this.ImprovementDirection=new ImprovementDirection();
				}
				this.CriticalityCalculation=new CriticalityCalculation();
			}
			function dataResults(data) {
				this.results = [];
				function results (data) {
					this.ActualCosts = data;
				}
				this.results.push(new results(data));
			}

			// function for retriving state from KpiTag.js
			function calculateCriticalityState(myODataPoint, data){
				var dataReturned = CriticalityUtil.CalculateCriticality(myODataPoint, data, "ActualCosts");
				return dataReturned.results[0].color;
			}

			//1.Negative
			assert.equal(calculateCriticalityState(new oDataPoint("/Maximize",5000000000000,undefined,undefined,undefined), new dataResults(161700)),"Error");
			//2.Critical
			assert.equal(calculateCriticalityState(new oDataPoint("/Maximize",50,undefined,50000000000,undefined), new dataResults(161700)),"Critical");
			//3.Positive
			assert.equal(calculateCriticalityState(new oDataPoint("/Maximize",50,undefined,50,undefined), new dataResults(161700)),"Good");
			//4.Positive
			assert.equal(calculateCriticalityState(new oDataPoint("/Maximize",50,undefined,undefined,undefined), new dataResults(161700)),"Good");
			//5.Default
			assert.equal(calculateCriticalityState(new oDataPoint("/Maximize",undefined,undefined,undefined,undefined), new dataResults(161700)),undefined);
			// Minimizing Test Cases
			//6.Positive
			assert.equal(calculateCriticalityState(new oDataPoint("/Minimize",undefined,undefined,undefined,5000000000000), new dataResults(161700)),"Good");
			//7.Critical
			assert.equal(calculateCriticalityState(new oDataPoint("/Minimize",undefined,50000000000000,undefined,50), new dataResults(161700)),"Critical");
			//8.Negative
			assert.equal(calculateCriticalityState(new oDataPoint("/Minimize",undefined,50,undefined,50), new dataResults(161700)),"Error");
			//9.Critical
			assert.equal(calculateCriticalityState(new oDataPoint("/Minimize",undefined,undefined,undefined,50), new dataResults(161700)),"Critical");
			//10.Positive
			assert.equal(calculateCriticalityState(new oDataPoint("/Minimize",undefined,50000000000000,undefined,undefined), new dataResults(161700)),"Good");
			//11.Default
			assert.equal(calculateCriticalityState(new oDataPoint("/Minimize",undefined,undefined,undefined,undefined), new dataResults(161700)),undefined);
			//Target Test Cases
			//12.Negative
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",5000000000000,50,50,50), new dataResults(161700)),"Error");
			//13.Critical
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,undefined,50000000000000,50), new dataResults(161700)),"Critical");
			//14.Positive
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,50,50,50000000000000), new dataResults(161700)),"Good");
			//15.Critical
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,500000000000000,50,50), new dataResults(161700)),"Critical");
			//16.Negative
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,50,50000000000000,50000000000000), new dataResults(161700)),"Error");
			//17.Critical check with sandeep
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",undefined,undefined,5000000000000000,50), new dataResults(161700)),"Critical");
			//18.Critical
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,undefined,50,50), new dataResults(161700)),"Critical");
			//19.Critical
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,500000000000000,undefined,50), new dataResults(161700)),"Critical");
			//20.Positive
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,500000000000000,50,undefined), new dataResults(161700)),"Good");
			//21. When improvement direction is undefined
			assert.equal(calculateCriticalityState(new oDataPoint(undefined,50,500000000000000,50,undefined), new dataResults(161700)),undefined);
			//22. When Criticality is defined and has value Positive
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,500000000000000,50,undefined,"com.sap.vocabularies.UI.v1.CriticalityType/Positive"), new dataResults(161700)),"Good");
			//23. When Criticality is defined and has value Negative
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,500000000000000,50,undefined,"com.sap.vocabularies.UI.v1.CriticalityType/Negative"), new dataResults(161700)),"Error");
			//24. When Criticality is defined and has value Critical
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,500000000000000,50,undefined,"com.sap.vocabularies.UI.v1.CriticalityType/Critical"), new dataResults(161700)),"Critical");
			//25. When Criticality is defined and has value Neutral
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,500000000000000,50,undefined,"com.sap.vocabularies.UI.v1.CriticalityType/Neutral"), new dataResults(161700)),"Neutral");
			//26. When Criticality is defined and has no value/Value incorrect
			assert.equal(calculateCriticalityState(new oDataPoint("/Target",50,500000000000000,50,undefined,""), new dataResults(161700)),"Good");
			//27. When No Criticality  defined and only Criticality state is defined 
			assert.equal(calculateCriticalityState(new oDataPoint(undefined,undefined,undefined,undefined,undefined,"com.sap.vocabularies.UI.v1.CriticalityType/Neutral"),  new dataResults(161700)),"Neutral");
			//28. When No Criticality or Criticality state is defined
			assert.equal(calculateCriticalityState(new oDataPoint(undefined,undefined,undefined,undefined,undefined,undefined), new dataResults(161700)),undefined);


		});

		QUnit.test("Calculate Dimension Criticality", function( assert ) {
			var sMetaModelUrl = "test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/util/testdata/MetaModel.json",
			oMetaModel = AjaxHelper.syncGetJSON(sMetaModelUrl).data,
			oMetaJSONModel = new sap.ui.model.json.JSONModel(oMetaModel);
			var data = {};
			data.results = [{"CostCenter": "200-3000"}, {"CostCenter": "100-1100"}, {"CostCenter": "200-5000"}, {"CostCenter": "200-1100"}, {"CostCenter": "300-1200"}];
			var oMetaModel = {
				getODataEntitySet: function() {
					return {
						entityType: "ZCOSTCENTERCOSTSQUERY0021"
					};
				},
				getODataEntityType: function() {
					return oMetaJSONModel.getObject("/dataServices/schema/0/entityType/1");
				},
				getODataProperty: function() {
					return oMetaJSONModel.getObject("/dataServices/schema/0/entityType/1/property/2");
				}
			};
			var oGetMetaModelStub = sinon.stub(oMetaJSONModel, "getMetaModel").returns(oMetaModel);
			var retData = CriticalityUtil.CalculateDimensionCriticality(oMetaJSONModel, "CostCenter", "ZCOSTCENTERCOSTSQUERY0021", data);
			// 1. Positive
			assert.equal(retData.results[0].color, "Good");
			// 2. Negative
			assert.equal(retData.results[1].color, "Error");
			// 3. When criticality is not defined for a dimension value
			assert.equal(retData.results[2].color, undefined);
			// 4. Critical
			assert.equal(retData.results[3].color, "Critical");
			// 5. Neutral
			assert.equal(retData.results[4].color, "Neutral");
		});
	}
);
