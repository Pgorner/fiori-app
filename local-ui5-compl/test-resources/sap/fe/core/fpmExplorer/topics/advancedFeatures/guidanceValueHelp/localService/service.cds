namespace sap.fe.core;

@odata.draft.enabled

entity RootEntity {
  key ID                             : Integer  @Core.Computed  @title: 'Identifier';
      // Example 1
      valueHelpField1_1              : String   @title: 'Value Help Field 1_1';
      valueHelpField1_2              : String   @title: 'Value Help Field 1_2';
      _BusinessPartnerAddress_VHF1_2 : Association to BusinessPartnerAddress2
                                         on _BusinessPartnerAddress_VHF1_2.BusinessPartner = valueHelpField1_2;

      // Example 2
      valueHelpField2_1              : String   @title: 'Value Help Field 2_1';
      valueHelpField2_2              : String   @title: 'Value Help Field 2_2';
      _BusinessPartnerAddress_VHF2_2 : Association to BusinessPartnerAddress2
                                         on _BusinessPartnerAddress_VHF2_2.BusinessPartner = valueHelpField2_2;
      valueHelpField2_3              : String   @title: 'Value Help Field 2_3';
      // Example 3
      valueHelpField3_1              : String   @title: 'Value Help Field 3_1';
      _BusinessPartnerAddress_VHF3_1 : Association to BusinessPartnerAddress2
                                         on _BusinessPartnerAddress_VHF3_1.BusinessPartner = valueHelpField3_1;

      // Example 4
      valueHelpField4_1              : String   @title: 'Value Help Field 4_1';
      valueHelpField4_2              : String   @title: 'Value Help Field 4_2';
      _BusinessPartnerAddress_VHF4_2 : Association to BusinessPartnerAddress2
                                         on _BusinessPartnerAddress_VHF4_2.BusinessPartner = valueHelpField4_2;

      // Example 5
      valueHelpField5_1              : String   @title: 'Value Help Field 5_1';
      _BusinessPartnerAddress_VHF5_1 : Association to BusinessPartnerAddress2
                                         on _BusinessPartnerAddress_VHF5_1.BusinessPartner = valueHelpField5_1;

      // Example 6
      valueHelpField6_1              : String   @title: 'Value Help Field 6_1';
      valueHelpField6_2              : String   @title: 'Value Help Field 6_2';
      _BusinessPartnerAddress_VHF6_2 : Association to BusinessPartnerAddress2
                                         on _BusinessPartnerAddress_VHF6_2.BusinessPartner = valueHelpField6_2;

      // Example 7
      valueHelpField7_1              : String   @title: 'Account ID';
      valueHelpField7_2              : String   @title: 'Account Full Name';
      valueHelpField7_3              : String   @title: 'Business Partner';
      valueHelpField7_4              : String   @title: 'Partner Function';

      _PartnerFunction               : Association to one PartnerFunction
                                         on _PartnerFunction.PartnerFunction = valueHelpField7_4;
};

entity BusinessPartnerAddress {
  key BusinessPartner : String @title: 'Business Partner';
      FullName        : String @title: 'Name';
      CityName        : String @title: 'City';
      Country         : String @title: 'Country';
      PostalCode      : String @title: 'Postal Code';
      StreetName      : String @title: 'Street Name';
      HouseNumber     : String @title: 'House Number';
      Account         : String @title: 'Account';
};

entity BusinessPartnerAddress2 {
  key BusinessPartner : String @(
        Common: {
          Text           : FullName, //Text not optional if you want to have a display format via TextArrangement in the value list
          TextArrangement: #TextFirst //sets presentation of key and description value like description (key) in the value help table.
        },
        title : 'Business Partner'
      );
      FullName        : String @title: 'Name';
      CityName        : String @title: 'City';
      Country         : String @title: 'Country';
      PostalCode      : String @title: 'Postal Code';
      StreetName      : String @title: 'Street Name';
      HouseNumber     : String @title: 'House Number';
};

// *********************************************
// switch off the typeahead for the input fields annotated to value list entity BusinessPartnerAddress3
// *********************************************
annotate BusinessPartnerAddress3 with @(Capabilities.SearchRestrictions.Searchable: false);

entity BusinessPartnerAddress3 {
  key BusinessPartner : String @title: 'Business Partner';
      FullName        : String @title: 'Name';
      CityName        : String @title: 'City';
      PostalCode      : String @title: 'Postal Code';
};

entity Account {
  key Account  : String @title: 'Account';
      FullName : String @title: 'Name';
      CityName : String @title: 'City';
      Country  : String @title: 'Country';
};

