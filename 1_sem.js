
// Semafor manegat des un browser via node en raspberry.
//     Sebastia Altemir, Juny de 2016,  sebastiasebas@gmail.com

// Versions ( displayed via 'myVersio')
// 1.0.a - inici del codi amb express
// 1.0.b - send PNG file
// 1.0.c - myIntervalValue changed from client
// 1.0.d - try 'disable' to prevent 304 - it works
// 1.0.e - implement 'identificar' to diagnose 304
// 1.0.f - delete PNG file from menu
// 1.0.g - PNG filename (webcam pic) has timestamp and is sent from server
// 1.0.h - sequenciador : intermitent verd
// 1.0.i - fer servir CONST per definir el pin de cada color.
// 1.0.j - sequenciador : intermitent tres llums
// 1.0.k - seq RAV
// 1.0.l - ramdom color


// Conexionat del GPIO :
//     el 'yellow' correspon al pin numero 15, cable gris  - k_Groc
//     el 'red'    correspon al pin numero 16, cable negre - k_Vermell
//     el 'green'  correspon al pin numero 18, cable blanc - k_Verd

// How to run the app :
//     Server : engegar amb 'sudo node 1-sem.js'
//     Client intern : apuntar el browser a 192.168.1.123:1212
//     Client extern : http://88.18.117.86:9009/

// Comandes reconegudes :
//     http://192.168.1.123:1212
//     http://192.168.1.123:1212/activar-sequencia-VAR
//     http://192.168.1.123:1212/parar-sequencia-VAR
//     http://192.168.1.123:1212/mostrar-foto
//     http://192.168.1.123:1212/hacer-foto

// Documentacio :
//     filesystem          : https://nodejs.org/api/fs.html
//     tancar ordenadament : http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits/14032965#14032965

// Temes pendents :
//     (*) abans de fer una foto, esborrar la anterior (encara en tenim el nom)
//     (*) cron - tasca "netejar"
//     (*) obrir el router per accedir el client des Moscu - http://usuaris.tinet.cat/sag/rspi3.htm#rspi_obrir_ports
//     (*) obrir el router per actualitzar el software via SSH al port 22
//     (*) provar des un mobil - la pantalla es molt petita !
//     (*) tancar l'aplicacio des el client
//     (*) engegar l'aplicacio en engegar el Raspi
//     (*) enviat missatge whatsapp (amb una imatge) des el browser
//     (*) identificar el usuari al client
//     (*) random(3 bits) -> 8 valors

// Pla de proves de correcte funcionament : 5_llista_de_proves.txt

// =========================================================================

// Moduls que ens calen :
// ======================

var express = require( 'express' ) ;
var app = express() ;

var path         = require( 'path' ) ;
var logger       = require( 'morgan' ) ;             // logging middleware
var fs           = require( 'fs' ) ;                 // get JPG or PNG

var gpio         = require( 'rpi-gpio' ) ;           // GPIO pin access
var PythonShell  = require( 'python-shell' ) ;       // to send commands to python


// les meves constants :
const k_Verd     = 18 ;
const k_Groc     = 15 ;
const k_Vermell  = 16 ;


// les meves variables :
// =====================

var Q_sequenciador  = 0 ;               // estat del sequenciador := aturat ;
var PinEncendido    = k_Vermell ;       // to cycle thru color sequence.
var myIntervalObject ;                  // used by clearInterval.
var myIntervalValue = 1000 ;            // slow = 3000, normal = 1000, fast = 500.
var szResultat      = '' ;              // console and client return string
var myVersio        = 'v1.0.l' ;        // version identifier
var png_File        = '/home/pi/semafor/public/images/webcam/webcam.png' ; // created by python


// configuracio :
// ==============

     app.set( 'mPort', process.env.PORT || 1212 ) ;      // save port to use in APP var ; shall use 1212 (see docu)
//    app.disable( 'etag' ) ;                             // try to prevent 304

// tell Express application to load and server static files (if there any) from public folder:
     app.use( express.static( __dirname + '/public' ) );            // set the static files location /public/img will be /img for users
     app.use( express.static( path.join(__dirname, 'public' ) ) );  // objects from the ./public/ uri will be served from .\public\ dir
     app.use( '/', express.static( __dirname + '/public' ) ) ;      // serve whatever is in the 'public' folder at the URL /public/:filename

