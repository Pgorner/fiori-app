service Service {
  @Aggregation.ApplySupported    : {
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
  @Analytics.AggregatedProperties: [
    {
      Name                : 'minPricing',
      AggregationMethod   : 'min',
      AggregatableProperty: 'NetPricing',
      ![@Common.Label]    : 'Minimal Net Amount'
    },
    {
      Name                : 'maxPricing',
      AggregationMethod   : 'max',
      AggregatableProperty: 'NetPricing',
      ![@Common.Label]    : 'Maximal Net Amount'
    },
    {
      Name                : 'avgPricing',
      AggregationMethod   : 'average',
      AggregatableProperty: 'NetPricing',
      ![@Common.Label]    : 'Average Net Amount'
    },
    {
      Name                : 'totalPricing',
      AggregationMethod   : 'sum',
      AggregatableProperty: 'NetPricing',
      ![@Common.Label]    : 'Total Net Amount'
    }
  ]
  entity RootEntity {
    key ID                         : String(2);
        SalesOrder                 : String(10) not null @(
          title: 'Sales Order No.',
          Core.Computed
        );
        NetPricing                 : Decimal(15, 10);
        OverallSDProcessStatus     : String(1)           @(
          title                    : 'Overall Process Status',
          Common.Text              : OverallSDProcessStatusText,
          Common.FilterDefaultValue: 'A',
          Common.ValueList         : {
            Label                  : 'Status',
            CollectionPath         : 'Status',
            DistinctValuesSupported: true,
            Parameters             : [{
              $Type            : 'Common.ValueListParameterOut',
              ValueListProperty: 'status',
              LocalDataProperty: 'OverallSDProcessStatus'
            }]
          },
          UI.ValueCriticality      : [
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
        OverallSDProcessStatusText : String(20);
        SalesOrderType             : String(4)           @(
          title      : 'Sales Order Type',
          Common.Text: SalesOrderType_Text
        );
        SalesOrderType_Text        : String(20);
        SalesOrganization          : String(4)           @(
          title      : 'Sales Organization',
          Common.Text: SalesOrganization_Text
        );
        SalesOrganization_Text     : String(20);
  }

  entity Status {
    key status : String(2);
  }

  annotate RootEntity with @(
    UI.SelectionFields #SF1: [OverallSDProcessStatus],
    UI.Chart               : {
      $Type              : 'UI.ChartDefinitionType',
      Title              : 'Chart Title',
      Description        : 'Chart Description',
      ChartType          : #Column,
      Measures           : [totalPricing],
      Dimensions         : [SalesOrganization],
      MeasureAttributes  : [{
        $Type  : 'UI.ChartMeasureAttributeType',
        Measure: totalPricing,
        Role   : #Axis1
      }],
      DimensionAttributes: [{
        $Type    : 'UI.ChartDimensionAttributeType',
        Dimension: SalesOrganization,
        Role     : #Category
      }]
    }
  );
}
