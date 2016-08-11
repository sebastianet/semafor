
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
// 1.0.m - enviem missatges whatsapp des python
// 1.0.n - enviem missatges whatsapp des el browser client
// 1.0.o - engegar l'aplicacio en engegar RASPALL : /etc/rc.local
// 1.0.p - sequencia random-8
// 1.0.q - separem client.js per posar ( logon / semafor / foto / whatsapp / help ) al mateix lloc
// 1.1.a - SPA amb logon/semafor/foto/whatsapp/help - codi a CLIENT.JS
// 1.1.b - logoff() link 
// 1.1.c - sem.htm is a table
// 1.1.d - use req.session to save logged user name
// 1.1.e - security code in server, not in client; trace client IP
// 1.1.f - velocitat repeticio ultra rapida. Allow 'toor' logon.
// 1.1.g - espai mes gran per texte cap a whatsapp - missatge estat "msg whatsapp enviat ok"
// 1.1.h - quadern de bitacora amb 12 linies - szResultat sempre local.


// Conexionat del GPIO :
//     el 'yellow' correspon al pin numero 15, cable gris  - k_Groc
//     el 'red'    correspon al pin numero 16, cable negre - k_Vermell
//     el 'green'  correspon al pin numero 18, cable blanc - k_Verd

// How to run the app :
//     Server : engegar amb 'sudo node 1-sem.js >> sem.log &' - veure /etc/rc.local (alli ja ets "su")
//     Client intern : apuntar el browser a http://192.168.1.123:1212
//     Client extern :                      http://88.18.117.86:9009 (Sebas)
//     Client extern :                      http://79.156.26.75:9007 (Josan)

// Comandes reconegudes :
//     http://192.168.1.123:1212
//     http://192.168.1.123:1212/activar-sequencia-VAR
//     http://192.168.1.123:1212/parar-sequencia-VAR
//    curl "http://192.168.1.123:1212/fer_foto"
//    curl "http://192.168.1.123:1212/mostrar_foto"

// Documentacio :
//     projecte "base"        : https://github.com/sebastianet/wCDT
//     projecte actual        : https://github.com/sebastianet/semafor
//     Valid <a href="http://validator.w3.org/check?uri=referer">XHTML</a> | Valid <a href="http://jigsaw.w3.org/css-validator/check/referer">CSS</a>
//     filesystem             : https://nodejs.org/api/fs.html
//     logger                 : https://github.com/expressjs/morgan 
//     tancar ordenadament    : http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits/14032965#14032965
//     call python from node  : https://github.com/extrabacon/python-shell
//         rc = 1             : https://github.com/extrabacon/python-shell/issues/46
//     yowsup                 : https://github.com/tgalal/yowsup
//         rc 1               : https://github.com/tgalal/yowsup/issues/1702
//     set Interval           : https://nodejs.org/api/timers.html
//     session                ; https://github.com/expressjs/session

// Variables propies :
//     req.session.nom_usuari

// Temes pendents :
//     (*) enlloc de console.log() fer "bitacora(szOut)" per afegir timestamp a tots de cop i volta
//     (*) drop down menu amb els numeros de tf mes habituals (segons qui ha fet logon)
//     (*) abans de fer una foto, esborrar la anterior (encara en tenim el nom)
//     (*) provar des un mobil - la pantalla es molt petita !
//     (*) enviat missatge whatsapp amb una imatge des el browser
//     (*) fer LOGON() obligatori i fer una trassa de IPs que entren
//     (*) cron - tasca "netejar"
//     (*) obrir el router per accedir el client des Moscu - http://usuaris.tinet.cat/sag/rspi3.htm#rspi_obrir_ports
//     (*) obrir el router per actualitzar el software via SSH al port 22

// Pla de proves de correcte funcionament : 5_llista_de_proves.txt
// Descripcio del contingut global : /home/pi/contingut.txt
// Manual del usuari : /home/pi/semafor/manual_usuari.txt

