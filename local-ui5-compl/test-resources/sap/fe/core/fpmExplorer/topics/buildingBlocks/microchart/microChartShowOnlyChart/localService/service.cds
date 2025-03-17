service Service {
  entity RootEntity {
    key ID                  : String(2);
        SalesOrder          : String(10) not null @(
          title: 'Sales Order No.',
          Core.Computed
        );
        _Item               : Composition of many ChildEntity
                                on _Item.Parent = $self;
        _CreditLimitDetails : Association to CreditLimitDetails
                                on _CreditLimitDetails.SalesDocument = SalesOrder;
  }

  entity ChildEntity {
    key ID                   : String(2)           @(
          title        : 'Sales Order Item UUID',
          PersonalData : {IsPotentiallySensitive: true},
          Core.Computed: true
        );
        NetAmount            : Decimal(15, 2)      @(
          Analytics           : {Measure: true},
          Measures.ISOCurrency: TransactionCurrency,
          Core.Immutable      : true
        );
        SalesOrder           : String(10) not null @(
          title: 'Sales Order No.',
          Core.Computed
        );
        SalesOrderItem       : String(1) not null  @(
          title: 'Item',
          Core.Computed
        );
        SalesOrderItemNumber : Integer;
        TransactionCurrency  : String(5);
        NetAmount_text       : String(10);
        TargetAmount         : Decimal(15, 2)      @(
          UI                  : {ExcludeFromNavigationContext: true},
          Measures.ISOCurrency: TransactionCurrency,
          Core.Immutable      : true,
          Common              : {Label: 'Target Value'}
        );
        Criticality          : Integer;
        ToleranceRangeLow    : Decimal(23, 0);
        ToleranceRangeHigh   : Decimal(23, 0);
        DeviationRangeLow    : Decimal(23, 0);
        DeviationRangeHigh   : Decimal(23, 0);
        AcceptanceRangeLow   : Decimal(23, 0);
        AcceptanceRangeHigh  : Decimal(23, 0);
        Parent               : Association to RootEntity;
  }

  annotate ChildEntity with @(UI: {
    Chart #ColumnMaxPath            : {
      $Type            : 'UI.ChartDefinitionType',
      Title            : 'Items Column Chart',
      Description      : 'Testing Column Chart',
      ChartType        : #Column,
      Measures         : [NetAmount],
      Dimensions       : [SalesOrderItem],
      MeasureAttributes: [{
        $Type    : 'UI.ChartMeasureAttributeType',
        Measure  : NetAmount,
        Role     : #Axis1,
        DataPoint: '@UI.DataPoint#ColumnMaxPath'
      }]
    },
    DataPoint #ColumnMaxPath        : {
      Value                 : NetAmount,
      Title                 : 'Data',
      Description           : 'Column Micro Chart',
      Criticality           : Criticality,
      CriticalityCalculation: {
        ImprovementDirection    : #Maximize,
        DeviationRangeLowValue  : DeviationRangeLow,
        ToleranceRangeLowValue  : ToleranceRangeLow,
        AcceptanceRangeLowValue : AcceptanceRangeLow,
        AcceptanceRangeHighValue: AcceptanceRangeHigh,
        ToleranceRangeHighValue : ToleranceRangeHigh,
        DeviationRangeHighValue : DeviationRangeHigh
      }
    },
    Chart #AreaMaxPath              : {
      $Type            : 'UI.ChartDefinitionType',
      Title            : 'Items Area Chart',
      Description      : 'SalesID = 10 and SalesID = 50',
      ChartType        : #Area,
      Measures         : [NetAmount],
      Dimensions       : [SalesOrderItemNumber],
      MeasureAttributes: [{
        $Type    : 'UI.ChartMeasureAttributeType',
        Measure  : NetAmount,
        Role     : #Axis1,
        DataPoint: '@UI.DataPoint#AreaMaxPath'
      }]
    },
    DataPoint #AreaMaxPath          : {
      Value                 : NetAmount,
      Title                 : 'Data',
      Description           : 'Area Micro Chart',
      TargetValue           : TargetAmount,
      CriticalityCalculation: {
        ImprovementDirection    : #Target,
        DeviationRangeLowValue  : DeviationRangeLow,
        ToleranceRangeLowValue  : ToleranceRangeLow,
        AcceptanceRangeLowValue : AcceptanceRangeLow,
        AcceptanceRangeHighValue: AcceptanceRangeHigh,
        ToleranceRangeHighValue : ToleranceRangeHigh,
        DeviationRangeHighValue : DeviationRangeHigh
      }
    },
    Chart #LineMaxPath              : {
      $Type            : 'UI.ChartDefinitionType',
      Title            : 'Items Line Chart',
      Description      : 'SalesID = 0 and SalesID = 70',
      ChartType        : #Line,
      Measures         : [
        NetAmount,
        TargetAmount
      ],
      Dimensions       : [SalesOrderItemNumber],
      MeasureAttributes: [
        {
          $Type    : 'UI.ChartMeasureAttributeType',
          Measure  : NetAmount,
          Role     : #Axis1,
          DataPoint: '@UI.DataPoint#LineValueCriticality'
        },
        {
          $Type    : 'UI.ChartMeasureAttributeType',
          Measure  : TargetAmount,
          Role     : #Axis1,
          DataPoint: '@UI.DataPoint#LineTargetCriticality'
        }
      ]
    },
    DataPoint #LineValueCriticality : {
      Value      : NetAmount,
      Title      : 'Net Amount',
      Description: 'Net Amount Line',
      Criticality: #Positive
    },
    DataPoint #LineTargetCriticality: {
      Value      : TargetAmount,
      Title      : 'Target Amount',
      Description: 'Target Amount Line',
      Criticality: #Neutral
    },
    Chart #BarStackedPath           : {
      $Type            : 'UI.ChartDefinitionType',
      Title            : 'Items Stacked Bar Chart',
      Description      : 'Testing Stacked Bar Chart',
      ChartType        : #BarStacked,
      Measures         : [NetAmount],
      MeasureAttributes: [{
        $Type    : 'UI.ChartMeasureAttributeType',
        Measure  : NetAmount,
        Role     : #Axis1,
        DataPoint: '@UI.DataPoint#BarStackedPath'
      }]
    },
    DataPoint #BarStackedPath       : {
      Value      : NetAmount,
      Title      : 'Net Amount',
      Criticality: Criticality,
    },
    Chart #RadialChart              : {
      $Type            : 'UI.ChartDefinitionType',
      Title            : 'MicroChart',
      ChartType        : #Bullet,
      Measures         : [NetAmount],
      Dimensions       : [SalesOrderItem],
      MeasureAttributes: [{
        $Type    : 'UI.ChartMeasureAttributeType',
        Measure  : NetAmount,
        Role     : #Axis1,
        DataPoint: '@UI.DataPoint#RadialPath'
      }]
    },
    DataPoint #RadialPath           : {
      Value      : NetAmount,
      Title      : 'Net Amount',
      Criticality: Criticality,
    },
    Chart #ComparisonPath           : {
      $Type            : 'UI.ChartDefinitionType',
      Title            : 'Items Comparison Chart',
      Description      : 'Testing Comparison Chart',
      ChartType        : #Bar,
      Measures         : [NetAmount],
      Dimensions       : [SalesOrderItem],
      MeasureAttributes: [{
        $Type    : 'UI.ChartMeasureAttributeType',
        Measure  : NetAmount,
        Role     : #Axis1,
        DataPoint: '@UI.DataPoint#ComparisonPath'
      }]
    },
    DataPoint #ComparisonPath       : {
      Value      : NetAmount,
      Title      : 'Net Amount',
      Criticality: Criticality,
    }
  });

  entity CreditLimitDetails                                 @(title: 'Bullet Chart') {
    key SalesDocument                      : String(10);
        CustomerCreditExposureAmount       : Decimal(23, 2) @(Measures.ISOCurrency: TransactionCurrency, );
        Delivered                          : Boolean        @(title: 'Delivery Status');
        CustomerCreditExposureAmountHidden : Decimal(23, 2) @(
          Measures.ISOCurrency: TransactionCurrency,
          UI.Hidden           : Delivered
        );
        CustomerCreditForecast             : Decimal(23, 2) @(Measures.ISOCurrency: TransactionCurrency, );
        CustomerCreditExposureAmount_text  : String(15);
        CustomerCreditLimitAmount          : Decimal(23, 2) @(Measures.ISOCurrency: TransactionCurrency, );
        MaximumCreditValue                 : Decimal(23, 2);
        CustomerCreditLimitAmount_text     : String(15);
        TransactionCurrency                : String(5);
        CustomerIsAboveThreshold           : Integer;
        ToleranceRangeLow                  : Decimal(23, 2);
        ToleranceRangeHigh                 : Decimal(23, 2);
        DeviationRangeLow                  : Decimal(23, 2);
        DeviationRangeHigh                 : Decimal(23, 2);
        AcceptanceRangeLow                 : Decimal(23, 2);
        AcceptanceRangeHigh                : Decimal(23, 2);
  }

  annotate CreditLimitDetails with @(UI: {
    Chart #CreditLimitChart                : {
      $Type            : 'UI.ChartDefinitionType',
      Title            : 'Credit Limit Bullet',
      Description      : 'Bullet MicroChart',
      ChartType        : #Bullet,
      Measures         : [CustomerCreditExposureAmount],
      MeasureAttributes: [{
        $Type    : 'UI.ChartMeasureAttributeType',
        Measure  : CustomerCreditExposureAmount,
        Role     : #Axis1,
        DataPoint: '@UI.DataPoint#CustomerCreditExposureAmount'
      }]
    },
    DataPoint #CustomerCreditExposureAmount: {
      Value                 : CustomerCreditExposureAmount,
      Title                 : 'Exposure Amount',
      Description           : 'Bullet Micro Chart',
      TargetValue           : CustomerCreditLimitAmount,
      ForecastValue         : CustomerCreditForecast,
      MaximumValue          : 7000,
      MinimumValue          : 200,
      Criticality           : CustomerIsAboveThreshold,
      CriticalityCalculation: {
        ImprovementDirection    : #Maximize,
        DeviationRangeLowValue  : DeviationRangeLow,
        ToleranceRangeLowValue  : ToleranceRangeLow,
        AcceptanceRangeLowValue : AcceptanceRangeLow,
        AcceptanceRangeHighValue: AcceptanceRangeHigh,
        ToleranceRangeHighValue : ToleranceRangeHigh,
        DeviationRangeHighValue : DeviationRangeHigh
      }
    },
    Chart #HarveyBallCriticalityPath       : {
      $Type            : 'UI.ChartDefinitionType',
      Title            : 'Credit Limit HarveyBall',
      Description      : 'HarveyBall MicroChart',
      ChartType        : #Pie,
      Measures         : [CustomerCreditExposureAmount],
      MeasureAttributes: [{
        $Type    : 'UI.ChartMeasureAttributeType',
        Measure  : CustomerCreditExposureAmount,
        Role     : #Axis1,
        DataPoint: '@UI.DataPoint#HarveyBallValuePath'
      }]
    },
    DataPoint #HarveyBallValuePath         : {
      Value       : CustomerCreditExposureAmount,
      MaximumValue: CustomerCreditLimitAmount,
      Criticality : CustomerIsAboveThreshold
    },
    Chart #RadialCriticalityPath           : {
      $Type            : 'UI.ChartDefinitionType',
      Title            : 'Credit Limit Radial',
      Description      : 'RadialMicroChart',
      ChartType        : #Donut,
      Measures         : [CustomerCreditExposureAmount],
      MeasureAttributes: [{
        $Type    : 'UI.ChartMeasureAttributeType',
        Measure  : CustomerCreditExposureAmount,
        Role     : #Axis1,
        DataPoint: '@UI.DataPoint#RadialValuePath'
      }]
    },
    DataPoint #RadialValuePath             : {
      Value      : CustomerCreditExposureAmount,
      TargetValue: CustomerCreditLimitAmount,
      Criticality: CustomerIsAboveThreshold
    }
  });
}
