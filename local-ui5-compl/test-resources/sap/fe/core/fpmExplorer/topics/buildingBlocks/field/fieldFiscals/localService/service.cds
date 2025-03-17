service Service {

  // @readonly
  @odata.draft.enabled
  entity RootEntity {
    key ID                : Integer    @title: 'Identifier';
        companyCode       : String     @title: 'Company Code';
        fiscalYear        : String     @title: 'Fiscal Year'          @Common.IsFiscalYear       : true  @Common.Text           : '@Common.Text';
        fiscalPeriod      : String     @title: 'Fiscal Period'        @Common.IsFiscalPeriod     : true;
        fiscalYearPeriod  : String     @title: 'Fiscal Year Period'   @Common.IsFiscalYearPeriod : true;
        fiscalQuarter     : String(1)  @title: 'Fiscal Quarter'       @Common.IsFiscalQuarter    : true  @Common.IsDigitSequence: true;
        fiscalYearQuarter : String(5)  @title: 'Fiscal Year Quarter'  @Common.IsFiscalYearQuarter: true  @Common.IsDigitSequence: true;
        fiscalWeek        : String     @title: 'Fiscal Week'          @Common.IsFiscalWeek       : true;
        fiscalWeekYear    : String     @title: 'Fiscal Week Year'     @Common.IsFiscalYearWeek   : true;
        fiscalDayOfYear   : String     @title: 'Fiscal Day Of Year'   @Common.IsDayOfFiscalYear  : true;
  }

  annotate RootEntity with @(UI.HeaderInfo: {
    TypeName      : '{@i18n>RootEntity.TypeName}',
    TypeNamePlural: '{@i18n>RootEntity.TypeNamePlural}',
    TypeImageUrl  : 'sap-icon://product',
  });

  annotate RootEntity with @(UI.SelectionFields: [
    companyCode,
    fiscalYear,
    fiscalPeriod,
    fiscalYearPeriod,
    fiscalQuarter,
    fiscalYearQuarter,
    fiscalWeek,
    fiscalWeekYear,
    fiscalDayOfYear
  ]);

  annotate RootEntity with @(UI: {
    PresentationVariant: {
      $Type         : 'UI.PresentationVariantType',
      Visualizations: ['@UI.LineItem']
    },
    LineItem           : [
      {
        $Type            : 'UI.DataField',
        Value            : companyCode,
        ![@UI.Importance]: #High,
      },
      {
        $Type            : 'UI.DataField',
        Value            : fiscalYear,
        ![@UI.Importance]: #High,
      },
      {
        $Type            : 'UI.DataField',
        Value            : fiscalPeriod,
        ![@UI.Importance]: #High,
      },
      {
        $Type            : 'UI.DataField',
        Value            : fiscalYearPeriod,
        ![@UI.Importance]: #High,
      },
      {
        $Type            : 'UI.DataField',
        Value            : fiscalQuarter,
        ![@UI.Importance]: #High,
      },
      {
        $Type            : 'UI.DataField',
        Value            : fiscalYearQuarter,
        ![@UI.Importance]: #High,
      },
      {
        $Type            : 'UI.DataField',
        Value            : fiscalWeek,
        ![@UI.Importance]: #High,
      },
      {
        $Type            : 'UI.DataField',
        Value            : fiscalWeekYear,
        ![@UI.Importance]: #High,
      },
      {
        $Type            : 'UI.DataField',
        Value            : fiscalDayOfYear,
        ![@UI.Importance]: #High,
      },
    ]
  });

  annotate RootEntity with @(
    UI.FieldGroup #HeaderMain   : {Data: [{
      $Type: 'UI.DataField',
      Value: companyCode,
    }, ]},
    UI.FieldGroup #General      : {Data: [
      {
        $Type: 'UI.DataField',
        Value: fiscalYear,
      },
      {
        $Type: 'UI.DataField',
        Value: fiscalDayOfYear,
      },
    ]},
    UI.FieldGroup #FiscalPeriod : {Data: [
      {
        $Type: 'UI.DataField',
        Value: fiscalYear,
      },
      {
        $Type: 'UI.DataField',
        Value: fiscalPeriod,
      },
      {
        $Type: 'UI.DataField',
        Value: fiscalYearPeriod,
      },
    ]},
    UI.FieldGroup #FiscalQuarter: {Data: [
      {
        $Type: 'UI.DataField',
        Value: fiscalYear,
      },
      {
        $Type: 'UI.DataField',
        Value: fiscalQuarter,
      },
      {
        $Type: 'UI.DataField',
        Value: fiscalYearQuarter,
      },
    ]},
    UI.FieldGroup #FiscalWeek   : {Data: [
      {
        $Type: 'UI.DataField',
        Value: fiscalYear,
      },
      {
        $Type: 'UI.DataField',
        Value: fiscalWeek,
      },
      {
        $Type: 'UI.DataField',
        Value: fiscalWeekYear,
      },
    ]},
  );

  annotate RootEntity with @(UI.HeaderFacets: [{
    $Type : 'UI.ReferenceFacet',
    Target: '@UI.FieldGroup#HeaderMain',
  }, ]);


  annotate RootEntity with @(UI.Facets: [
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'General',
      Target: '@UI.FieldGroup#General',
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'Period',
      Target: '@UI.FieldGroup#FiscalPeriod',
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'Quarter',
      Target: '@UI.FieldGroup#FiscalQuarter',
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'Week',
      Target: '@UI.FieldGroup#FiscalWeek',
    },
  ]);

}
