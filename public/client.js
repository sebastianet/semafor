
// nova funcio yymmdd de Date() - at client
Date.prototype.yyyymmdd = function () {
        var yyyy = this.getFullYear().toString();
        var mm   = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd   = this.getDate().toString();
        return yyyy + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]);
} ; // yyyymmd

Date.prototype.hhmmss = function () {
        function fixTime(i) {
        return (i < 10) ? "0" + i : i;
    }
        var today = new Date(),
            hh = fixTime( today.getHours() ),
                mm = fixTime( today.getMinutes() ),
                ss = fixTime( today.getSeconds() ) ;
        var myHHMMSS = hh + ':' + mm + ':' + ss ;
        return myHHMMSS ;
} ; // hhmmss


function Posar_Pagina_Logon() {

// called from 3 places :
//   1 - "index.htm" ready event
//   2 - "logon" menu click
//   3 - "logoff" menu click

    $.get( '/logon.htm', function( page ) {
        console.log( '*** Demanem al server LOGON.HTM, initial SPA text.' ) ;
        $( "#SPA_data" ).html( page ) ; // show received HTML at specific <div>
    }) ; // get(logon.htm)

    $( "#contingut" ).html( 'El servidor &eacute;s plenament funcional - use IDENT to display Hostname' ) ; // show received HTML at specific <div>

} ; // Posar_Pagina_Logon

// ========================================================================

$( function() { // DOM ready event for main INDEX.HTML page

    console.log( '*** index.html - DOM ready event.' ) ;

// posem al SPA_data (we are a SPA) la sub-pagina inicial que veu el client : LOGON.HTM

    Posar_Pagina_Logon() ;

// posar la data actual - aixi diferenciem re-loads - "Now is"
//    var szAra = 'Timestamp [' + (new Date).yyyymmdd() +', '+ (new Date).hhmmss() + ']' ;
//    $( "#my_date" ).html( szAra ) ; // show actual date

} ) ; // DOM ready

// ========================================================================

// Functions available to links in INDEX.HTML page

$( "#clkTopMenu_Logon" ).click( function() {
    Posar_Pagina_Logon() ;
}) ; // click on menu "logon" link

$( "#clkTopMenu_Semafor" ).click( function() {

//    $.get( '/sem.htm', function( page ) {
    $.get( '/menu_semaforo', function( page ) {
        console.log( '*** Demanem al server un SPA text, SEM.HTM o LOGON.HTM.' ) ;
        $( "#SPA_data" ).html( page ) ; // show received HTML at specific <div>
    }) ; // get(sem.htm)

}) ; // click on menu "semafor" link

$( "#clkTopMenu_Foto" ).click( function() {

//    $.get( '/foto.htm', function( page ) {
    $.get( '/menu_foto', function( page ) {
        console.log( '*** Demanem al server un SPA text, FOTO.HTM o LOGON.HTM.' ) ;
        $( "#SPA_data" ).html( page ) ; // show received HTML at specific <div>
    }) ; // get(foto.htm)

}) ; // click on menu "foto" link

$( "#clkTopMenu_Wassa" ).click( function() {

//    $.get( '/wassa.htm', function( page ) {
    $.get( '/menu_wassa', function( page ) {
        console.log( '*** Demanem al server un SPA text, WASSA.HTM o LOGON.HTM.' ) ;
        $( "#SPA_data" ).html( page ) ; // show received HTML at specific <div>
    }) ; // get(wassa.htm)

}) ; // click on menu "wassa" link

