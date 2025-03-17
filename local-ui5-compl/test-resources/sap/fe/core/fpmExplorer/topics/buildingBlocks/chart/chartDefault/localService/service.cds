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
        items                      : Association to many ChildEntity
                                       on items.Parent = $self;
  }

  @Analytics.AggregatedProperty #min: {
    Name                : 'minPricing',
    AggregationMethod   : 'min',
    AggregatableProperty: 'ChildPrice',
    ![@Common.Label]    : 'Minimum child Price'
  }
  @Analytics.AggregatedProperty #max: {
    Name                : 'maxPricing',
    AggregationMethod   : 'max',
    AggregatableProperty: 'ChildPrice',
    ![@Common.Label]    : 'Maximum Child Price'
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
      CommentedBy,
      UpdatedBy,
      Status
    ],
    AggregatableProperties  : [{Property: ChildPrice}]
  }
  entity ChildEntity {
    key ID                 : Integer                   @title: 'Identifier';
        ChildPrice         : Decimal(15, 10);
        Status             : String(4)                 @(
          title      : 'Status',
          Common.Text: CommentedBy
        );
        SalesOrderTypeText : String;
        CommentedBy        : String                    @title: 'Commented by';
        UpdatedBy          : String                    @title: 'Updated by';
        Parent             : Association to RootEntity @UI.Hidden;
  }

  annotate ChildEntity with @UI.Chart: {
    $Type              : 'UI.ChartDefinitionType',
    Title              : 'Chart Title',
    Description        : 'Chart Description',
    ChartType          : #Column,
    DynamicMeasures    : ['@Analytics.AggregatedProperty#min'],
    Dimensions         : [Status],
    MeasureAttributes  : [{
      $Type         : 'UI.ChartMeasureAttributeType',
      DynamicMeasure: '@Analytics.AggregatedProperty#min',
      Role          : #Axis1
    }],
    DimensionAttributes: [{
      $Type    : 'UI.ChartDimensionAttributeType',
      Dimension: Status,
      Role     : #Category
    }]
  };

  annotate RootEntity with @UI.Chart: {
    $Type              : 'UI.ChartDefinitionType',
    Title              : 'Chart Title',
    Description        : 'Chart Description',
    ChartType          : #Column,
    DynamicMeasures    : ['@Analytics.AggregatedProperty#sum'],
    Dimensions         : [SalesOrganization],
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
