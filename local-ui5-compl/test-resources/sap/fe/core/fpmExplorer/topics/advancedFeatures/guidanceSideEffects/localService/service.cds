using {
  cuid,
  managed,
  Currency
} from '@sap/cds/common';

namespace sap.fe.core;

type Amount      : Decimal(9, 2) @(Validation: {Minimum: 0});

type complexType : {
  number : Integer  @Core.Computed  @title: 'Current Number';
  prime  : Boolean  @Core.Computed  @title: 'Prime Number?'
};

@odata.draft.enabled
entity RootEntity {
  key ID                    : Integer  @Core.Computed                 @title               : 'Identifier';
      sourceProperty1       : String   @title: 'Source Property 1';
      sourceProperty2       : String   @title: 'Source Property 2';
      sourceProperty3a      : String   @title: 'Source Property 3a';
      sourceProperty3b      : String   @title: 'Source Property 3b';
      otherProperty3c       : String   @title: 'Other Property 3c';
      sourceProperty4       : Boolean  @title: 'Boolean Source Property';
      targetProperty1a      : String   @title: 'Target Property 1a'   @readonly;
      targetProperty1b      : String   @title: 'Target Property 1b';
      targetProperty2       : String   @title: 'Target Property 2'    @readonly;
      targetProperty3       : String   @title: 'Target Property 3'    @readonly;
      targetProperty4       : String   @title: 'Target Property 4';
      complexProperty       : complexType;
      totalAmount           : Amount   @title: 'Total Amount'         @Measures.ISOCurrency: currency_code             @readonly;
      OperationAvailable    : Boolean  @title: 'Operation Available';
      currency              : Currency @readonly;
      fieldControlProperty1 : Integer  @UI.Hidden;
      fieldControlProperty2 : Integer  @UI.Hidden;
      property1             : String   @title: 'Property 1';
      property2             : String   @title: 'Property 2';
      property3             : String   @title: 'Property 3';
      BusinessPartnerID     : String   @title: 'Business Partner ID'  @Common.Text         : businessPartner.FullName  @Common.TextArrangement: #TextFirst;
      items                 : Association to many ChildEntity
                                on items.Parent = $self;
      businessPartner       : Association to one BusinessPartnerAddress
                                on businessPartner.BusinessPartner = BusinessPartnerID;
}

entity ChildEntity {
  key ID       : Integer  @title: 'Item Identifier';
      item     : String   @title: 'Item';

      @(
        title               : 'Price',
        Measures.ISOCurrency: currency_code
      )
      price    : Amount;
      currency : Currency @readonly;
      Parent   : Association to RootEntity;
}

@readonly
entity BusinessPartnerAddress {
  key BusinessPartner : String @title: 'Business Partner';
      FullName        : String @title: 'Name';
      CityName        : String @title: 'City';
      Country         : String @title: 'Country';
      PostalCode      : String @title: 'Postal Code';
      StreetName      : String @title: 'Street Name';
      HouseNumber     : String @title: 'House Number';
};

@Capabilities.SearchRestrictions.Searchable: false
entity AbsoluteEntity {
  key ID        : Integer  @Core.Computed  @title: 'Round';
      TimeStamp : DateTime @UI.Hidden;
      Duration  : String   @Core.Computed  @title: 'Duration';
}

@odata.singleton
entity EntitiesSingleton {
  BooleanProperty : Boolean @Core.Computed;
}


annotate RootEntity with
@(UI: {HeaderInfo: {
  TypeName      : 'Root Entity',
  TypeNamePlural: 'Root Entities',
}});

//Sample 1
annotate RootEntity with @(Common: {SideEffects #singleSourceProperty: {
  SourceProperties: [sourceProperty1],
  TargetProperties: [
    'targetProperty1a',
    'fieldControlProperty1'
  ]
}}) {
  targetProperty1b @Common.FieldControl: fieldControlProperty1;
};

//Sample2
annotate RootEntity with @(Common: {SideEffects #triggerActionProperty: {
  SourceProperties: [sourceProperty2],
  TargetProperties: ['targetProperty2'],
  TriggerAction   : 'sap.fe.core.Service.sideEffectTriggerAction'
}});