$( "#clkTopMenu_Id" ).click( function() {

    $.get( '/identificar', function( page ) {
        console.log( '*** index - top menu - demanem al server IDENTIFICAR.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // fer identificar

}) ; // identificar

$( "#clkTopMenu_Bye" ).click( function() {
    $.post( '/menu_cerrar_aplicacion/Id="abc"', function( page ) {
        console.log( '*** index - top menu - demanem al server BYE.' ) ;
        $( "#SPA_data" ).html( page ) ; // show received HTML at specific <div>
    } ) ;
    $( "#contingut" ).html( "$$$ APP tancada if loggedon() $$$" ) ;
}) ; // click on menu "bye" link

$( "#clkTopMenu_Help" ).click( function() {

    $.get( '/ajuda.htm', function( page ) {
        console.log( '*** Demanem al server HELP.HTM, SPA text.' ) ;
        $( "#SPA_data" ).html( page ) ; // show received HTML at specific <div>
        $.get( '/bitacora', function( page ) {
             $( "#bitacora_data" ).html( page ) ; // show received HTML at specific <div>
        }) ; // bitacora data
    }) ; // get(help.htm)

}) ; // click on menu "help" link

$( "#clkTopMenu_Logoff" ).click( function() {

    $.get( '/fer_logoff', function( page ) {
        console.log( '*** Demanem al server fer LOGOFF.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // fer logoff

    Posar_Pagina_Logon() ;

}) ; // click on menu "help" link

// ========================================================================

// "page ready" events for all 5 pages we place in "SPA_data" div : SEM, FOTO, LOGON, WHATSAPP, HELP


// ++++ (1) SEM_READY()

function sem_ready() {

    console.log( '*** sem.htm - DOM ready event.' ) ;

// --- ho fem amb el CLICK() del boto, no amb el Link
// $( "#clk_Enviar_Msg_WhatsApp" ).click( function() {
//     $.post( '/enviar_msg_whatsapp/ParamTfNum=34638015371', function( page ) {
//         console.log( '*** index - demanem al server ENVIAR MSG WHATSAPP.' ) ;
//         $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
//     }) ; // post(activar)
// }) ; // enviar msg whatsapp


$( "#clkActivar_VAR" ).click( function() {
    $.post( '/menu_engegar_sequencia/Tipus=sequencia_VAR', function( page ) {
        console.log( '*** index - demanem al server ACTIVAR sequencia VAR.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // post(activar)
}) ; // activar sequencia VAR

$( "#clkActivar_RAV" ).click( function() {
    $.post( '/menu_engegar_sequencia/Tipus=sequencia_RAV', function( page ) {
        console.log( '*** index - demanem al server ACTIVAR sequencia RAV.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // post(activar)
}) ; // activar sequencia RAV

$( "#clkActivar_random_tres" ).click( function() {
    $.post( '/menu_engegar_sequencia/Tipus=sequencia_random_de_tres', function( page ) {
        console.log( '*** index - demanem al server ACTIVAR sequencia RANDOM-3.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // post(activar)
}) ; // activar sequencia RANDOM-3

$( "#clkActivar_random_vuit" ).click( function() {
    $.post( '/menu_engegar_sequencia/Tipus=sequencia_random_de_vuit', function( page ) {
        console.log( '*** index - demanem al server ACTIVAR sequencia RANDOM-8.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // post(activar)
}) ; // activar sequencia RANDOM-8


$( "#clkAturar_tot" ).click( function() {
    $.post( '/menu_apagar_llum/Color=seq_tot', function( page ) {
        console.log( '*** index - demanem al server ATURAR sequencia TOT.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // post(aturar)
}) ; // aturar sequencia TOT

$( "#clkAturar_VAR" ).click( function() {
    $.post( '/menu_apagar_llum/Color=seq_var', function( page ) {
        console.log( '*** index - demanem al server ATURAR sequencia VAR.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // post(aturar)
}) ; // aturar sequencia VAR

$( "#clkAturar_RAV" ).click( function() {
    $.post( '/menu_apagar_llum/Color=seq_rav', function( page ) {
        console.log( '*** index - demanem al server ATURAR sequencia RAV.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // post(aturar)
}) ; // aturar sequencia RAV

$( "#clkAturar_random_tres" ).click( function() {
    $.post( '/menu_apagar_llum/Color=seq_random', function( page ) {
        console.log( '*** index - demanem al server ATURAR sequencia RANDOM-3.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // post(aturar)
}) ; // aturar sequencia RANDOM-3

$( "#clkAturar_random_vuit" ).click( function() {
    $.post( '/menu_apagar_llum/Color=seq_random', function( page ) {
        console.log( '*** index - demanem al server ATURAR sequencia RANDOM-8.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // post(aturar)
}) ; // aturar sequencia RANDOM-8

$( "#clk_Apagar_Verd" ).click( function() {
    $.post( '/menu_apagar_llum/Color=verd', function( page ) {
        console.log( '*** index - demanem al server APAGAR LLUM VERD.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; 
}) ; // apagar verd

$( "#clk_Apagar_Groc" ).click( function() {
    $.post( '/menu_apagar_llum/Color=groc', function( page ) {
        console.log( '*** index - demanem al server APAGAR LLUM GROC.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; 
}) ; // apagar groc

$( "#clk_Apagar_Vermell" ).click( function() {
    $.post( '/menu_apagar_llum/Color=vermell', function( page ) {
        console.log( '*** index - demanem al server APAGAR LLUM VERMELL.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; 
}) ; // apagar vermell

$( "#clk_Apagar_Tres_Llums" ).click( function() {
    $.post( '/menu_apagar_llum/Color=tres_llums', function( page ) {
        console.log( '*** index - demanem al server APAGAR 3 LLUMS.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; 
}) ; // apagar 3 llums 

 
$( "#clk_Encendre_Verd" ).click( function() {
    $.post( '/menu_encendre_llum/Color=verd', function( page ) {
        console.log( '*** index - demanem al server ENCENDRE LLUM VERD.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; 
}) ; // encendre verd

$( "#clk_Encendre_Groc" ).click( function() {
    $.post( '/menu_encendre_llum/Color=groc', function( page ) {
        console.log( '*** index - demanem al server ENCENDRE LLUM GROC.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // encendre groc

$( "#clk_Encendre_Vermell" ).click( function() {
    $.post( '/menu_encendre_llum/Color=vermell', function( page ) {
        console.log( '*** index - demanem al server ENCENDRE LLUM VERMELL.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // encendre vermell

$( "#clk_Encendre_Tres_Llums" ).click( function() {
    $.post( '/menu_encendre_llum/Color=tres_llums', function( page ) {
        console.log( '*** index - demanem al server ENCENDRE 3 LLUMS.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // encendre vermell



$( "#clk_engegar_Intermitent_Verd" ).click( function() {
    $.post( '/menu_engegar_sequencia/Tipus=intermitent_verd', function( page ) {
        console.log( '*** index - demanem al server engegar INTERMITENT VERD.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // engegar intermitent verd

$( "#clk_engegar_Intermitent_Groc" ).click( function() {
    $.post( '/menu_engegar_sequencia/Tipus=intermitent_groc', function( page ) {
        console.log( '*** index - demanem al server engegar INTERMITENT GROC.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // engegar intermitent groc

$( "#clk_engegar_Intermitent_Vermell" ).click( function() {
    $.post( '/menu_engegar_sequencia/Tipus=intermitent_vermell', function( page ) {
        console.log( '*** index - demanem al server engegar INTERMITENT VERMELL.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // engegar intermitent vermell

$( "#clk_engegar_Intermitent_Tres_Lums" ).click( function() {
    $.post( '/menu_engegar_sequencia/Tipus=intermitent_tres_llums', function( page ) {
        console.log( '*** index - demanem al server engegar INTERMITENT 3 LLUMS.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // engegar intermitent 3 llums



$( "#clkRepeticioUltra" ).click( function() {
    $.post( '/modificar_interval/Periode=ultra', function( page ) {
        console.log( '*** index - demanem al server PERIODE INFIM, velocitat ultra rapida.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // periode rapid

$( "#clkRepeticioRapida" ).click( function() {
    $.post( '/modificar_interval/Periode=rapid', function( page ) {
        console.log( '*** index - demanem al server PERIODE PETIT.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // periode rapid

$( "#clkRepeticioNormal" ).click( function() {
    $.post( '/modificar_interval/Periode=mitja', function( page ) {
        console.log( '*** index - demanem al server PERIODE MITJA.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // periode mitja

$( "#clkRepeticioLenta" ).click( function() {
    $.post( '/modificar_interval/Periode=lent', function( page ) {
        console.log( '*** index - demanem al server PERIODE GRAN.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ;
}) ; // periode lent

} ; // sem_ready()


// ++++ (2) FOTO_READY()

function foto_ready() {

$( "#clkFoto_esborrar_fitxer" ).click( function() {
    $.get( '/foto_esborrar_fitxer', function( page ) {
        console.log( '*** index - demanem al server ESBORRAR la foto.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // get(activar)
}) ; // esborrar foto


$( "#clkFoto_netejar" ).click( function() {
    $( "#imatge_webcam" ).attr( 'src', '/images/1-webcam.png' ) ;
// width="320" height="240">
    var szOut = '+++ netegem el espai de la foto, posant-hi /images/1-webcam.png' ;
    console.log( szOut ) ;
    $( "#contingut" ).html( szOut ) ; // show this HTML at specific <div>
}) ; // netejar foto


$( "#clkFoto_show_directe" ).click( function() {

var szFileFoto = '/images/directe.jpg' ;

    $( "#imatge_webcam" ).attr( 'src', szFileFoto ) ;
    var szOut = '*** index mostrar foto directe (' + szFileFoto + ')' ;
    console.log( szOut ) ;
    $( "#contingut" ).html( szOut ) ; // show this HTML at specific <div>
}) ; // mostrar foto

$( "#clkFoto_show" ).click( function() {
    $.get( '/mostrar_foto', function( page ) {
        console.log( '*** index - demanem al server la darrera foto.' ) ;
//      $( "#imatge_webcam" ).attr( 'src', page ) ;
        $( "#imatge_div" ).html( page ) ; //  <div id="imatge_div">
    }) ; // get(mostrar)
}) ; // mostrar foto


$( "#clkFoto_fer" ).click( function() {
    $.get( '/fer_foto', function( page ) {
        console.log( '*** index - demanem al server FER una foto.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // get(activar)
}) ; // fer foto

    console.log( '*** foto.htm - DOM ready event.' ) ;

} ; // foto_ready()


// ++++ (3) LOGON_READY()

function logon_ready() {

function preparemSendLogonClick() {

var logon_url = '/fer_logon' ;

    $( '#click_logon_send' ).click( function() { // when user clicks on logon() then ...

        var logon_data = {
            logon_usr: $( '#luser' ).val(),
            logon_pwd: $( '#lpwd' ).val()
        } ;

        var szURL = logon_url + '/nom_Logon=' + logon_data.logon_usr + '&pwd_Logon=' + logon_data.logon_pwd

        console.log( 'LOGON() URL is ('+ szURL +').' ) ;

//        $.post( logon_url, logon_data, function( page ){} ) ;

        event.preventDefault() ; // the default action of the event will not be triggered. http://api.jquery.com/event.preventdefault/

$.ajax({                         // as we can receive an "ok" or an "no ok" answer, we use the core $.ajax() method

    url: szURL,                  // The URL for the request

    data: {                      // The data to send (will be converted to a query string)
        logon_data
    },

    type: "POST",                // Whether this is a POST or GET request

    dataType : "html",           // The type of data we expect back

    success: function( page ){
//        alert( "OK" ) ;
        $( "#contingut" ).html( page ) ;

// posem al SPA_data (we are a SPA) la seguent sub-pagina inicial que veu el client : SEM.HTM

        $.get( '/sem.htm', function( page ) {
            console.log( '*** Demanem al server SEM.HTM, page user sees after LOGON.' ) ;
            $( "#SPA_data" ).html( page ) ; // show received HTML at specific <div>
        }) ; // get(logon.htm)

    },
    statusCode: {
        401: function() { $( "#contingut" ).html( (new Date).yyyymmdd() + ' --- Logon() user('+ logon_data.logon_usr +') not authorized' ) },
        402: function() { $( "#contingut" ).html( (new Date).yyyymmdd() + ' --- Logon() unavailable' ) },

        404: function( xhr ) {
            $( "#contingut" ).html( (new Date).hhmmss() + ' ' + xhr.responseText )
        },
        500: function() { $( "#contingut" ).html( (new Date).yyyymmdd() + ' --- Logon() Server error' ) }
    }
})

        return false ; // stop processing

    } ) ; // click()

} ; // preparemSendLogonClick()

    preparemSendLogonClick() ; // set code to service logon click

    console.log( '*** logon.htm - DOM ready event.' ) ;

} ; // logon_ready()



// ++++ (4) WHATSAPP_READY()

function wassa_ready() {

function preparemSend_Wassa_Tf_Txt_Click() {

var wurl = '/enviar_msg_whatsapp' ;

    $( '#wsend' ).click( function() {
        var wdata = {
            wdtel: $( '#wtel' ).val(),
            wdtxt: $( '#wtxt' ).val()
        } ; // wdata

//        console.log( '*** POST URL (' + wurl + ').' ) ;

        $.post( wurl, wdata, function( page ) {
            console.log( '*** mensaje enviado.' ) ;
            $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
        } ) ; // get
    } ) ; // click
} ; // preparemSend_Wassa_Tf_Txt_Click()

    preparemSend_Wassa_Tf_Txt_Click() ; //

    console.log( '*** wassa.htm - DOM ready event.' ) ;

} ; // wassa_ready()


// ++++ (5) HELP_READY()

function ajuda_ready() {

    console.log( '*** help.htm - DOM ready event.' ) ;

} ; // ajuda_ready()