// Missatges que envia el servidor :
//     szResultat = '+++ raspall001 - LOGON(' + szUserName + ') OK' ;
//     szResultat = '--- raspall002 - LOGON FAILED - invalid credentials' ;
//     szResultat = '--- raspall003 - Logon FAILED - already logged' ;
//     szResultat = '+++ raspall004 - Logoff' ;

// Estructura de la pagina - veure INDEX.HTM
//     a dalt tenim "peudepagina", jejeje
//     a baix tenim (status de fet) "contingut"
//     la part "variable" al mitg es diu "SPA_data"
//     hi podem posar
//         logon.htm
//         sem.htm
//         foto.htm
//         wassa.htm
//         ajuda.htm

// =========================================================================

// Moduls que ens calen :
// ======================

var express      = require( 'express' ) ;
var app = express() ;

var session      = require( 'express-session' ) ;    // express session
var bodyParser   = require( "body-parser" ) ;

var path         = require( 'path' ) ;
var logger       = require( 'morgan' ) ;             // logging middleware
var fs           = require( 'fs' ) ;                 // get JPG or PNG

var gpio         = require( 'rpi-gpio' ) ;           // GPIO pin access
var PythonShell  = require( 'python-shell' ) ;       // send commands to python


// les meves constants :
// =====================

const k_Verd     = 18 ;
const k_Groc     = 15 ;
const k_Vermell  = 16 ;


// les meves variables :
// =====================

var Q_sequenciador  = 0 ;               // estat del sequenciador := aturat ;
var myIntervalObject ;                  // used by clearInterval.
var myIntervalValue = 1000 ;            // slow = 3000, normal = 1000, fast = 500.
// var szResultat      = '' ;              // console and client return string
var myVersio        = 'v1.1.h' ;        // version identifier
var png_File        = '/home/pi/semafor/public/images/webcam/webcam.png' ; // created by python
var bitacora        = new Array( " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " " ) ; // 12 lines
var idx_bitacora    = 0 ;
var max_bitacora    = bitacora.length ;


// configuracio :
// ==============

     app.set( 'mPort', process.env.PORT || 1212 ) ;      // save port to use in APP var ; shall use 1212 (see docu)
     app.set( 'appHostname', require('os').hostname() ) ;

//    app.disable( 'etag' ) ;                             // try to prevent 304

// allow to use "req.session.*" header
     app.use( session( { secret: 'secretSebas', resave: false, saveUninitialized: false } ) ) ;  // encrypt session contents, allow "req.session.*" header

// tell Express application to load and server static files (if there any) from public folder:
     app.use( express.static( __dirname + '/public' ) );            // set the static files location /public/img will be /img for users
     app.use( express.static( path.join(__dirname, 'public' ) ) );  // objects from the ./public/ uri will be served from .\public\ dir
     app.use( '/', express.static( __dirname + '/public' ) ) ;      // serve whatever is in the 'public' folder at the URL /public/:filename

     app.use( bodyParser.urlencoded( { extended:true } ) ) ;

// eina per depurar el programa
     app.use( logger( 'dev' ) ) ;                         // tiny (minimal), dev (developer), common (apache)


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


function User_Is_Logged( Param_Sessio ) {

     var szResultIsLogged = 'Is there a user (' + Param_Sessio.nom_usuari + ') logged ?' ;
     console.log( szResultIsLogged ) ;

     if ( Param_Sessio && Param_Sessio.nom_usuari ) { // Check if session exists
          return true ;
     } else {
          return false ;
     } ;

} ; // User_Is_Logged()


function Poner_Bitacora ( szIn ) {

     console.log( 'Posar bitacora : ' + szIn ) ;                                          // first, write to console

     bitacora[ idx_bitacora ] = szIn ;                              // second, record for logging
     idx_bitacora = idx_bitacora + 1 ;
     if ( idx_bitacora === max_bitacora ) { idx_bitacora = 0 } ;
     return 0 ;

} ; // Poner_Bitacora()


function Listar_Bitacora () {

     console.log( 'Listar bitacora - inici = ' + idx_bitacora ) ;

     var szOut = " " ;
     var idx_out = idx_bitacora ; // oldest element

     do {

          console.log( 'Listar bitacora - idx = ' + idx_out ) ;

          szOut = szOut + bitacora[ idx_out ] ;
          idx_out = idx_out + 1 ;
          if ( idx_out === max_bitacora ) { idx_out = 0 } ;
     }
     while ( !( idx_out === idx_bitacora ) ) ;

     return szOut ;

} ; // Listar_Bitacora()


// ########################################### funcions propies del semafor 

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

var szAturar = '>>> Aturar totes les llums i els temporitzadors.' ;
     console.log( szAturar ) ;

     clearInterval( myIntervalObject ) ;

     apagarLuz( k_Groc ) ;
     apagarLuz( k_Vermell ) ;
     apagarLuz( k_Verd ) ;

     Q_sequenciador = 0 ;

} ; // aturar llums i temporitzador