//Sample 3
annotate RootEntity with @(
  UI    : {
    FieldGroup #SourceProperties: {Data: [
      {Value: sourceProperty3a},
      {Value: sourceProperty3b},
      {Value: otherProperty3c}
    ]},
    FieldGroup #TargetProperty  : {Data: [{Value: targetProperty3}]},
    Facets                      : [
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'FormSource',
        Target: '@UI.FieldGroup#SourceProperties',
      },
      {
        $Type : 'UI.ReferenceFacet',
        ID    : 'FormTarget',
        Target: '@UI.FieldGroup#TargetProperty',
      }
    ],
    LineItem #sample7           : [
      {
        $Type             : 'UI.DataFieldForAction',
        Label             : 'Table Refresh',
        Action            : 'sap.fe.core.Service.EntityContainer/unBoundAction',
        InvocationGrouping: #ChangeSet
      },
      {
        $Type: 'UI.DataField',
        Value: property1,
      },
      {
        $Type: 'UI.DataField',
        Value: property2
      },
      {
        $Type: 'UI.DataField',
        Value: property3
      }
    ],
  },

  Common: {SideEffects #multiSourceProperties: {
    SourceProperties: [
      sourceProperty3a,
      sourceProperty3b
    ],
    TargetProperties: ['targetProperty3'],
    TriggerAction   : 'sap.fe.core.Service.sideEffectTriggerActionMultiSources'
  }}
);

//Sample 4
annotate RootEntity with @(Common: {SideEffects #booleanSourceProperties: {
  SourceProperties: [sourceProperty4],
  TargetProperties: ['fieldControlProperty2']
}}) {
  targetProperty4 @Common.FieldControl: fieldControlProperty2;
};

//Sample 5
annotate RootEntity with @(Common: {SideEffects #sourceEntity: {
  SourceEntities  : [items],
  TargetProperties: ['totalAmount']
}});

annotate ChildEntity with @(
  Capabilities.DeleteRestrictions.Deletable: true,
  UI                                       : {LineItem #sample5: [
    {
      $Type: 'UI.DataField',
      Value: item
    },
    {
      $Type                : 'UI.DataField',
      Value                : price,
      ![@HTML5.CssDefaults]: {width: '15em'}
    }
  ]}
);

//Sample 6 (additional action based side effect see further below)
annotate RootEntity with @(UI: {
  FieldGroup #sample6a      : {
    $Type: 'UI.FieldGroupType',
    Label: 'Complex Property Fields',
    Data : [
      {
        $Type : 'UI.DataFieldForAction',
        Label : 'Increase Number',
        Action: 'sap.fe.core.Service.increaseAndCheckPrime',
      },
      {
        $Type: 'UI.DataField',
        Value: OperationAvailable,
      }
    ],
  },
  Facets #OperationAvailable: [{
    $Type : 'UI.ReferenceFacet',
    Target: '@UI.FieldGroup#sample6a',
  }, ],
  FieldGroup #sample6b      : {
    $Type: 'UI.FieldGroupType',
    Label: 'Complex Property Fields',
    Data : [
      {
        $Type: 'UI.DataField',
        Value: complexProperty_number,
      },
      {
        $Type: 'UI.DataField',
        Value: complexProperty_prime,
      }
    ],
  },
  Facets #complexProperty   : [{
    $Type : 'UI.ReferenceFacet',
    Target: '@UI.FieldGroup#sample6b',
  }, ],
});

//sample 7 (additional action based side effect see further below)
annotate RootEntity with @(
  UI.Facets #BusinessPartnerAddress  : [{
    $Type : 'UI.ReferenceFacet',
    Target: 'businessPartner/@UI.FieldGroup#BusinessPartnerAddress'
  }],
  Common.SideEffects #BusinessPartner: {
    SourceProperties: [BusinessPartnerID],
    TargetEntities  : [businessPartner]
  }
) {
  @Common.ValueListMapping: {
    Label         : 'Business Partner',
    CollectionPath: 'BusinessPartnerAddress',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: BusinessPartnerID,
        ValueListProperty: 'BusinessPartner',
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'FullName',
      },
    ],
  }
  @Common.ValueListWithFixedValues
  @Common.Text            : businessPartner.FullName
  @Common.TextArrangement : #TextFirst
  BusinessPartnerID
};