entity PartnerFunction {
  key PartnerFunction     : String @(
        title : 'PF',
        Common: {Text: PartnerFunctionName}
      );
      PartnerFunctionName : String @title: 'Partner Function';
};

entity AccBp {
  key Account          : String @title: 'Account';
  key BusinessPartner  : String @title: 'Business Partner';
      PartnerFunction  : String @(
        title : 'PF',
        Common: {Text: _PartnerFunction.PartnerFunctionName}
      );
      _PartnerFunction : Association to one PartnerFunction
                           on _PartnerFunction.PartnerFunction = PartnerFunction;
};


// *********************************************
// Example 1: VH dropdown list with fixed values
// *********************************************

annotate RootEntity with {
  @(Common: {
    ValueListWithFixedValues: true,
    ValueList               : {
      CollectionPath: 'BusinessPartnerAddress',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField1_1,
          ValueListProperty: 'BusinessPartner'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'FullName'
        }
      ]
    }
  })
  valueHelpField1_1;

  @(Common: {
    Text                    : _BusinessPartnerAddress_VHF1_2.FullName,
    ValueListWithFixedValues: true,
    ValueList               : {
      CollectionPath: 'BusinessPartnerAddress2',
      Parameters    : [{
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: valueHelpField1_2,
        ValueListProperty: 'BusinessPartner'
      }]
    }
  })
  valueHelpField1_2;
}

annotate RootEntity with
@(UI.FieldGroup #Example1: {
  Label: 'Example1',
  $Type: 'UI.FieldGroupType',
  Data : [
    {
      Value: valueHelpField1_1,
      $Type: 'UI.DataField'
    },
    {
      Value: valueHelpField1_2,
      $Type: 'UI.DataField'
    }
  ]
});

// *********************************************
// Example 2: VH Dialog Table
// *********************************************

annotate RootEntity with {
  @(Common: {ValueList: {
    CollectionPath: 'BusinessPartnerAddress',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: valueHelpField2_1,
        ValueListProperty: 'BusinessPartner',
        ![@UI.Importance]: #High
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'FullName'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'CityName',
        ![@UI.Importance]: #High
      }
    ]
  }})
  valueHelpField2_1;

  @(Common: {
    Text     : _BusinessPartnerAddress_VHF2_2.FullName,
    ValueList: {
      CollectionPath: 'BusinessPartnerAddress2',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField2_2,
          ValueListProperty: 'BusinessPartner',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'FullName'

        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'Country',
          ![@UI.Importance]: #High
        }
      ]
    }
  })
  valueHelpField2_2;

  @(Common: {ValueList: {
    CollectionPath: 'BusinessPartnerAddress3',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: valueHelpField2_3,
        ValueListProperty: 'BusinessPartner',
        ![@UI.Importance]: #High
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'FullName'

      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'PostalCode',
        ![@UI.Importance]: #High
      }
    ]
  }})
  valueHelpField2_3;
}

annotate RootEntity with
@(UI.FieldGroup #Example2: {
  Label: 'Example2',
  $Type: 'UI.FieldGroupType',
  Data : [
    {
      Value: valueHelpField2_1,
      $Type: 'UI.DataField'
    },
    {
      Value: valueHelpField2_2,
      $Type: 'UI.DataField'
    },
    {
      Value: valueHelpField2_3,
      $Type: 'UI.DataField'
    }
  ]
});

// *********************************************
// Example 3: VH Validation
// *********************************************

annotate RootEntity with {
  @(Common: {
    Text                  : _BusinessPartnerAddress_VHF3_1.FullName,
    ValueListForValidation: '',
    ValueList             : {
      CollectionPath: 'BusinessPartnerAddress2',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField3_1,
          ValueListProperty: 'BusinessPartner'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'Country'
        }
      ]
    }
  })
  valueHelpField3_1;
}

annotate RootEntity with
@(UI.FieldGroup #Example2a: {
  Label: 'Example2a',
  $Type: 'UI.FieldGroupType',
  Data : [{
    Value: valueHelpField3_1,
    $Type: 'UI.DataField'
  }]
});

// *********************************************
// Example 4: Context-Dependent VH
// *********************************************