function Gen_Random_0toMax( limitMax ) {

     var iFP = Math.random() ;                       // generate a (floating point) random number between [0 and 1)
//     console.log( 'I = [' + iFP + '].' ) ;

     var jINT = Math.floor( iFP * ( limitMax + 1 ) ) ;              // integer value [0..limitMax]
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
//     15           : random color [0..2]
//     16           : random color [0..7]

var iNum = 0 ;

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
               iNum = Gen_Random_0toMax( 2 ) ;                       // get a velue in [0..2]
               console.log( '>>> random color (%s) in [0..2].', iNum ) ;

               if ( iNum == 2 ) {                   // vermell
                    apagarLuz( k_Verd ) ;
                    apagarLuz( k_Groc ) ;
                    encenderLuz( k_Vermell ) ;
               } else {
                    if ( iNum == 1 ) {              // groc
                         apagarLuz( k_Verd ) ;
                         encenderLuz( k_Groc ) ;
                         apagarLuz( k_Vermell ) ;
                    } else {                        // verd
                         encenderLuz( k_Verd ) ;
                         apagarLuz( k_Groc ) ;
                         apagarLuz( k_Vermell ) ;
                    } ; // 0
               } ; // 2
          break ; // case 15

          case 16:
               iNum = Gen_Random_0toMax( 7 ) ;                       // get a velue in [0..7]
               console.log( '>>> random color (%s) in [0..7].', iNum ) ;

               switch ( iNum ) { // VAR

                    case 1:
                         apagarLuz( k_Verd ) ;
                         apagarLuz( k_Groc ) ;
                         encenderLuz( k_Vermell ) ;
                    break ; // case 1

                    case 2:
                         apagarLuz( k_Verd ) ;
                         encenderLuz( k_Groc ) ;
                         apagarLuz( k_Vermell ) ;
                    break ; // case 2

                    case 3:
                         apagarLuz( k_Verd ) ;
                         encenderLuz( k_Groc ) ;
                         encenderLuz( k_Vermell ) ;
                    break ; // case 3

                    case 4:
                         encenderLuz( k_Verd ) ;
                         apagarLuz( k_Groc ) ;
                         apagarLuz( k_Vermell ) ;
                    break ; // case 4

                    case 5:
                         encenderLuz( k_Verd ) ;
                         apagarLuz( k_Groc ) ;
                         encenderLuz( k_Vermell ) ;
                    break ; // case 5

                    case 6:
                         encenderLuz( k_Verd ) ;
                         encenderLuz( k_Groc ) ;
                         apagarLuz( k_Vermell ) ;
                    break ; // case 6

                    case 7:
                         encenderLuz( k_Verd ) ;
                         encenderLuz( k_Groc ) ;
                         encenderLuz( k_Vermell ) ;
                    break ; // case 7

                    default: // supose 0 - all lights OFF
                         apagarLuz( k_Verd ) ;
                         apagarLuz( k_Groc ) ;
                         apagarLuz( k_Vermell ) ;
               } ; // switch iNum

          break ; // case 16

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

    console.log( '+++ +++ +++ +++ +++ +++ +++ +++ app SEM starts. Versio [%s], HN [%s], TimeStamp [%s-%s].',
        myVersio, app.get( 'appHostname' ), (new Date).yyyymmdd(), (new Date).hhmmss() ) ;


// apaguem les 3 bombetes inicialment

gpio.setup( k_Groc, gpio.DIR_OUT, function( err ) {    // yellow
     apagarLuz( k_Groc ) ;
} ) ;

gpio.setup( k_Vermell, gpio.DIR_OUT, function( err ) { // red
     apagarLuz( k_Vermell ) ;
} ) ;

gpio.setup( k_Verd, gpio.DIR_OUT, function( err ) {    // green
     apagarLuz( k_Verd ) ;
} ) ;


// definim les branques a executar segon els que rebem del browser client

// app.get( '/', function (req, res)            { res.send( 'Hola, mundo !' ); });


app.post( '/menu_cerrar_aplicacion/Id=:ctrl_id', function ( req, res ) {

     if ( User_Is_Logged( req.session ) ) {

          res.sendFile( 'public/final.htm', {root: __dirname } ) ;

          aturar_Llums_i_Tot() ; // turn off lights and stop timer
          process.exit( 1 ) ;    // exit application - 0 means OK

     } else {
          res.sendFile( 'public/logon.htm', {root: __dirname } ) ;
          var szResultatCerrar = '--- Menu BYE - send LOGON.HTM' ;
          console.log( szResultatCerrar ) ;
     } ;

} ) ; // menu cerrar aplicacion


app.get( '/bitacora', function ( req, res ) {

var szResultatBitacora = Listar_Bitacora() ;

     console.log( 'Bitacora data request.' ) ;
     res.status( 200 ).send( szResultatBitacora ) ; 

} ) ; // send bitacora data to HELP sub-menu


app.get( '/identificar', function ( req, res ) {

var szResultatID  = '+++ app SEM JALL. ' ;

     szResultatID += 'Versio [' + myVersio + ']. ' ;
     szResultatID += 'HN [' + app.get( 'appHostname' ) + ']. ' ;
     szResultatID += 'usr [' + req.session.nom_usuari + ']. ' ;
     szResultatID += 'GYR [' + k_Verd + '/' + k_Groc + '/' + k_Vermell + ']. ' ;
     szResultatID += 'TimeStamp [' + (new Date).hhmmss() + '].' ;

     Poner_Bitacora ( szResultatID ) ;         // first send to console and log ...
     res.status( 200 ).send( szResultatID ) ;  // ... then send to client

} ) ; // menu Id


app.get( '/menu_semaforo', function ( req, res ) {
var szResMenuSem ;
     if ( User_Is_Logged( req.session ) ) {
          res.sendFile( 'public/sem.htm', {root: __dirname } ) ;
          szResMenuSem = '+++ Menu SEM - send SEM.HTM' ;
     } else {
          res.sendFile( 'public/logon.htm', {root: __dirname } ) ;
          szResMenuSem = '--- Menu SEM - send LOGON.HTM' ;
     } ;
     console.log( szResMenuSem ) ;
} ) ; // menu(semaforo)

app.get( '/menu_foto', function ( req, res ) {
var szResMenuFoto ;
     if ( User_Is_Logged( req.session ) ) {
          res.sendFile( 'public/foto.htm', {root: __dirname } ) ;
          szResMenuFoto = '+++ Menu FOTO - send FOTO.HTM' ;
     } else {
          res.sendFile( 'public/logon.htm', {root: __dirname } ) ;
          szResMenuFoto = '--- Menu FOTO - send LOGON.HTM' ;
     } ;
     console.log( szResMenuFoto ) ;
} ) ; // menu(foto)

app.get( '/menu_wassa', function ( req, res ) {
var szResMenuWassa ;
     if ( User_Is_Logged( req.session ) ) {
          res.sendFile( 'public/wassa.htm', {root: __dirname } ) ;
          szResMenuWassa = '+++ Menu WASSA - send WASSA.HTM' ;
     } else {
          res.sendFile( 'public/logon.htm', {root: __dirname } ) ;
          szResMenuWassa = '--- Menu WASSA - send LOGON.HTM' ;
     } ;
     console.log( szResMenuWassa ) ;
} ) ; // menu(wassa)

app.get( '/menu_bye', function ( req, res ) {
var szResMenuBye ;
     if ( User_Is_Logged( req.session ) ) {
          res.sendFile( 'public/bye.htm', {root: __dirname } ) ;
          szResMenuBye = '+++ Menu BYE - send BYE.HTM' ;
     } else {
          res.sendFile( 'public/logon.htm', {root: __dirname } ) ;
          szResMenuBye = '--- Menu BYE - send LOGON.HTM' ;
     } ;
     console.log( szResMenuBye ) ;
} ) ; // menu(bye)


app.post( '/menu_apagar_llum/Color=:res_color_llum', function ( req, res ) {

var Apagar_Llum_Color = req.params.res_color_llum ;
var szResultatApagar = '>>> Menu apagar llum (' + Apagar_Llum_Color + '). ' ;

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
     szResultatApagar += '+++ tots els llums apagats.' ;
     console.log( szResultatApagar ) ;
     res.status( 200 ).send( szResultatApagar ) ; 

} ) ; // menu apagar llum


app.post( '/menu_encendre_llum/Color=:res_color_llum', function ( req, res ) {

var Encendre_Llum_Color = req.params.res_color_llum ;
var szResultatEncendre = '>>> Menu encendre llum (' + Encendre_Llum_Color + '). ' ;

     if ( Encendre_Llum_Color == 'verd' ) {
          encenderLuz( k_Verd ) ;
          szResultatEncendre += '+++ llum verda encesa.' ;
     } else if ( Encendre_Llum_Color == 'groc' ) {
          encenderLuz( k_Groc ) ;
          szResultatEncendre += '+++ llum groc ences.' ;
     } else if ( Encendre_Llum_Color == 'vermell' ) {
          encenderLuz( k_Vermell ) ;
          szResultatEncendre += '+++ llum vermell ences.' ;
     } else if ( Encendre_Llum_Color == 'tres_llums' ) {
          encenderLuz( k_Verd ) ;
          encenderLuz( k_Groc ) ;
          encenderLuz( k_Vermell ) ;
          szResultatEncendre += '+++ 3 llums encesos.' ;
     } else {
          szResultatEncendre += '--- color (' + Encendre_Llum_Color + ') no reconegut.' ;
     } ;

     console.log( szResultatEncendre ) ;
     res.status( 200 ).send( szResultatEncendre ) ; 

} ) ; // menu encendre llum


// ######################################################################################################### //
//                                                                                                           //
// Fer logon()                                                                                               //
//                                                                                                           //
// ######################################################################################################### //

app.post( '/fer_logon/nom_Logon=:req_username&pwd_Logon=:req_pwd', function ( req, res ) {

var szUserName = req.params.req_username ;
var szUser_Pwd = req.params.req_pwd ;

var chSel = szUser_Pwd.charAt(0) ;

var headers = req.headers ;
var userAgent = headers[ 'user-agent' ] ;

var szResultatLogon ;

//     console.log( '>>> ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.' ) ;
//     console.log( req.headers ) ;
//     console.log( req.connection ) ;
//     console.log( req.connection.remoteAddress ) ;
//     console.log( '>>> ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.' ) ;

var Remote_IP = req.connection.remoteAddress ;

     console.log( '>>> Menu Logon() - usr (%s) pwd (%s) IP(%s).', szUserName, szUser_Pwd, req.connection.remoteAddress ) ;
//     console.log( '>>> Menu Logon() - usr (%s) pwd (%s) ch(%s) ua(%s).', szUserName, szUser_Pwd, chSel, userAgent ) ;

var Normal_User_Logging = (  ( User_Is_Logged( req.session ) ) && ( !(szUserName === 'toor') )  ) ;

     if ( Normal_User_Logging ) {
          szResultatLogon = '--- raspall003 - Logon FAILED - already logged' ;
          console.log( szResultatLogon ) ;
          res.status( 404 ).send( szResultatLogon ) ; 
     } else {

          if ( chSel == '.' ) {
               req.session.nom_usuari = szUserName ;
               szResultatLogon = '+++ raspall001 - Logon user (' + szUserName + ') OK, remote IP (' + Remote_IP + ')' ;
               Poner_Bitacora ( szResultatLogon ) ;         // first send to console and log ...
               res.status( 200 ).send( szResultatLogon ) ;  // ... then send to client
          } else {
               szResultat = '--- raspall002 - Logon FAILED - invalid credentials' ;
               console.log( szResultatLogon ) ;
               res.status( 404 ).send( szResultatLogon ) ; 
          } ;
     } ;

} ) ; // fer logon


app.get( '/fer_logoff', function ( req, res ) {

var szLogoff = '+++ raspall004 - Logoff user (' + req.session.nom_usuari + ').' ;

     req.session.nom_usuari = '' ;   // nobody logged in
     delete req.session.nom_usuari ;

     Poner_Bitacora ( szLogoff ) ;         // first send to console and log ...
     res.status( 200 ).send( szLogoff ) ;  // ... then send result to client

} ) ; // fer logoff


// app.post( '/enviar_msg_whatsapp/ParamTfNum=:req_tf_num', function ( req, res ) {
app.post( '/enviar_msg_whatsapp', function ( req, res ) {

var python_options = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: '/usr/local/bin',
  args: [ 'demos',  '-c', '/usr/local/bin/mydetails',  '-s', '34666777888',  'Envio des NODEJS' ]
} ;

var szResSndWassa ;

     console.log( 'posted ' + JSON.stringify( req.body ) ) ; // dump request body

// agafar num tf i texte del BODY
     
var WhatsApp_Tf_Number = req.body.wdtel ;
var WhatsApp_Msg_Text  = '[' + (new Date).hhmmss() + '] ' + req.body.wdtxt ;

     console.log( '>>> Menu enviar msg WhatsApp via python. Tf REQ param is (' + WhatsApp_Tf_Number + '). ' ) ;

     console.log( '>>> Menu enviar msg WhatsApp via python. +++ ARGS is (' + python_options.args + '). ' ) ;
     python_options.args[4] = WhatsApp_Tf_Number ;
     python_options.args[5] = WhatsApp_Msg_Text ;
     console.log( '>>> Menu enviar msg WhatsApp via python. --- ARGS is (' + python_options.args + '). ' ) ;

     PythonShell.run( 'yowsup-cli', python_options, function( err, results ) {

//          console.log( '(+) Snd WhatsApp Python ERR are (%j).', err ) ;
//          console.log( JSON.stringify( err ) ) ;
//          if ( err ) throw err ;
          var miRC = err.exitCode ;
          szResSndWassa = '(+) Snd WhatsApp Python RC (' + miRC + ').' ;

          console.log( szResSndWassa ) ;
          res.status( 200 ).send( szResSndWassa ) ; 
     } ) ; // run

} ) ; // enviar mensage whatsapp


