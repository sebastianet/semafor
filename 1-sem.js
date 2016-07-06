
// Semafor manegat des un browser via node en raspberry.
// Sebastia Altemir, Juny de 2016.
// sebastiasebas@gmail.com

// Versions ( displayed via "myVersio")
// 1.0.a - inici del codi amb express
// 1.0.b - send PNG file
// 1.0.c - myIntervalValue changed from client

// Conexionat del GPIO :
// el "yellow" correspon al pin numero 15, cable gris
// el "red"    correspon al pin numero 16, cable negre
// el "green"  correspon al pin numero 18, cable blanc

// Engegar amb "sudo node 1-sem.js"
// Apuntar el browser a 192.168.1.123:1212
// Comandes reconegudes :
// http://192.168.1.123:1212
// http://192.168.1.123:1212/activar-sequencia-VAR
// http://192.168.1.123:1212/parar-sequencia-VAR
// http://192.168.1.123:1212/mostrar-foto
// http://192.168.1.123:1212/hacer-foto


// =========================================================================

// Moduls que ens calen :
// ======================

var express = require( 'express' ) ;
var app = express() ;

var path         = require( 'path' ) ;
var logger       = require( 'morgan' ) ;             // logging middleware
var fs           = require( 'fs' ) ;                 // get JPG or PNG

var gpio = require( 'rpi-gpio' ) ;
var PythonShell = require( 'python-shell' ) ;        // to send commands to python


// les meves variables :
// =====================

var VAR_activo = 0 ;
var PinEncendido = 16 ;       // to cycle thru color sequence.
var myIntervalObject ;        // used by clearInterval.
var myIntervalValue = 1000 ;  // slow = 3000, normal = 1000, fast = 500.


// configuracio :
// ==============

    app.set( 'mPort', process.env.PORT || 1212 ) ;      // save port to use in APP var

    var myVersio     = "v1.0.c" ;

// tell Express application to load and server static files (if there any) from public folder:
    app.use( express.static( __dirname + '/public' ) );            // set the static files location /public/img will be /img for users
    app.use( express.static( path.join(__dirname, 'public' ) ) );  // objects from the ./public/ uri will be served from .\public\ dir
    app.use( '/', express.static( __dirname + '/public' ) ) ;      // serve whatever is in the "public" folder at the URL /public/:filename

// eina per depurar el programa
    app.use( logger( "dev" ) ) ;                     // https://github.com/expressjs/morgan - tiny (minimal), dev (developer), common (apache)


// definim algunes funcions :
// ==========================

// nova funcio yyymmdd de Date() - at server
Date.prototype.yyyymmdd = function ( ) {                            
        var yyyy = this.getFullYear().toString();                                    
        var mm   = (this.getMonth()+1).toString(); // getMonth() is zero-based         
        var dd   = this.getDate().toString();
        return yyyy + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]);
}; // yyyymmdd()

function encenderLuz( miPin ) { // 
        
    console.log( 'Encender pin (%s).', miPin );
    gpio.write( miPin, true, function(err) {
        if (err) throw err;
        console.log( '(+) Written ON to pin (%s).', miPin );
    });
} ; // encenderLuz()

function apagarLuz( miPin ) { // 
        
    console.log( 'Apagar pin (%s).', miPin );
    gpio.write( miPin, false, function(err) {
        if (err) throw err;
        console.log( '(-) Written OFF to pin (%s).', miPin );
    });
} ; // apagarLuz()


function cambiarLuces() {
     console.log( '>>> Cambiar luces (%s).', PinEncendido );
     apagarLuz( PinEncendido ) ;
     if ( PinEncendido == 15 ) { PinEncendido = 16 } else {
          if ( PinEncendido == 16 ) { PinEncendido = 18 } else {
               if ( PinEncendido == 18 ) { PinEncendido = 15 } ;
          } ;
     } ;
     encenderLuz( PinEncendido ) ;
} ; // cambiarLuces()


// Comencem :
// ==========

// Escriure un missatge inicial a la consola

    app.set( 'appHostname', require('os').hostname() ) ;
    console.log( "+++ +++ +++ +++ +++ +++ +++ +++ app SEM starts. Versio[%s], HN[%s], TimeStamp[%s].", myVersio, app.get('appHostname'), (new Date).yyyymmdd() ) ;


// apaguem les 3 bombetes inicialment

gpio.setup( 15, gpio.DIR_OUT, function(err) {
     apagarLuz( 15 ) ;
} ) ;

gpio.setup( 16, gpio.DIR_OUT, function(err) {
     apagarLuz( 16 ) ;
} ) ;

gpio.setup( 18, gpio.DIR_OUT, function(err) {
     apagarLuz( 18 ) ;
} ) ;


// definim les branques a executar segon els que rebem del client (browser)

// app.get( '/', function (req, res)            { res.send( 'Hola, mundo !' ); });