// eina per depurar el programa
     app.use( logger( 'dev' ) ) ;                     // https://github.com/expressjs/morgan - tiny (minimal), dev (developer), common (apache)


// definim algunes funcions :
// ==========================

Date.prototype.yyyymmdd = function ( ) {                            // nova funcio yyymmdd de Date() - at server

     var yyyy = this.getFullYear().toString();                                    
     var mm   = (this.getMonth()+1).toString(); // getMonth() is zero-based         
     var dd   = this.getDate().toString();
     return yyyy + '/' + (mm[1]?mm:'0'+mm[0]) + '/' + (dd[1]?dd:'0'+dd[0]);

}; // yyyymmdd()

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


function encenderLuz( miPin ) { // 
        
     var szResultON = (new Date).hhmmss() + ' Encender luz (' + miPin + '). ' ;
     gpio.write( miPin, true, function(err) {
          if (err) throw err;
          szResultON += '(+++) Written ON to pin (' + miPin + ').' ;
          console.log( szResultON ) ;
     }); // GPIO write()

} ; // encenderLuz()

function apagarLuz( miPin ) { // 
        
     var szResultOFF = (new Date).hhmmss() + ' Apagar luz (' + miPin + '). ' ;
     gpio.write( miPin, false, function(err) {
          if (err) throw err;
          szResultOFF += '(---) Written OFF to pin (' + miPin + ').' ;
          console.log( szResultOFF ) ;
     });

} ; // apagarLuz()


function aturar_Llums_i_Tot() {

//     szResultat = '>>> Aturar totes les llums i els temporitzadors.' ;
//     console.log( szResultat ) ;

     clearInterval( myIntervalObject ) ;
     apagarLuz( k_Groc ) ;
     apagarLuz( k_Vermell ) ;
     apagarLuz( k_Verd ) ;

     Q_sequenciador = 0 ;

} ; // aturar llums i temporitzador


function cambiarLuces() {

     console.log( '>>> Cambiar luces (%s).', PinEncendido ) ;
     apagarLuz( PinEncendido ) ;
     if ( PinEncendido == k_Groc ) { PinEncendido = k_Vermell } else {
          if ( PinEncendido == k_Vermell ) { PinEncendido = k_Verd } else {
               if ( PinEncendido == k_Verd ) { PinEncendido = k_Groc } ;
          } ;
     } ;
     encenderLuz( PinEncendido ) ;

} ; // cambiarLuces()


function Gen_Random_0to2() {

     var iFP = Math.random() ;                       // generate a (floating point) random number between [0 and 1)
//     console.log( 'I = [' + iFP + '].' ) ;

     var jINT = Math.floor( iFP * 3 ) ;              // integer value [0..2]
//     console.log( 'J = [' + jINT + '].' ) ;

     return jINT ;                                   // return a value 

} ; //