app.get( '/foto_esborrar_fitxer', function (req, res) {

var szResultatEsborrar = '+++ file (' + png_File + ') deleted successfully' ;
     borrar_Fichero( png_File ) ;
     console.log( szResultatEsborrar ) ;
     res.status( 200 ).send( szResultatEsborrar ) ; 

} ) ; // foto esborrar


app.get( '/fer_foto', function (req, res) {

var python_options = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: '/home/pi/semafor',
  args: ['value1', 'value2', 'value3']
} ;

     console.log( '>>> Menu fer foto via Python.' ) ;

// esborrem primer la foto anterior - tenim el seu nom a png_File ?

     PythonShell.run( '2_foto.py', python_options, function( err, results ) {
          if ( err ) throw err ;
          console.log( '(+) Python results are (%j).', results ) ; // results is an array consisting of messages collected during execution
          png_File = String( results ) ;                           // convert to string

var szResultatFerFoto = '+++ foto feta. Fitxer ('+ png_File + ').' ;
          res.status( 200 ).send( szResultatFerFoto ) ; 
     } ) ; // run

} ) ; // fer foto


app.get( '/mostrar_foto', function (req, res) {

     console.log( '>>> Menu mostrar foto (%s).', png_File ) ;

     var imatge = fs.readFileSync( png_File ) ;

     res.writeHead( 200, { 'Content-Type': 'text/html' } ) ;
     res.write( '<img id="imatge_webcam" width="320" height="240" src="data:image/png;base64,' ) ;
     res.write( new Buffer(imatge).toString( 'base64' ) ) ;
     res.end( '"/>' ) ;

} ) ; // mostrar foto


