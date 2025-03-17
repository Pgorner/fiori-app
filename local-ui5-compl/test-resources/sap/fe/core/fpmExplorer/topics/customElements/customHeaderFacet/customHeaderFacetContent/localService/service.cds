service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                           : Integer         @title: 'Identifier';
        TitleProperty                : String          @title: 'Title';
        DescriptionProperty          : String          @title: 'Description';
        NameProperty                 : String          @title: 'Some Text';
        NumberProperty               : Decimal(6, 2)   @title: 'Number';
        Currency                     : String          @title: 'Currency';
        BooleanProperty              : Boolean         @title: 'Boolean';
        Progress                     : Decimal(4, 1)   @title: 'Progress';
        IntProperty                  : Integer         @title: 'Number';
        StringProperty               : String          @title: 'Value';
        TextProperty                 : String          @title: 'Text';
        TransactionCurrency          : String(5);
        CustomerCreditForecast       : Decimal(23, 2)  @title: 'Forecast'         @(Measures.ISOCurrency: TransactionCurrency);
        CustomerCreditExposureAmount : Decimal(23, 2)  @title: 'Exposure Amount'  @(Measures.ISOCurrency: TransactionCurrency);
        CustomerCreditLimitAmount    : Decimal(23, 2)  @title: 'Limit Amount'     @(Measures.ISOCurrency: TransactionCurrency);
        Criticality                  : Integer;
  }

  annotate RootEntity with
  @(UI: {
    HeaderInfo                             : {
      TypeName      : 'Root Entity',
      TypeNamePlural: 'Root Entities',
      TypeImageUrl  : 'sap-icon://alert',
      Title         : {
        $Type: 'UI.DataField',
        Value: TitleProperty
      }
    },
    HeaderFacets                           : [{
      $Type : 'UI.ReferenceFacet',
      ID    : 'HeaderFacetIdentifier1',
      Target: '@UI.FieldGroup#HeaderGeneralInformation'
    }],
    FieldGroup #HeaderGeneralInformation   : {Data: [
      {
        $Type: 'UI.DataField',
        Value: NameProperty
      },
      {
        $Type: 'UI.DataField',
        Value: DescriptionProperty
      }
    ]},
    Chart #MicroChart                      : {
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
      Title        : 'Exposure Amount',
      Value        : CustomerCreditExposureAmount,
      Description  : 'Bullet Micro Chart',
      TargetValue  : CustomerCreditLimitAmount,
      ForecastValue: CustomerCreditForecast,
      MaximumValue : 7000,
      MinimumValue : 200,
      Criticality  : Criticality,
    }
  });
}
