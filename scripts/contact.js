$(document)
    .ajaxStart(function() {
        $('#formMask').show();
    })
    .ajaxStop(function() {
        $('#formMask').hide();
    });

$('form').on('submit', function (event) {
    event.preventDefault();

    $.post('//azworkshops.azurewebsites.net/api/sendgrid', JSON.stringify($(this).serializeArray()), function(data) {
        console.log(data);
        $('#form').hide();
        $('#thankYou').show();

    }).fail(function(err) {
        console.log(err);
        $('#errorMsg').show();

    });
    ;
});