function Mi_Sequenciador() {

// sequencies implementades :
//      1 - 2       : llum verd on and off
//      3 - 4       : llum groc on and off
//      5 - 6       : llum vermell on and off
//      7 - 8       : 3 llums on and off
//      9 - 10 - 11 : verde - amarillo - rojo (VAR)
//     12 - 13 - 14 : rojo - amarillo - verde (RAV)
//     15           : random color

     console.log( '>>> Sequenciador, q (%s), T (%s).', Q_sequenciador, myIntervalValue ) ;

     switch ( Q_sequenciador ) {

          case 0:
               aturar_Llums_i_Tot() ;
          break ; // case 0

          case 1:
               encenderLuz( k_Verd ) ;
               Q_sequenciador = 2 ;
          break ; // case 1

          case 2:
               apagarLuz( k_Verd ) ;
               Q_sequenciador = 1 ;
          break ; // case 2

          case 3:
               encenderLuz( k_Groc ) ;
               Q_sequenciador = 4 ;
          break ; // case 3

          case 4:
               apagarLuz( k_Groc ) ;
               Q_sequenciador = 3 ;
          break ; // case 4

          case 5:
               encenderLuz( k_Vermell ) ;
               Q_sequenciador = 6 ;
          break ; // case 5

          case 6:
               apagarLuz( k_Vermell ) ;
               Q_sequenciador = 5 ;
          break ; // case 6

          case 7:
               encenderLuz( k_Verd ) ;
               encenderLuz( k_Groc ) ;
               encenderLuz( k_Vermell ) ;
               Q_sequenciador = 8 ;
          break ; // case 7

          case 8:
               apagarLuz( k_Verd ) ;
               apagarLuz( k_Groc ) ;
               apagarLuz( k_Vermell ) ;
               Q_sequenciador = 7 ;
          break ; // case 8

          case 9:
               encenderLuz( k_Verd ) ;
               apagarLuz( k_Vermell ) ;
               Q_sequenciador = 10 ;
          break ; // case 9

          case 10:
               encenderLuz( k_Groc ) ;
               apagarLuz( k_Verd ) ;
               Q_sequenciador = 11 ;
          break ; // case 10

          case 11:
               encenderLuz( k_Vermell ) ;
               apagarLuz( k_Groc ) ;
               Q_sequenciador = 9 ;
          break ; // case 11

          case 12:
               encenderLuz( k_Vermell ) ;
               apagarLuz( k_Verd ) ;
               Q_sequenciador = 13 ;
          break ; // case 12

          case 13:
               encenderLuz( k_Groc ) ;
               apagarLuz( k_Vermell ) ;
               Q_sequenciador = 14 ;
          break ; // case 13

          case 14:
               encenderLuz( k_Verd ) ;
               apagarLuz( k_Groc ) ;
               Q_sequenciador = 12 ;
          break ; // case 14

          case 15:
               var iNum = Gen_Random_0to2() ;
               console.log( '>>> random color (%s).', iNum ) ;
          break ; // case 15


          default:
               Q_sequenciador = 0 ;

     } ; // switch Q_sequenciador

} ; // Mi_Sequenciador


function borrar_Fichero( nom_Fitxer_Esborrar ) {

     console.log( '>>> borrarfichero (%s).', nom_Fitxer_Esborrar ) ;
     fs.stat( nom_Fitxer_Esborrar, function (err, stats) {
//          console.log(stats);                                    // here we got all information of file in stats variable

//          if (err) {
//               return console.error(err);
//          } ;

          fs.unlink( nom_Fitxer_Esborrar, function(err) {
// ignore errors               if(err) return console.log(err);
          } ) ; // unlink
     }); // stat

} ; // borrar_Fichero()



// Comencem :
// ==========

// Escriure un missatge inicial a la consola

    app.set( 'appHostname', require('os').hostname() ) ;
    console.log( '+++ +++ +++ +++ +++ +++ +++ +++ app SEM starts. Versio [%s], HN [%s], TimeStamp [%s].', myVersio, app.get('appHostname'), (new Date).yyyymmdd() ) ;


// apaguem les 3 bombetes inicialment

gpio.setup( k_Groc, gpio.DIR_OUT, function(err) { // yellow
     apagarLuz( k_Groc ) ;
} ) ;

gpio.setup( k_Vermell, gpio.DIR_OUT, function(err) { // red
     apagarLuz( k_Vermell ) ;
} ) ;

gpio.setup( k_Verd, gpio.DIR_OUT, function(err) { // green
     apagarLuz( k_Verd ) ;
} ) ;


// definim les branques a executar segon els que rebem del browser client

// app.get( '/', function (req, res)            { res.send( 'Hola, mundo !' ); });


app.post( '/menu_cerrar_aplicacion', function ( req, res ) {

     aturar_Llums_i_Tot() ; // turn off lights and stop timer
     process.exit( 1 ) ;    // exit application - 0 means OK

} ) ; // menu cerrar aplicacion


app.get( '/identificar', function (req, res) {

     szResultat  = '+++ app SEM JA. ' ;
     szResultat += 'Versio [' + myVersio + ']. ' ;
     szResultat += 'HN [' + app.get( 'appHostname' )+ ']. ' ;
     szResultat += 'GYR [' + k_Verd + '/' + k_Groc + '/' + k_Vermell + ']. ' ;
     szResultat += 'TimeStamp [' + (new Date).hhmmss() + '].' ;
     console.log( szResultat ) ;
     res.status( 200 ).send( szResultat ) ; 

} ) ; // menu Id


