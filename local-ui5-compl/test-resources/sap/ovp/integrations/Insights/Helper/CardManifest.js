sap.ui.define(["sap/ovp/insights/IntegrationCard"], function (IntegrationCard) {
  "use strict";

  var oManifests = {
    "card024_Insights": {
      "DT": {
        "sap.card": {
          "extension": "module:sap/insights/CardExtension",
          "type": "List",
          "configuration": {
            "parameters": {
              "DeliveryDate": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"DeliveryDate\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"LASTQUARTER\",\"Text\":\"LASTQUARTER\",\"High\":null}]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"LASTQUARTER\",\"values\":[]}"
              },
              "CreatedDate": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CreatedDate\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "UpdatedDate": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"UpdatedDate\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "CityName": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CityName\",\"Ranges\":[]}]}",
                "type": "string",
                "description": ""
              },
              "CurrencyCode": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CurrencyCode\",\"Ranges\":[]}]}",
                "type": "string",
                "description": ""
              },
              "NetAmount": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"NetAmount\",\"Ranges\":[]}]}",
                "type": "number",
                "description": ""
              },
              "StartDate": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"StartDate\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "EndDate": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"EndDate\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "DeliveryDate1": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"DeliveryDate1\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "CreatedDate1": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CreatedDate1\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "UpdatedDate1": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"UpdatedDate1\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "StartDate1": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"StartDate1\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "EndDate1": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"EndDate1\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "DeliveryDate2": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"DeliveryDate2\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "CreatedDate2": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CreatedDate2\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "UpdatedDate2": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"UpdatedDate2\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": "{\"operator\":\"\",\"values\":[]}"
              },
              "StartDate2": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"StartDate2\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": ""
              },
              "EndDate2": {
                "value": "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"EndDate2\",\"Ranges\":[]}]}",
                "type": "datetime",
                "description": ""
              },
              "_relevantODataFilters": {
                "value": [
                  "DeliveryDate",
                  "CreatedDate",
                  "UpdatedDate",
                  "CityName",
                  "CurrencyCode",
                  "NetAmount",
                  "StartDate",
                  "EndDate",
                  "DeliveryDate1",
                  "CreatedDate1",
                  "UpdatedDate1",
                  "StartDate1",
                  "EndDate1",
                  "DeliveryDate2",
                  "CreatedDate2",
                  "UpdatedDate2",
                  "StartDate2",
                  "EndDate2"
                ]
              },
              "_relevantODataParameters": {
                "value": []
              },
              "_mandatoryODataParameters": {
                "value": []
              },
              "_mandatoryODataFilters": {
                "value": []
              },
              "_contentDataUrl": {
                "value": ""
              },
              "_entitySet": {
                "value": "SalesOrderSet"
              },
              "_urlSuffix": {
                "value": ""
              },
              "_contentSkipQuery": {
                "value": "$skip=0"
              },
              "_contentTopQuery": {
                "value": "$top=13"
              },
              "_contentSortQuery": {
                "value": ""
              },
              "_contentSelectQuery": {
                "value": ""
              },
              "_contentExpandQuery": {
                "value": ""
              },
              "_semanticDateRangeSetting": {
                "value": "{\"DeliveryDate\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"FROM,TO,DAYS,WEEK,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY\",\"exclude\":true},\"CreatedDate\":{\"sap:filter-restriction\":\"interval\"},\"UpdatedDate\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true},\"StartDate\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true},\"EndDate\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true},\"DeliveryDate1\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true},\"CreatedDate1\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true},\"UpdatedDate1\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true},\"StartDate1\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true},\"EndDate1\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true},\"DeliveryDate2\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true},\"CreatedDate2\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true},\"UpdatedDate2\":{\"sap:filter-restriction\":\"interval\",\"selectedValues\":\"DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR\",\"exclude\":true}}"
              },
              "_headerDataUrl": {
                "value": ""
              },
              "headerState": {
                "value": "{\"ibnTarget\":{\"semanticObject\":\"sales\",\"action\":\"overview\"},\"ibnParams\":{},\"sensitiveProps\":[]}"
              },
              "lineItemState": {
                "value": "{\"ibnTarget\":{\"semanticObject\":\"sales\",\"action\":\"overview\"},\"ibnParams\":{},\"sensitiveProps\":[]}"
              }
            },
            "destinations": {
              "service": {
                "name": "(default)",
                "defaultUrl": "/"
              }
            },
            "csrfTokens": {
              "token1": {
                "data": {
                  "request": {
                    "url": "{{destinations.service}}/sap/opu/odata/IWBEP/GWSAMPLE_BASIC",
                    "method": "HEAD",
                    "headers": {
                      "X-CSRF-Token": "Fetch"
                    }
                  }
                }
              }
            }
          },
          "data": {
            "request": {
              "method": "GET",
              "url": "{= extension.formatters.formatContentDataUrlForSemanticDate() }",
              "headers": {
                "Accept": "application/json",
                "Accept-Language": "{{parameters.LOCALE}}",
                "X-CSRF-Token": "{{csrfTokens.token1}}"
              }
            }
          },
          "header": {
            "type": "Default",
            "title": "{{INT_CARD_card024_Insights_header_title_card_Title}}",
            "subTitle": "{{INT_CARD_card024_Insights_header_subTitle_card_subTitle}}",
            "status": {
              "text": "{= ${/d/__count} === '0' ? '' : extension.formatters.formatHeaderCount( ${/d/__count}) }"
            },
            "actions": [
              {
                "type": "Navigation",
                "parameters": "{= extension.formatters.getNavigationContext(${parameters>/headerState/value})}"
              }
            ]
          },
          "content": {
            "data": {
              "path": "/d/results"
            },
            "item": {
              "title": "{/firstDataFieldIndex}",
              "chart": {
                "type": "Bullet",
                "value": null,
                "displayValue": null,
                "color": "None",
                "minValue": "{= extension.formatters.getMinMax('undefined', 'min', $undefined)}",
                "maxValue": "{= extension.formatters.getMinMax('undefined', 'max', $undefined)}"
              },
              "actions": [
                {
                  "type": "Navigation",
                  "parameters": "{= extension.formatters.getNavigationContext(${parameters>/lineItemState/value}, ${})}"
                }
              ]
            }
          }
        },
        "sap.app": {
          "id": "procurement.cards.card024_Insights",
          "type": "card",
          "embeddedBy": "../../",
          "i18n": "../../i18n/i18n.properties",
          "tags": {
            "keywords": [
              "Analytical",
              "Card",
              "Line",
              "Sample"
            ]
          },
          "crossNavigation": {
            "inbounds": {
              "intent": {
                "signature": {
                  "additionalParameters": "allowed",
                  "parameters": {
                    "P_DisplayCurrency": "EUR",
                    "TaxTarifCode": 5,
                    "Land1": " ",
                    "SupplierName": "Robert Brown Entertainment"
                  }
                }
              }
            }
          },
          "dataSources": {
            "salesOrderAnno": {
              "uri": "data/salesorder/annotations.xml",
              "type": "XML"
            },
            "filterService": {
              "uri": "/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/",
              "settings": {
                "annotations": [
                  "salesOrderAnno"
                ],
                "odataVersion": "2.0"
              },
              "type": "ODataAnnotation"
            }
          },
          "title": "{{app_title}}",
          "subTitle": "{{app_description}}"
        },
        "sap.insights": {
          "templateName": "OVP",
          "parentAppId": "procurement",
          "filterEntitySet": "GlobalFilters",
          "cardType": "DT",
          "versions": {
            "ui5": "1.85.2-202303012234"
          }
        },
        "sap.ui5": {
          "_version": "1.1.0",
          "contentDensities": {
            "compact": true,
            "cozy": true
          },
          "dependencies": {
            "libs": {
              "sap.insights": {
                "lazy": false
              }
            }
          }
        }
      }
    }
  };
  return {
    getManifestConfigParams: function (sCardId, sMode) {
      var oManifest = oManifests[sCardId] && oManifests[sCardId][sMode];
      return oManifest && oManifest["sap.card"] && oManifest["sap.card"]["configuration"] && oManifest["sap.card"]["configuration"]["parameters"];
    },
    compareConfigParams: function (oExpectedConfigParams, oConfigParams, sMode) {
      if (oConfigParams && oExpectedConfigParams) {

        if (sMode === "DT") {
          oConfigParams._contentDataUrl.value = ""; // Need to change this value to blank in DT scenario o/w error scenario due to DT delta changes.
        }

        var aKeys = Object.keys(oExpectedConfigParams) || [];

        var aOutKeys = aKeys.filter(function (sKey) {
          var ParamValue = oExpectedConfigParams[sKey].value;
          if (ParamValue && typeof ParamValue === "object") {
            return JSON.stringify(ParamValue) === JSON.stringify(oConfigParams[sKey].value);
          }
          return ParamValue === oConfigParams[sKey].value && oExpectedConfigParams[sKey].description === oConfigParams[sKey].description && oExpectedConfigParams[sKey].type === oConfigParams[sKey].type;
        })

        return aKeys.length === aOutKeys.length;
      }
    }
  };
}, /* bExport= */ true);
