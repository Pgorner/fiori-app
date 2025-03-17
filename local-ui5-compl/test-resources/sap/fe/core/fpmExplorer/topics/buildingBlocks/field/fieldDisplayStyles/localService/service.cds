using {
  cuid,
  managed
} from '@sap/cds/common';

namespace sap.fe.core;

entity RootEntity {
  key ID                      : Integer;
      StringProperty          : String;
      Code                    : String  @Common.Text     : TextProperty;
      TextProperty            : String;
      Criticality             : Integer;
      UrlDescription          : String;
      UrlTargetDescription    : String  @HTML5.LinkTarget: '_blank';
      TargetUrl               : String;
      TargetUrlNewTab         : String;
      ActionValue             : String;
      TargetNavigation        : String;
      Mail                    : String  @Communication.IsEmailAddress;
      Phone                   : String  @Communication.IsPhoneNumber;
      DataPointValue          : Integer;
      DataPointTarget         : Integer;
      NumberWithUnit          : Decimal @Measures.Unit   : Unit;
      Unit                    : String;
      Icon                    : String  @(UI: {IsImageURL: true});
      ImageUrl                : String  @(UI: {IsImageURL: true});
      FileName                : String;
      MaskedInputPhone        : String  @(
        UI.InputMask  : {
          Mask             : '(***) *** ******',
          PlaceholderSymbol: '_',
        },
        UI.Placeholder: 'Enter twelve-digit number'
      );
      MaskedInputRegistration : String  @(
        UI.InputMask  : {
          Mask             : 'I****-**',
          PlaceholderSymbol: '_',
          Rules            : [{
            MaskSymbol: '*',
            RegExp    : '[0-9]'
          }]
        },
        UI.Placeholder: 'Enter digits registration number'
      );
      MaskedInputSAP          : String  @(
        UI.InputMask  : {
          Mask             : 'S^AP-AA-999',
          PlaceholderSymbol: '_',
          Rules            : [
            {
              MaskSymbol: '9',
              RegExp    : '[0-9]'
            },
            {
              MaskSymbol: 'A',
              RegExp    : '[A-Z]'
            }
          ]
        },
        UI.Placeholder: 'Starts with SAP followed by two Uppercase letter and three digits'
      );
      File                    : String  @(
        Core.MediaType                  : 'text/plain',
        Core.AcceptableMediaTypes       : ['text/plain'],
        Core.ContentDisposition.Filename: FileName
      );
}

annotate RootEntity with @UI: {

  FieldGroup #ObjectStatus      : {
    Label: 'Object status Fields',
    Data : [
      {
        $Type      : 'UI.DataField',
        Value      : StringProperty,
        Criticality: #Positive
      },
      {
        $Type      : 'UI.DataField',
        Value      : Code,
        Criticality: Criticality
      },
      {
        $Type : 'UI.DataFieldForAnnotation',
        Target: '@UI.DataPoint#criticalityProperty'
      },
    ]
  },
  DataPoint #criticalityProperty: {
    Value      : Code,
    Title      : 'criticality',
    Criticality: Criticality
  },
  FieldGroup #Link              : {
    Label: 'Link Fields',
    Data : [
      {
        $Type: 'UI.DataFieldWithUrl',
        Value: UrlDescription,
        Url  : TargetUrl
      },
      {
        $Type: 'UI.DataFieldWithUrl',
        Value: UrlTargetDescription,
        Url  : TargetUrlNewTab
      },
      {
        $Type : 'UI.DataFieldWithAction',
        Value : ActionValue,
        Action: 'sap.fe.core.FieldDisplayStyles.random'
      },
      {
        $Type         : 'UI.DataFieldWithIntentBasedNavigation',
        Value         : TargetNavigation,
        SemanticObject: 'Salesorder',
        Action        : 'show'
      }
    ]
  },
  DataPoint #Rating             : {
    Value        : DataPointValue,
    Title        : 'Rating',
    TargetValue  : DataPointTarget,
    Visualization: #Rating
  },
  DataPoint #Progress           : {
    Value        : DataPointValue,
    Title        : 'Progress',
    TargetValue  : DataPointTarget,
    Visualization: #Progress
  },
  DataPoint #ObjectNumber       : {
    Value: NumberWithUnit,
    Title: 'ObjectNumber'
  }
};


service FieldDisplayStyles {
  entity RootEntity as projection on core.RootEntity actions {
                         @(
                           Common.SideEffects             : {TargetProperties: ['_it/*']},
                           cds.odata.bindingparameter.name: '_it'
                         )
                         action random();
                       };
}
