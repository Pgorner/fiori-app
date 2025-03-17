using {
  Currency,
  Language
} from '@sap/cds/common';

service Service {
  entity RootEntity {
    key ID                              : Integer;

        LanguageField                   : Language       @(
          Common        : {
            Label          : 'Language',
            Text           : LanguageField.name,
            TextArrangement: #TextLast
          },
          UI.Placeholder: 'Enter language',
          Core.Immutable: false
        );

        numberWithUnitOfMeasure         : Decimal(10, 5) @Measures.Unit       : UnitOfMeasure;
        UnitOfMeasure                   : String(40)     @(Common: {
          Text     : _RequestedUnitOfMeasure.UnitOfMeasure_Text,
          Label    : 'Unit of Measure',
          ValueList: {
            Label         : 'UnitOfMeasure',
            CollectionPath: 'UnitOfMeasure',
            Parameters    : [{
              $Type            : 'Common.ValueListParameterInOut',
              LocalDataProperty: UnitOfMeasure,
              ValueListProperty: 'UnitOfMeasureID'
            }]
          }
        });

        numberWithCurrencySAPCDSCommon  : Decimal(10, 5) @Measures.ISOCurrency: CurrencyField_code;
        CurrencyField                   : Currency       @(
          Common        : {
            Label          : 'Currency',
            IsCurrency     : true,
            Text           : CurrencyField.name,
            TextArrangement: #TextLast
          },
          UI.Placeholder: 'Enter currency code',
        );

        numberWithCurrencyAsString      : Integer        @Measures.ISOCurrency: CurrencyAsString;
        CurrencyAsString                : String;
        numberWithCurrencyAsConstant    : Integer        @Measures.ISOCurrency: 'EUR';
        DateProperty                    : Date;
        DatePropertyWithStyle           : Date           @UI                  : {DateTimeStyle: 'short'};
        DatePropertyWithPattern         : Date;
        TimeProperty                    : Time;
        TimePropertyWithStyle           : Time           @UI                  : {DateTimeStyle: 'short'};
        TimePropertyWithPattern         : Time;
        DateTimeProperty                : DateTime;
        DateTimePropertyWithStyle       : DateTime       @UI                  : {DateTimeStyle: 'short'};
        DateTimePropertyWithPattern     : DateTime;
        DateTimePropertyWithTimezone    : DateTime       @Common              : {Timezone: 'Europe/London'};
        DateTimePropertyWithTimezoneRef : DateTime       @Common              : {Timezone: TimezoneRef};
        TimezoneRef                     : String;

        multiLineText                   : String         @(
          Common.Label    : 'Multi Line Text',
          UI.MultiLineText: true,
          UI.Placeholder  : 'Enter a multi line text'
        );

        inputTestForMaxLength           : String         @(
          Common.Label    : 'Input test for max length',
          UI.MultiLineText: false,
          UI.Placeholder  : 'Enter a text with a length of 10'
        );

        FixedValueListValue             : Integer        @Common              : {
          Text                    : _FixedValueList.Description,
          TextArrangement         : #TextFirst,
          Label                   : 'Value with Fixed Value List',
          ValueListWithFixedValues: true,
          ValueList               : {
            Label         : 'Fixed Value List',
            CollectionPath: 'FixedValueListEntity',
            Parameters    : [
              {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: FixedValueListValue,
                ValueListProperty: 'KeyProp'
              },
              {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'Description'
              }
            ]
          }
        };

        _RequestedUnitOfMeasure         : Association to UnitOfMeasure
                                            on _RequestedUnitOfMeasure.UnitOfMeasureID = UnitOfMeasure;
        _FixedValueList                 : Association to one FixedValueListEntity
                                            on _FixedValueList.KeyProp = FixedValueListValue;
  }

  entity UnitOfMeasure {
    key UnitOfMeasureID     : String(40) @(
          Common.UnitSpecificScale: numFractionalDigits,
          Common.Text             : UnitOfMeasure_Text
        );
        UnitOfMeasure_Text  : String;
        numFractionalDigits : Integer default 0;
  }

  entity FixedValueListEntity {
    key KeyProp     : Integer @(Common: {
          Label          : 'Fixed Value List Key',
          Text           : Description,
          TextArrangement: #TextFirst
        });

        Description : String  @(
          Core.Immutable: true,
          Common.Label  : 'Fixed Value List'
        );
  }
}