app.post( '/menu_apagar_llum/Color=:res_color_llum', function ( req, res ) {

     var Apagar_Llum_Color = req.params.res_color_llum ;
     szResultat = '>>> Menu apagar llum (' + Apagar_Llum_Color + '). ' ;

//     if ( Apagar_Llum_Color == 'verd' ) {
//          apagarLuz( k_Verd ) ;
//          szResultat = '+++ llum verda apagada.' ;
//     } else if ( Apagar_Llum_Color == 'groc' ) {
//          apagarLuz( k_Groc ) ;
//          szResultat = '+++ llum groc apagat.' ;
//     } else if ( Apagar_Llum_Color == 'vermell' ) {
//          apagarLuz( k_Vermell ) ;
//          szResultat = '+++ llum vermell apagat.' ;
//     } else {
//          szResultat = '--- color (' + Apagar_Llum_Color + ') no reconegut.' ;
//     } ;

     aturar_Llums_i_Tot() ;
     szResultat += '+++ tots els llums apagats.' ;
     console.log( szResultat ) ;
     res.status( 200 ).send( szResultat ) ; 

} ) ; // menu apagar llum


app.post( '/menu_encendre_llum/Color=:res_color_llum', function ( req, res ) {

     var Encendre_Llum_Color = req.params.res_color_llum ;
     console.log( '>>> Menu encendre llum (%s).', Encendre_Llum_Color ) ;

     if ( Encendre_Llum_Color == 'verd' ) {
          encenderLuz( k_Verd ) ;
          szResultat = '+++ llum verda encesa.' ;
     } else if ( Encendre_Llum_Color == 'groc' ) {
          encenderLuz( k_Groc ) ;
          szResultat = '+++ llum groc ences.' ;
     } else if ( Encendre_Llum_Color == 'vermell' ) {
          encenderLuz( k_Vermell ) ;
          szResultat = '+++ llum vermell ences.' ;
     } else if ( Encendre_Llum_Color == 'tres_llums' ) {
          encenderLuz( k_Verd ) ;
          encenderLuz( k_Groc ) ;
          encenderLuz( k_Vermell ) ;
          szResultat = '+++ 3 llums encesos.' ;
     } else {
          szResultat = '--- color (' + Encendre_Llum_Color + ') no reconegut.' ;
     } ;

     console.log( szResultat ) ;
     res.status( 200 ).send( szResultat ) ; 

} ) ; // menu encendre llum


app.post( '/enviar_msg_whatsapp/ParamTfNum=:req_tf_num', function (req, res) {

// agafar parametres : num tf i texte

     var WhatsApp_Tf_Number = req.params.req_tf_num ;
     console.log( '>>> Menu enviar msg WhatsApp via python. Tf param is (' + WhatsApp_Tf_Number + '). ' ) ;

var python_options = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: '/usr/local/bin',
  args: ['demos  -c /usr/local/bin/mydetails   -s 34638015371  SEMnodeMsg']
} ;

//     PythonShell.run( 'yowsup-cli', function( err, results ) {
     PythonShell.run( '/usr/local/bin/yowsup-cli', function( err, results ) {
          if ( err ) throw err ;
          console.log( '(+) Snd WhatsApp Python results are (%j).', results ) ; // results is an array consisting of messages collected during execution
          var sndRC = String( results ) ;                           // convert to string

          szResultat = '+++ whatsapp msg sent. RC ('+ sndRC + ').' ;
          res.status( 200 ).send( szResultat ) ; 
     } ) ; // run

} ) ; // enviar mensage whatsapp


app.get( '/foto_esborrar_fitxer', function (req, res) {

     borrar_Fichero( png_File ) ;
     szResultat = '+++ file (' + png_File + ') deleted successfully' ;
     console.log( szResultat ) ;
     res.status( 200 ).send( szResultat ) ; 

} ) ; // foto esborrar