app.post( '/modificar_interval/Periode=:res_nou_periode', function (req, res) { 

var Nou_Periode = req.params.res_nou_periode ;
var szResultatInterval = '>>> Menu modificar periode (' + Nou_Periode + '). ' ;

     if ( Nou_Periode == 'ultra' ) {
          myIntervalValue = 300 ;
          szResultatInterval += '+++ periode 300, velocitat ultra.' ;
     } else if ( Nou_Periode == 'rapid' ) {
          myIntervalValue = 500 ;
          szResultatInterval += '+++ periode 500, velocitat rapida.' ;
     } else if ( Nou_Periode == 'mitja' ) {
          myIntervalValue = 1000 ;
          szResultatInterval += '+++ periode 1000, velocitat mitja.' ;
     } else if ( Nou_Periode == 'lent' ) {
          myIntervalValue = 3000 ;
          szResultatInterval += '+++ periode 3000, velocitat lenta.' ;
     } else {
          szResultatInterval += '--- valor (' + Nou_Periode + ') no reconegut.' ;
     } ;

     console.log( szResultatInterval ) ;
     res.status( 200 ).send( szResultatInterval ) ; 

} ) ; // modificar interval intermitencies


// Parametres d'entrada al SEQUENCIADOR, determinats pel web client

app.post( '/menu_engegar_sequencia/Tipus=:res_tipus_sequencia', function (req, res) { 

var Nou_Tipus_Sequencia = req.params.res_tipus_sequencia ;
var szResSeq = '>>> Menu engegar sequencia (' + Nou_Tipus_Sequencia + '). ' ;

     switch ( Nou_Tipus_Sequencia ) {

          case 'intermitent_verd':
               szResSeq += '+++ color verd. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 1 ;
          break ;

          case 'intermitent_groc':
               szResSeq += '+++ color groc. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 3 ;
          break ;

          case 'intermitent_vermell':
               szResSeq += '+++ color vermell. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 5 ;
          break ;

          case 'intermitent_tres_llums':
               szResSeq += '+++ 3 colors. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 7 ;
          break ;

          case 'sequencia_VAR':
               szResSeq += '+++ sequencia VAR. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 9 ;
          break ;

          case 'sequencia_RAV':
               szResSeq += '+++ sequencia RAV. T (' + myIntervalValue + ').' ;
               Q_sequenciador = 12 ;
          break ;

          case 'sequencia_random_de_tres':
               szResSeq += '+++ sequencia Random (0..2). T (' + myIntervalValue + ').' ;
               Q_sequenciador = 15 ;
          break ;

          case 'sequencia_random_de_vuit':
               szResSeq += '+++ sequencia Random (0..7). T (' + myIntervalValue + ').' ;
               Q_sequenciador = 16 ;
          break ;

          default:
               szResSeq += '--- valor (' + Nou_Tipus_Sequencia + ') no reconegut.' ;
               Q_sequenciador = 0 ;

     } ; // switch Nou_Tipus_Sequencia


     if ( Q_sequenciador != 0 ) {

          clearInterval( myIntervalObject ) ; // prevent overlapping

          myIntervalObject = setInterval( Mi_Sequenciador, myIntervalValue ) ; // schedules repeated execution of 'callback' every 'delay' mSg.
                                                                               // returns a Timeout for use with clearTimeout().
     } ;

     console.log( szResSeq ) ;
     res.status( 200 ).send( szResSeq ) ; 

} ) ; // engegar sequencia


// creacio del servidor :
// ======================

var server = app.listen( app.get( 'mPort' ), '192.168.1.123', function () {

     var host = server.address().address ;
     var port = server.address().port ;
     console.log( '>>> App listening at http://%s:%s', host, port ) ;

} ) ; // server

