/**
 * Created by minimus on 17.11.13.
 */
var sam = sam || {};
(function ($) {
  var media, mediaTexts = samEditorOptions.media;

  sam.media = media = {
    buttonId: '#banner-media',
    adUrl: '#patch_img',
    adImgId: '#patch_img_id',
    adName: '#title',
    adDesc: '#description',
    //adAlt: '#ad_alt',

    init: function() {
      $(this.buttonId).on( 'click', this.openMediaDialog );
    },

    openMediaDialog: function( e ) {
      e.preventDefault();

      if ( this._frame ) {
        this._frame.open();
        return;
      }

      var Attachment = wp.media.model.Attachment;

      this._frame = media.frame = wp.media({
        title: mediaTexts.title,
        button: {
          text: mediaTexts.button
        },
        multiple: false,
        library: {
          type: 'image'
        }/*,
         selection: [ Attachment.get( $(this.adImgId).val() ) ]*/
      });

      this._frame.on('ready', function() {
        //
      });

      this._frame.state( 'library' ).on('select', function() {
        var attachment = this.get( 'selection' ).single();
        media.handleMediaAttachment( attachment );
      });

      this._frame.open();
    },

    handleMediaAttachment: function(a) {
      var attechment = a.toJSON();
      $(this.adUrl).val(attechment.url);
      $(this.adImgId).val(attechment.id);
      if('' == $(this.adName).val() && '' != attechment.title) $(this.adName).val(attechment.title);
      if('' == $(this.adDesc).val() && '' != attechment.caption) $(this.adDesc).val(attechment.caption);
      if('' == $(this.adAlt).val() && '' != attechment.alt) $(this.adAlt).val(attechment.alt);
    }
  };

  $(document).ready(function () {
    var em = $('#editor_mode').val(), fu;

    var
      rcpsi = $('#rc-psi'), rcpsc = $('#rc-psc'), rcpsd = $('#rc-psd'), title = $("#title");

    var
      btnUpload = $("#upload-file-button"),
      status = $("#uploading"),
      srcHelp = $("#uploading-help"),
      loadImg = $('#load_img'),
      sPointer,
      fileExt = '';

    sPointer = samEditorOptions.places;
    sPointer.pointer = 'places';

    /*var samUploader, mediaTexts = samEditorOptions.media;*/

    media.init();

    title.tooltip({
      track: true
    });

    var options = samEditorOptions.options/*$.parseJSON($.ajax({
      url:ajaxurl,
      data:{action:'get_strings'},
      async:false,
      dataType:'jsonp'
    }).responseText)*/;

    fu = new AjaxUpload(btnUpload, {
      action:ajaxurl,
      name:'uploadfile',
      data:{
        action:'upload_ad_image'
      },
      onSubmit:function (file, ext) {
        if (!(ext && /^(jpg|png|jpeg|gif|swf)$/.test(ext))) {
          status.text(options.status);
          return false;
        }
        loadImg.show();
        status.text(options.uploading);
      },
      onComplete:function (file, response) {
        status.text('');
        loadImg.hide();
        $('<div id="files"></div>').appendTo(srcHelp);
        if (response == "success") {
          $("#files").text(options.file + ' ' + file + ' ' + options.uploaded)
            .addClass('updated')
            .delay(3000)
            .fadeOut(1000, function () {
              $(this).remove();
            });
          if (em == 'item') $("#ad_img").val(options.url + file);
          else if (em == 'place') $("#patch_img").val(options.url + file);
        }
        else {
          $('#files').text(file + ' ' + response)
            .addClass('error')
            .delay(3000)
            .fadeOut(1000, function () {
              $(this).remove();
            });
        }
      }
    });

    $('#image_tools').tabs();

    $("#add-file-button").click(function () {
      var curFile = options.url + $("select#files_list option:selected").val();
      $("#patch_img").val(curFile);
      return false;
    });

    $('#patch_source_image').click(function () {
      if (rcpsi.is(':hidden')) rcpsi.show('blind', {direction:'vertical'}, 500);
      if (rcpsc.is(':visible')) rcpsc.hide('blind', {direction:'vertical'}, 500);
      if (rcpsd.is(':visible')) rcpsd.hide('blind', {direction:'vertical'}, 500);
    });

    $('#patch_source_code').click(function () {
      if (rcpsi.is(':visible')) rcpsi.hide('blind', {direction:'vertical'}, 500);
      if (rcpsc.is(':hidden')) rcpsc.show('blind', {direction:'vertical'}, 500);
      if (rcpsd.is(':visible')) rcpsd.hide('blind', {direction:'vertical'}, 500);
    });

    $('#patch_source_dfp').click(function () {
      if (rcpsi.is(':visible')) rcpsi.hide('blind', {direction:'vertical'}, 500);
      if (rcpsc.is(':visible')) rcpsc.hide('blind', {direction:'vertical'}, 500);
      if (rcpsd.is(':hidden')) rcpsd.show('blind', {direction:'vertical'}, 500);
    });

    if(sPointer.enabled || '' == title.val()) {
      $('#title').pointer({
        content: '<h3>' + sPointer.title + '</h3><p>' + sPointer.content + '</p>',
        position: 'top',
        close: function() {
          $.ajax({
            url: ajaxurl,
            data: {
              action: 'close_pointer',
              pointer: sPointer.pointer
            },
            async: true
          });
        }
      }).pointer('open');
    }

    return false;
  });
})(jQuery);