app.get( '/fer_foto', function (req, res) {

var python_options = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: '/home/pi/semafor',
  args: ['value1', 'value2', 'value3']
} ;

     console.log( '>>> Menu hacer foto via Python.' ) ;

// esborrem primer la foto anterior - tenim el seu nom a png_File ?

     PythonShell.run( '2_foto.py', function( err, results ) {
          if ( err ) throw err ;
          console.log( '(+) Python results are (%j).', results ) ; // results is an array consisting of messages collected during execution
          png_File = String( results ) ;                           // convert to string

          szResultat = '+++ foto feta. Fitxer ('+ png_File + ').' ;
          res.status( 200 ).send( szResultat ) ; 
     } ) ; // run

} ) ; // fer foto


app.get( '/mostrar_foto', function (req, res) {

     console.log( '>>> Menu mostrar foto (%s).', png_File ) ;

     var imatge = fs.readFileSync( png_File ) ;

     res.writeHead( 200, { 'Content-Type': 'text/html' } ) ;
     res.write( '<img id="imatge_webcam" src="data:image/png;base64,' ) ;
     res.write( new Buffer(imatge).toString( 'base64' ) ) ;
     res.end( '"/>' ) ;

} ) ; // mostrar foto


app.post( '/modificar_interval/Periode=:res_nou_periode', function (req, res) { 

     var Nou_Periode = req.params.res_nou_periode ;
     console.log( '>>> Menu modificar periode (%s).', Nou_Periode ) ;

     if ( Nou_Periode == 'rapid' ) {
          myIntervalValue = 500 ;
          szResultat = '+++ periode 500, velocitat rapida.' ;
     } else if ( Nou_Periode == 'mitja' ) {
          myIntervalValue = 1000 ;
          szResultat = '+++ periode 1000, velocitat mitja.' ;
     } else if ( Nou_Periode == 'lent' ) {
          myIntervalValue = 3000 ;
          szResultat = '+++ periode 3000, velocitat lenta.' ;
     } else {
          szResultat = '--- valor (' + Nou_Periode + ') no reconegut.' ;
     } ;

     console.log( szResultat ) ;
     res.status( 200 ).send( szResultat ) ; 

} ) ; // modificar interval intermitencies


// Parametres d'entrada al SEQUENCIADOR, determinats pel web client

app.post( '/menu_engegar_sequencia/Tipus=:res_tipus_sequencia', function (req, res) { 

     var Nou_Tipus_Sequencia = req.params.res_tipus_sequencia ;
     szResultat = '>>> Menu engegar sequencia (' + Nou_Tipus_Sequencia + '). ' ;

     switch ( Nou_Tipus_Sequencia ) {

          case 'intermitent_verd':
               szResultat += '+++ color verd. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 1 ;
          break ;

          case 'intermitent_groc':
               szResultat += '+++ color groc. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 3 ;
          break ;

          case 'intermitent_vermell':
               szResultat += '+++ color vermell. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 5 ;
          break ;

          case 'intermitent_tres_llums':
               szResultat += '+++ 3 colors. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 7 ;
          break ;

          case 'sequencia_VAR':
               szResultat += '+++ sequencia VAR. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 9 ;
          break ;

          case 'sequencia_RAV':
               szResultat += '+++ sequencia RAV. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 12 ;
          break ;

          case 'sequencia_random':
               szResultat += '+++ sequencia Random. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 15 ;
          break ;

          default:
               szResultat += '--- valor (' + Nou_Tipus_Sequencia + ') no reconegut.' ;
               Q_sequenciador = 0 ;

     } ; // switch Nou_Tipus_Sequencia


     if ( Q_sequenciador != 0 ) {
          myIntervalObject = setInterval( Mi_Sequenciador, myIntervalValue ) ; // schedules repeated execution of 'callback' every 'delay' mSg.
     } ;

     console.log( szResultat ) ;
     res.status( 200 ).send( szResultat ) ; 

} ) ; // engegar sequencia intermitent verd


// creacio del servidor :
// ======================

var server = app.listen( app.get( 'mPort' ), '192.168.1.123', function () {

     var host = server.address().address ;
     var port = server.address().port ;
     console.log( '>>> App listening at http://%s:%s', host, port ) ;

} ) ; // server

