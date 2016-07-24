
// $( function() {
//     index_ready(); // DOM ready event
// } ) ; // DOM ready


$( function() { // DOM ready

    console.log( '*** client DOM ready.' ) ;
    $.get( '/initial.htm', function( page ) {  // posem al CONTENT (we are a SPA) la sub-pagina INITAL.HTML
        console.log( '*** Demanem al server INITIAL.HTM, initial SPA text.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // get(initial.htm)

// posar la data actual - aixi diferenciem re-loads - "Now is"
//    var szAra = 'Timestamp [' + (new Date).yyyymmdd() +', '+ (new Date).hhmmss() + ']' ;
//    $( "#my_date" ).html( szAra ) ; // show actual date

} ) ; // DOM ready


$( function() {

var wurl = '/enviar_msg_whatsapp' ;

    $( '#wsend' ).click( function() {
        var wdata = {
            wdtel: $( '#wtel' ).val(),
            wdtxt: $( '#wtxt' ).val()
        } ; // wdata

        console.log( '*** POST URL (' + wurl + ').' ) ;

        $.post( wurl, wdata, function( page ) {
            console.log( '*** mensaje enviado.' ) ;
        } ) ; // get
    } ) ; // click
} ) ; // send


$( "#clkId" ).click( function() {
    $.get( '/identificar', function( page ) {
        console.log( '*** index - demanem al server IDENTIFICAR.' ) ;
        $( "#contingut" ).html( page ) ; // show received HTML at specific <div>
    }) ; // get(activar)
}) ; // identificar

// --- ho fem amb el CLICK() del boto
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

// <br>
// <a href="#" id="clkFoto_show_directe">Directe</a>.

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