annotate RootEntity with {
  @(Common: {
    ValueListWithFixedValues: true,
    ValueList               : {
      Label         : 'Business Partner Address',
      CollectionPath: 'BusinessPartnerAddress',
      Parameters    : [{
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: valueHelpField4_1,
        ValueListProperty: 'BusinessPartner'
      }]
    }
  })
  valueHelpField4_1;

  @(Common: {
    ValueListRelevantQualifiers: [{$edmJson: {$If: [
      {$Or: [
        {$Eq: [
          {$Path: 'valueHelpField4_1'},
          {$String: '17100001'}
        ]},
        {$Eq: [
          {$Path: 'valueHelpField4_1'},
          {$String: '17100006'}
        ]}
      ]},
      {$String: 'qualifier2'},
      {$String: ''}
    ]}}],
    ValueList                  : {
      Label         : 'Business Partner Address',
      CollectionPath: 'BusinessPartnerAddress',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField4_2,
          ValueListProperty: 'BusinessPartner',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'FullName'

        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'Country',
          ![@UI.Importance]: #High
        }
      ]
    },
    ValueList #qualifier2      : {
      Label         : 'Business Partner Address 2',
      CollectionPath: 'BusinessPartnerAddress2',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField4_2,
          ValueListProperty: 'BusinessPartner',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'CityName'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'Country',
          ![@UI.Importance]: #High
        }
      ]
    }
  })
  valueHelpField4_2;
}

annotate RootEntity with
@(UI.FieldGroup #Example3: {
  Label: 'Example3',
  $Type: 'UI.FieldGroupType',
  Data : [
    {
      Value: valueHelpField4_1,
      $Type: 'UI.DataField'
    },
    {
      Value: valueHelpField4_2,
      $Type: 'UI.DataField'
    }
  ]
});

// *********************************************
// Example 5: Multiple Value Help Dialogs
// *********************************************

annotate RootEntity with {
  @(Common: {
    Text                 : _BusinessPartnerAddress_VHF5_1.FullName,
    ValueList            : {
      Label         : 'Business Partner Address',
      CollectionPath: 'BusinessPartnerAddress',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField5_1,
          ValueListProperty: 'BusinessPartner',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'FullName'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'Country',
          ![@UI.Importance]: #High
        }
      ]
    },
    ValueList #qualifier2: {
      Label         : 'Business Partner Address 2',
      CollectionPath: 'BusinessPartnerAddress2',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField5_1,
          ValueListProperty: 'BusinessPartner'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'FullName'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'Country'
        }
      ]
    },
    ValueList #qualifier3: {
      Label         : 'Business Partner Address 3',
      CollectionPath: 'BusinessPartnerAddress',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField5_1,
          ValueListProperty: 'BusinessPartner'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'PostalCode'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'CityName'
        }
      ]
    }
  })
  valueHelpField5_1;
}

annotate RootEntity with
@(UI.FieldGroup #Example4: {
  Label: 'Example4',
  $Type: 'UI.FieldGroupType',
  Data : [{
    Value: valueHelpField5_1,
    $Type: 'UI.DataField'
  }]
});

// *********************************************
// Example 6: Control the content of the Multiple Value Help list
// *********************************************

annotate RootEntity with {
  @(Common: {
    ValueListWithFixedValues: true,
    ValueList               : {
      Label         : 'Business Partner Address',
      CollectionPath: 'BusinessPartnerAddress',
      Parameters    : [{
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: valueHelpField6_1,
        ValueListProperty: 'BusinessPartner'
      }]
    }
  })
  valueHelpField6_1;

  @(Common: {
    Text                       : _BusinessPartnerAddress_VHF6_2.FullName,
    ValueListRelevantQualifiers: [

      {$edmJson: {$If: [
        {$Eq: [
          {$Path: 'valueHelpField6_1'},
          {$String: '17100001'}
        ]},
        {$String: 'qualifier102'}
      ]}},

      {$edmJson: {$If: [
        {$Eq: [
          {$Path: 'valueHelpField6_1'},
          {$String: '17100001'}
        ]},
        {$String: 'qualifier103'}
      ]}},

      {$edmJson: {$If: [
        {$Eq: [
          {$Path: 'valueHelpField6_1'},
          {$String: '17100006'}
        ]},
        {$String: 'qualifier103'}
      ]}},

      {$edmJson: {$If: [
        {$Eq: [
          {$Path: 'valueHelpField6_1'},
          {$String: '17100006'}
        ]},
        {$String: 'qualifier104'}
      ]}},

      {$edmJson: {$If: [
        {$And: [
          {$Ne: [
            {$Path: 'valueHelpField6_1'},
            {$String: '17100001'}
          ]},
          {$Ne: [
            {$Path: 'valueHelpField6_1'},
            {$String: '17100006'}
          ]}
        ]},
        {$String: ''}
      ]}}

    ],
    ValueList                  : {
      Label         : 'Business Partner Address',
      CollectionPath: 'BusinessPartnerAddress',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField6_2,
          ValueListProperty: 'BusinessPartner',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'FullName'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'Country'
        }
      ]
    },
    ValueList #qualifier102    : {
      Label         : 'Business Partner Address 2',
      CollectionPath: 'BusinessPartnerAddress2',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField6_2,
          ValueListProperty: 'BusinessPartner',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'FullName'

        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'Country'
        }
      ]
    },
    ValueList #qualifier103    : {
      Label         : 'Business Partner Address 3',
      CollectionPath: 'BusinessPartnerAddress',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField6_2,
          ValueListProperty: 'BusinessPartner',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'FullName'

        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'CityName'
        }
      ]
    },
    ValueList #qualifier104    : {
      Label         : 'Business Partner Address 4',
      CollectionPath: 'BusinessPartnerAddress',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField6_2,
          ValueListProperty: 'BusinessPartner',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'FullName'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'CityName'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'StreetName'
        }
      ]
    }
  })
  valueHelpField6_2;
}

