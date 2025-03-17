namespace sap.fe.test;

@title           : 'Stream Type'
@Core.IsMediaType: true
@Core.Computed   : true
type MediaType : String;

@title         : 'Stream Content'
@Core.MediaType: 'application/octet-stream'
type Stream    : LargeBinary;

service JestService {
  @odata.draft.enabled

  entity Attachments {
    key ID          : UUID;

        @Core.MediaType                  : file_type
        @Core.AcceptableMediaTypes       : [
          'image/jpg',
          'image/jpeg',
          'image/png'
        ]
        @Core.ContentDisposition.Filename: file_name
        @title                           : 'Attachment'
        file        : Stream;
        file_name   : String(120);

        @title                           : 'Attachment Type'
        file_type   : MediaType; // string

        @readonly
        @title                           : 'Uploaded by'
        @cds.on.insert                   : $user
        uploaded_by : String(120);

        @readonly
        @title                           : 'Uploaded on'
        @cds.on.insert                   : $now
        uploaded_on : DateTime;

        @title                           : 'Note'
        note        : String(120);

        isDeletable : Boolean;
  }

  annotate Attachments with @(UI.LineItem: [
    {
      $Type             : 'UI.DataField',
      @HTML5.CssDefaults: {width: '15em'},
      Value             : file,
    },
    {
      $Type: 'UI.DataField',
      Value: note,
    },
    {
      $Type: 'UI.DataField',
      Value: uploaded_by
    },
    {
      $Type: 'UI.DataField',
      Value: uploaded_on,
    }
  ])

                            @(UI.MediaResource: {Stream: file})
                            @(Capabilities: {DeleteRestrictions: {Deletable: isDeletable}})
                            @(UI.HeaderInfo: {TypeNamePlural: 'Documents', })
}
