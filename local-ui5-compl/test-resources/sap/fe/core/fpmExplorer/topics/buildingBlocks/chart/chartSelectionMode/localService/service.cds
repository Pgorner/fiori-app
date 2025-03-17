service Service {
  @Analytics.AggregatedProperty #min: {
    Name                : 'minPricing',
    AggregationMethod   : 'min',
    AggregatableProperty: 'NetPricing',
    ![@Common.Label]    : 'Minimum Net Amount'
  }
  @Analytics.AggregatedProperty #max: {
    Name                : 'maxPricing',
    AggregationMethod   : 'max',
    AggregatableProperty: 'NetPricing',
    ![@Common.Label]    : 'Maximum Net Amount'
  }
  @Analytics.AggregatedProperty #avg: {
    Name                : 'avgPricing',
    AggregationMethod   : 'average',
    AggregatableProperty: 'NetPricing',
    ![@Common.Label]    : 'Average Net Amount'
  }
  @Analytics.AggregatedProperty #sum: {
    Name                : 'totalPricing',
    AggregationMethod   : 'sum',
    AggregatableProperty: 'NetPricing',
    ![@Common.Label]    : 'Total Net Amount'
  }

  @Aggregation.ApplySupported       : {
    Transformations         : [
      'aggregate',
      'topcount',
      'bottomcount',
      'identity',
      'concat',
      'groupby',
      'filter',
      'expand',
      'top',
      'skip',
      'orderby',
      'search'
    ],
    CustomAggregationMethods: ['Custom.concat'],
    Rollup                  : #None,
    PropertyRestrictions    : true,
    GroupableProperties     : [
      SalesOrderType,
      SalesOrder,
      SalesOrganization,
      OverallSDProcessStatus
    ],
    AggregatableProperties  : [{Property: NetPricing}]
  }
  entity RootEntity {
    key SalesOrder                 : String(10) @title: 'Sales Order No.';
        NetPricing                 : Decimal(15, 10);

        OverallSDProcessStatus     : String(1)  @(
          title              : 'Overall Process Status',
          Common.Text        : OverallSDProcessStatusText,
          UI.ValueCriticality: [
            {
              Value      : 'A',
              Criticality: #Negative
            },
            {
              Value      : 'B',
              Criticality: #Critical
            },
            {
              Value      : 'C',
              Criticality: #Positive
            }
          ]
        );
        OverallSDProcessStatusText : String;

        SalesOrderType             : String(4)  @(
          title      : 'Sales Order Type',
          Common.Text: SalesOrderTypeText
        );
        SalesOrderTypeText         : String;

        SalesOrganization          : String(4)  @(
          title      : 'Sales Organization',
          Common.Text: SalesOrganizationText
        );
        SalesOrganizationText      : String;
  }

  annotate RootEntity with @UI.Chart: {
    $Type              : 'UI.ChartDefinitionType',
    Title              : 'Chart Title',
    Description        : 'Chart Description',
    ChartType          : #Column,
    DynamicMeasures    : ['@Analytics.AggregatedProperty#sum'],
    Dimensions         : [SalesOrderType],
    MeasureAttributes  : [{
      $Type         : 'UI.ChartMeasureAttributeType',
      DynamicMeasure: '@Analytics.AggregatedProperty#sum',
      Role          : #Axis1
    }],
    DimensionAttributes: [{
      $Type    : 'UI.ChartDimensionAttributeType',
      Dimension: SalesOrganization,
      Role     : #Category
    }]
  };
}