annotate RootEntity with
@(UI.FieldGroup #Example5: {
  Label: 'Example5',
  $Type: 'UI.FieldGroupType',
  Data : [
    {
      Value: valueHelpField6_1,
      $Type: 'UI.DataField'
    },
    {
      Value: valueHelpField6_2,
      $Type: 'UI.DataField'
    }
  ]
});

// *********************************************
// Example 7: In / Out Mappings in the ValueList Annotation
// *********************************************

annotate RootEntity with {
  @(Common: {ValueList: {
    CollectionPath: 'Account',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: valueHelpField7_1,
        ValueListProperty: 'Account',
        ![@UI.Importance]: #High
      },
      {
        $Type            : 'Common.ValueListParameterOut',
        LocalDataProperty: valueHelpField7_2,
        ValueListProperty: 'FullName',
        ![@UI.Importance]: #High
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'CityName'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'Country'
      },
    ],
  }}, )
  valueHelpField7_1;
}

// valueHelpField7_2 is only a input field prefilled with the filter result from valueHelpField7_1


annotate RootEntity with {
  @(Common: {
    ValueListForValidation: '',
    ValueList             : {
      Label         : 'Business Partner Address',
      CollectionPath: 'BusinessPartnerAddress',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField7_3,
          ValueListProperty: 'BusinessPartner',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterIn',
          LocalDataProperty: valueHelpField7_1,
          ValueListProperty: 'Account',
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'CityName',
          ![@UI.Importance]: #High
        },
      ],
    }
  }, )
  valueHelpField7_3;
}

annotate RootEntity with {
  @(Common: {
    Text           : _PartnerFunction.PartnerFunctionName,
    TextArrangement: #TextOnly,
    ValueList      : {
      Label         : 'Partner Function',
      CollectionPath: 'AccBp',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField7_4,
          ValueListProperty: 'PartnerFunction',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterIn',
          LocalDataProperty: valueHelpField7_1,
          ValueListProperty: 'Account',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: valueHelpField7_3,
          ValueListProperty: 'BusinessPartner',
          ![@UI.Importance]: #High
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: '_PartnerFunction/PartnerFunctionName',
          ![@UI.Importance]: #High
        }
      ],
    }
  }, )
  valueHelpField7_4;
}

annotate RootEntity with
@(UI.FieldGroup #Example7: {
  Label: 'Example7',
  $Type: 'UI.FieldGroupType',
  Data : [
    {
      Value: valueHelpField7_1,
      $Type: 'UI.DataField',
    },
    {
      Value: valueHelpField7_2,
      $Type: 'UI.DataField',
    },
    {
      Value: valueHelpField7_3,
      $Type: 'UI.DataField',
    },
    {
      Value: valueHelpField7_4,
      $Type: 'UI.DataField',
    },
  ]
});

// *********************************************
// Service declarations
// *********************************************

service Service {
  entity RootEntity              as projection on core.RootEntity;
  entity BusinessPartnerAddress  as projection on core.BusinessPartnerAddress;
  entity BusinessPartnerAddress2 as projection on core.BusinessPartnerAddress2;
  entity BusinessPartnerAddress3 as projection on core.BusinessPartnerAddress3;
  entity Account                 as projection on core.Account;
  entity PartnerFunction         as projection on core.PartnerFunction;
  entity AccBp                   as projection on core.AccBp;


  entity ValueListProperties {
    key Property     : String @title: 'Property';
        PropertyType : String @title: 'Type';
        Description  : String @title: 'Description';
  };

  entity ValueListDocumentation {
    key Description : String @title: 'Description';
        Link        : String @title: 'Link';
  };

  entity ValueListDocumentationDescription {
    key Description : String @title: 'Annotation';
  };

};