annotate BusinessPartnerAddress with @(UI: {FieldGroup #BusinessPartnerAddress: {
  $Type: 'UI.FieldGroupType',
  Data : [
    {
      $Type: 'UI.DataField',
      Value: CityName
    },
    {
      $Type: 'UI.DataField',
      Value: PostalCode
    },
    {
      $Type: 'UI.DataField',
      Value: StreetName
    },
    {
      $Type: 'UI.DataField',
      Value: HouseNumber
    },
    {
      $Type: 'UI.DataField',
      Value: Country
    }
  ],
}});

//sample 8 (additional action based side effects see further below)
annotate AbsoluteEntity with @(
  Capabilities.DeleteRestrictions.Deletable: false,
  UI.LineItem                              : [
    {
      $Type: 'UI.DataField',
      Value: ID,
    },
    {
      $Type: 'UI.DataField',
      Value: Duration
    }
  ]
);

//actions and corresponding side effects for different samples
service Service {
  @Common.SideEffects: {TargetEntities: ['/sap.fe.core.Service.EntityContainer/RootEntity']}
  action unBoundAction();

  entity RootEntity             as projection on core.RootEntity actions {
                                     //sample 2 (action)
                                     action sideEffectTriggerAction();
                                     //sample 3 (action)
                                     action sideEffectTriggerActionMultiSources();

                                     //sample 6 (action with side effect)
                                     @(
                                       Common.SideEffects             : {TargetProperties: ['_it/*']},
                                       cds.odata.bindingparameter.name: '_it',
                                       Core.OperationAvailable        : _it.OperationAvailable
                                     )
                                     action increaseAndCheckPrime();

                                     //sample 7 (action with side effect)
                                     @(
                                       Common.SideEffects #InvalidateCachedValueHelp: {
                                         TargetProperties: ['_it/BusinessPartnerID'],
                                         TargetEntities  : ['/sap.fe.core.Service.EntityContainer/BusinessPartnerAddress']
                                       },
                                       cds.odata.bindingparameter.name              : '_it'
                                     )
                                     action deleteBusinessPartner();

                                     //sample 8 (3 actions with side effects)
                                     @(
                                       Common.SideEffects             : {
                                         TargetProperties: ['/sap.fe.core.Service.EntityContainer/EntitiesSingleton/BooleanProperty'],
                                         TargetEntities  : ['/sap.fe.core.Service.EntityContainer/AbsoluteEntity']
                                       },
                                       cds.odata.bindingparameter.name: '_it'
                                     )
                                     action addRound();
                                     @(
                                       Common.SideEffects             : {
                                         TargetProperties: ['/sap.fe.core.Service.EntityContainer/EntitiesSingleton/BooleanProperty'],
                                         TargetEntities  : ['/sap.fe.core.Service.EntityContainer/AbsoluteEntity']
                                       },
                                       cds.odata.bindingparameter.name: '_it'
                                     )
                                     action stopRound();
                                     @(
                                       Common.SideEffects             : {
                                         TargetProperties: ['/sap.fe.core.Service.EntityContainer/EntitiesSingleton/BooleanProperty'],
                                         TargetEntities  : ['/sap.fe.core.Service.EntityContainer/AbsoluteEntity']
                                       },
                                       cds.odata.bindingparameter.name: '_it'
                                     )
                                     action clearRounds();
                                   };

  entity ChildEntity            as projection on core.ChildEntity;
  entity BusinessPartnerAddress as projection on core.BusinessPartnerAddress;
  entity AbsoluteEntity         as projection on core.AbsoluteEntity;
  entity EntitiesSingleton      as projection on core.EntitiesSingleton;

  entity SideEffectsProperties {
    key Property     : String @title: 'Property';
        PropertyType : String @title: 'Type';
        Description  : String @title: 'Description';
  };

  entity TargetPropertiesSample {
    key TargetProperties : String @title: 'Target Properties';
        Description      : String @title: 'Description';
  }
}