app.post( '/menu_apagar_llum/Color=:res_color_llum', function ( req, res ) {

     var Apagar_Llum_Color = req.params.res_color_llum ;
     var szResultat = "" ;
     console.log( '>>> Menu apagar llum (%s).', Apagar_Llum_Color );

     if ( Apagar_Llum_Color == 'verd' ) {
          apagarLuz( 18 ) ;
          szResultat = "+++ llum verda apagada." ;
     } else if ( Apagar_Llum_Color == 'groc' ) {
          apagarLuz( 15 ) ;
          szResultat = "+++ llum groc apagat." ;
     } else if ( Apagar_Llum_Color == 'vermell' ) {
          apagarLuz( 16 ) ;
          szResultat = "+++ llum vermell apagat." ;
     } else {
          szResultat = '--- color ('+Apagar_Llum_Color+') no reconegut.' ;
     } ;

     console.log( szResultat );
     res.status( 200 ).send( szResultat ) ; 

} ) ; // menu apagar llum

app.post( '/menu_encendre_llum/Color=:res_color_llum', function ( req, res ) {

     var Encendre_Llum_Color = req.params.res_color_llum ;
     var szResultat = "" ;
     console.log( '>>> Menu encendre llum (%s).', Encendre_Llum_Color );

     if ( Encendre_Llum_Color == 'verd' ) {
          encenderLuz( 18 ) ;
          szResultat = "+++ llum verda encesa." ;
     } else if ( Encendre_Llum_Color == 'groc' ) {
          encenderLuz( 15 ) ;
          szResultat = "+++ llum groc ences." ;
     } else if ( Encendre_Llum_Color == 'vermell' ) {
          encenderLuz( 16 ) ;
          szResultat = "+++ llum vermell ences." ;
     } else {
          szResultat = '--- color ('+Encendre_Llum_Color+') no reconegut.' ;
     } ;

     console.log( szResultat );
     res.status( 200 ).send( szResultat ) ; 

} ) ; // menu encendre llum


app.get( '/fer-foto', function (req, res) {

var python_options = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: '/home/pi/semafor',
  args: ['value1', 'value2', 'value3']
} ;

     console.log( '>>> Hacer foto via PYTHON.' );
     PythonShell.run( '2-foto.py', function( err, results ) {
          if ( err ) throw err;
          console.log( '(+) Python results are (%j).', results ) ; // results is an array consisting of messages collected during execution
          var szResultat = "+++ foto feta." ;
          res.status( 200 ).send( szResultat ) ; 
     } ) ;
} ) ; // fer foto


app.get( '/mostrar-foto', function (req, res) {

     var pngFile = '/home/pi/semafor/public/images/webcam.png' ; // created by python
     console.log( '>>> Mostrar foto (%s).', pngFile );

     var imatge = fs.readFileSync( pngFile ) ;

     res.writeHead( 200, { 'Content-Type': 'text/html' } ) ;
     res.write( '<img src="data:image/png;base64,' ) ;
     res.write( new Buffer(imatge).toString( 'base64' ) ) ;
     res.end( '"/>' ) ;

} ) ; // mostrar foto


app.get( '/modificar_interval/Periode=:res_nou_periode', function (req, res) { 

     var Nou_Periode = req.params.res_nou_periode ;
     var szResultat = "" ;
     console.log( '>>> Menu modificar periode (%s).', Nou_Periode );

     if ( Nou_Periode == 'rapid' ) {
          myIntervalValue = 500 ;
          szResultat = "+++ periode 500, velocitat rapida." ;
     } else if ( Nou_Periode == 'mitja' ) {
          myIntervalValue = 1000 ;
          szResultat = "+++ periode 1000, velocitat mitja." ;
     } else if ( Nou_Periode == 'lent' ) {
          myIntervalValue = 3000 ;
          szResultat = "+++ periode 3000, velocitat lenta." ;
     } else {
          szResultat = '--- valor ('+Nou_Periode+') no reconegut.' ;
     } ;

     console.log( szResultat );
     res.status( 200 ).send( szResultat ) ; 

} ) ; // modificar interval intermitencies


app.get( '/activar-sequencia-VAR', function (req, res) { 
     console.log( '>>> Activar VAR.' );
     res.send( '(+++) Activar sequencia Verde-Amarillo-Rojo.' ); 
     VAR_activo = 1 ;
     console.log( '=== Set Interval (%d) msg.', myIntervalValue );
     myIntervalObject = setInterval( cambiarLuces, myIntervalValue ) ; // schedules repeated execution of "callback" every "delay" milliseconds.
} ) ; // activar VAR


app.get( '/parar-sequencia-VAR', function (req, res) { 
     console.log( '>>> Parar VAR.' );
     res.send( '(---) Detener sequencia Verde-Amarillo-Rojo.' ); 
     console.log( '=== Clear Interval.' );
     clearInterval( myIntervalObject ) ;
     VAR_activo = 0 ;
     apagarLuz( 15 ) ;
     apagarLuz( 16 ) ;
     apagarLuz( 18 ) ;
} ) ; // parar VAR


// creacio del servidor :
// ======================

var server = app.listen( app.get( 'mPort' ), "192.168.1.123", function () {
     var host = server.address().address;
     var port = server.address().port;
     console.log( '>>> App listening at http://%s:%s', host, port );
} ) ; // server

