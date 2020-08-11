const palabrasReservadas = ['auto', 'stdio','scanf', 'printf', 'main', 'include', 'const','struct','unsigned','break','continue','else','for','signed','switch','void','case','default','enum','goto','register','sizeof','typedef','volatile','do','extern','if','return','static','union','while','asm','dynamic_cast','namespace','reinterpret_cast','try','explicit','new','static_cast','typeid','catch','false','operator','template','typename','class','friend','private','this','using','const_cast','inline','public','throw','virtual','delete','mutable','protected','true','wchar_t','cout','cin']
const tiposDatos=['int','float','double','char', 'long', 'short'] //TAMBIEN SON PALABRAS RESERVADAS
const operadores=[ '+', '-', '*', '/', '%', '<', '>', '=', '==', '.', '!', ',', ';', '[',']','{','}', '(',')','"',"'",':', '::', '#', '&', '&&', '|', '||']

var bandera = true
let contadorINT=1,contadorFLOAT=1,contadorDOUBLE=1,contadorCHAR=1
var aux = ''
var arregloObj = []
var numeros = []
var j = 0
var x = 0;
var cont = "";
var tipo='';
var q=0, q1=0, q2=0;
var contLinea = 0
var conterror = 0
var TOKEN 
document.getElementById('file-input')
.addEventListener('change',convertFile, false);

document.getElementById('button-scan')
.addEventListener('click',process, false);

class identificador{
    constructor(){
        let codigo = ''
        let tipoDato = ''
        let nombreId = ''
    }
        
    setCodigo(codigo){
        this.codigo = codigo
    }
    getCodigo(){
        return  this.codigo
    }
    setTipoDato(tipoDato){
        this.tipoDato = tipoDato
    }
    getTipoDato(){
        return  this.tipoDato
    }
    setNombreId(nombreId){
        this.nombreId = nombreId
    }
    getNombreId(){
        return  this.nombreId
    }
}

function quitarComentariosmulti(contenido){
		let aux = ' '
        let longitud = contenido.length
        let j = 0
        let com = 0
        let band = true
		while( j < longitud ){ 
				if(contenido.charAt(j) == '/' && contenido.charAt(j+1) == '*'){
                    com = j+2
                    while(band){
                        if(contenido.charAt(com) =='*' && contenido.charAt(com+1) =='/'){
                            band = false
                        }
                        com++
                    }
                    band = true
                    j = com + 2
				}else{
                    aux = aux + contenido.charAt(j)
                    j++
                }
			}
		
		return aux
}

function quitarComentariosuni(contenido){
		let aux = ' '
        let longitud = contenido.length
        let j = 0
        let com = 0
        band = true
		while( j < longitud ){
				if(contenido.charAt(j) == '/' && contenido.charAt(j+1) =='/'){
                    com = j+2
                    while(band){
                        if(contenido.charAt(com) =='\n' ){
                            band = false
                        }
                        com++
                    }
                    band = true
                    j = com 
				}else{
                    aux = aux + contenido.charAt(j)
                    j++
                }
			}
		
		return aux
}

function convertFile(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var contenido = e.target.result  
        mostrarContenido(contenido,'contenido-archivo')
        let auxiliar = quitarComentariosmulti(contenido)
        let auxiliar2 = quitarComentariosuni(auxiliar)
        // console.log(contenido)
        document.scanner.aux.value = auxiliar2
        // console.log(document.scanner.aux.value )
        cont=auxiliar2
        mostrarContenido(auxiliar2,'contenido-archivo2')
        let auxiliar3 = contUniformizado()
        mostrarContenido(auxiliar3, 'uniformed')
        document.scanner.aux2.value = auxiliar3
    };
    lector.readAsText(archivo);
}

function process(){
    // document.scanner.token.value = scanner();
    codigo()
}

function mostrarContenido(contenido,cadena) {
	var elemento = document.getElementById(cadena);
    elemento.innerHTML = contenido;
}

function comprobarOperador(palabra){
    for(let i =0;i<operadores.length;i++){
        if(palabra === operadores[i]){
            return true
        }
    }
    return false
}

function comprobarNumero(numero){
    let band=false;
    for(let i=0; i<numeros.length; i++){
        if(numero==numeros[i]){
            band=true;
        }
    }
    return band;
}

function scanner() {
    let tok = "";
    let c = "";
    tipo='';
    while (document.scanner.aux.value.charAt(j)==' '  || document.scanner.aux.value.charAt(j)=='	') { // Ignorar espacios en blanco
    j++;
    }
      
    if (j >= document.scanner.aux.value.length) {
        c = '$';  // fin de cadena
    }else{
        c = document.scanner.aux.value.charAt(j);
    }
    //PARA PALABRAS RESERVADAS E IDENTIFICADOR
    if (c>='a' && c<='z' || c>='A' && c<='Z')	{   // Cadena de letras
        while ((c>='a' && c<='z') || (c>='0' && c<='9') || (c>='A' && c<='Z') || c=='_') {
            tok = tok+c;
            j++;
            c = document.scanner.aux.value.charAt(j);
        }
        tipo='id';
        for(let u=0; u<palabrasReservadas.length; u++){
            if(tok==palabrasReservadas[u]){
                tipo='';
            }    
        }
        for(let u=0; u<tiposDatos.length; u++){
            if(tok==tiposDatos[u]){
                tipo='';
            }    
        }
    }
    //PARA NUMEROS
    else if (c>='0' && c<='9')	{  // Encadenar numeros
        tok=c;
        j++;
        c=document.scanner.aux.value.charAt(j)
        if(c=='.'){
            tok = tok + c;
            j++;
            c=document.scanner.aux.value.charAt(j)
        }
        while (c>='0' && c<='9')	{
            tok = tok+c;
            j++;
            c = document.scanner.aux.value.charAt(j);
        }
        tipo='num';        
    }
    //PARA OPERADORES
    else if (c==',' || c=='(' || c==')' || c=='=' || c=='*' || c=='/' || c=='-' || c=='+' || 
            c=='<' || c=='>' || c==';' || c=='{' || c== '}' || c=='#' || c=='"' || c=='!' || c=='.' || c==':' || c=='::' || c=='%' || c=='&' || c=='|'){  // Operador
        tok = c;
        if ((c=='-' && document.scanner.aux.value.charAt(j+1)=='-') ||
            (c=='+' && document.scanner.aux.value.charAt(j+1)=='+') ||
            (c=='<' && document.scanner.aux.value.charAt(j+1)=='=') ||
            (c=='>' && document.scanner.aux.value.charAt(j+1)=='=') ||
            (c=='<' && document.scanner.aux.value.charAt(j+1)=='<') ||
            (c=='>' && document.scanner.aux.value.charAt(j+1)=='>') ||
            (c=='&' && document.scanner.aux.value.charAt(j+1)=='&') ||
            (c=='|' && document.scanner.aux.value.charAt(j+1)=='|'))
        {
            tok = tok + document.scanner.aux.value.charAt(j+1);
            j++;
        }
        j++;
    }	  
    else if (c=='$') { // fin de cadena
        tok = c;
    }else{
        tok=c;
        j++;
    }
    return tok;
}

function scanner1() {
    let tok = "";
    let c="";
    

    if (x >= cont.length) {
        c = '$';  // fin de cadena
    }else{
        c = cont.charAt(x);
    }

    if (c>='a' && c<='z' || c>='A' && c<='Z')	{   // Cadena de letras
        while ((c>='a' && c<='z') || (c>='0' && c<='9') || (c>='A' && c<='Z') || c=='_') {
            tok = tok+c;
            x++;
            c = cont.charAt(x);
        }
        if(!comprobarPalabraReservada(tok))
            generarObjetosId(tok);
        else
            aux="";
    }
    
    else if (c>='0' && c<='9')	{  // Encadenar numeros
        tok=c;
        x++;
        c=cont.charAt(x)
        if(c=='.'){
            tok = tok + c;
            x++;
            c=cont.charAt(x)
        }
        while (c>='0' && c<='9')	{
            tok = tok+c;
            x++;
            c = cont.charAt(x);
        }
        numeros.push(tok)
    }

    else if (c==',' || c=='(' || c==')' || c=='=' || c=='*' || c=='/' || c=='-' || c=='+' || 
            c=='<' || c=='>' || c==';' || c=='{' || c== '}' || c=='#' || c=='"' || c=='!' || c=='.' || c==':' || c=='::' || c=='%' || c=='&' || c=='|'){  // Operador
        tok = c;
        if ((c=='-' && cont.charAt(x+1)=='-') ||
            (c=='+' && cont.charAt(x+1)=='+') ||
            (c=='<' && cont.charAt(x+1)=='=') ||
            (c=='>' && cont.charAt(x+1)=='=') ||
            (c=='<' && cont.charAt(x+1)=='<') ||
            (c=='>' && cont.charAt(x+1)=='>') || 
            (c=='&' && cont.charAt(x+1)=='&') ||
            (c=='|' && cont.charAt(x+1)=='|'))
        {
            tok = tok + cont.charAt(x+1);
            x++;
        }
        x++;
    }	  
    else if (c=='$') { // fin de cadena
        tok = c;
    }else{
        tok=c;
        x++;
    }
    return tok;
}

function comprobarPalabraReservada(palabra){
    for(let i = 0; i<palabrasReservadas.length;i++){
        if(palabra == palabrasReservadas[i]){
           return true
        }
    }
    return false
}

function verificarPalabra(palabra){
    if(arregloObj === -1){
        return false
    }else{
        for(let i = 0;i<arregloObj.length;i++){
            if(palabra == arregloObj[i].nombreId){
                return true
            }
        }
        return false
    }
}

function comprobarTipoDeDato(palabra){
    for(let i = 0; i<tiposDatos.length;i++){
        if(palabra == tiposDatos[i]){
           return true
        }
    }
    return false
}

function generarCodigo(palabra,tipo){
    let codigo = ''
    if(arregloObj.length>0){
        for(let i=0;i<arregloObj.length;i++){
            if(palabra == arregloObj[i].getNombreId()){
                return arregloObj[i].getCodigo()
            }
        }
    }
        switch (tipo) {
            case 'int':
                if(contadorINT<10){
                    codigo = `i00${contadorINT}`
                    contadorINT++
                }else if(contadorINT<100){
                    codigo = `i0${contadorINT}`
                    contadorINT++
                }else{
                    codigo = `i${contadorINT}`
                    contadorINT++
                }
                break;
            case 'float':
                if(contadorFLOAT<10){
                    codigo = `f00${contadorFLOAT}`
                    contadorFLOAT++
                }else if(contadorFLOAT<100){
                    codigo = `f0${contadorFLOAT}`
                    contadorFLOAT++
                }else{
                    codigo = `f${contadorFLOAT}`
                    contadorFLOAT++
                }
                break;
            case 'double':
                if(contadorDOUBLE<10){
                    codigo = `d00${contadorDOUBLE}`
                    contadorDOUBLE++
                }else if(contadorDOUBLE<100){
                    codigo = `d0${contadorDOUBLE}`
                    contadorDOUBLE++
                }else{
                    codigo = `d${contadorDOUBLE}`
                    contadorDOUBLE++
                }
                break;
            case 'char':
                if(contadorCHAR<10){
                    codigo = `c00${contadorCHAR}`
                    contadorCHAR++
                }else if(contadorCHAR<100){
                    codigo = `c0${contadorCHAR}`
                    contadorCHAR++
                }else{
                    codigo = `c${contadorCHAR}`
                    contadorCHAR++
                }
                break;
            default:
                break;
        }
        return codigo
}

function generarObjetosId(palabra){
    if(comprobarTipoDeDato(palabra)){
        aux = palabra
        bandera = false
    }else{
        if(aux!=''){
            if(!verificarPalabra(palabra)){
                if(bandera){
                        let long = arregloObj.length
                        let obj2 = new identificador()
                        obj2.setNombreId(palabra)
                        obj2.setCodigo(generarCodigo(palabra,aux))
                        obj2.setTipoDato(arregloObj[long-1].getTipoDato())
                        arregloObj.push(obj2)
                    }else{
                        let obj = new identificador()
                        obj.setTipoDato(aux)
                        obj.setNombreId(palabra)
                        obj.setCodigo(generarCodigo(palabra,obj.getTipoDato()))
                        arregloObj.push(obj)
                        bandera = true
                }
            }else{
                for(let i=0; i<arregloObj.length; i++){
                    if(palabra==arregloObj[i].getNombreId()){
                        if(aux!=arregloObj[i].getTipoDato()){
                        }
                    }
                }                    
            }
        }
    }
}

function contUniformizado(){
    let conten="";
    let token="";
    let to="";
    let band, comentario=false;
    let c=1;
    while(to!='$'){
        to=scanner1();
    }
    x=0;
    do{
        band=true;
        token=scanner1()
        if(token=='"' && c%2!=0){
            comentario=true;
            c++;
        }else if (token=='"' && c%2==0){
            comentario=false;
            c++;
        }
        for(let i=0; i<arregloObj.length; i++){
            if(token==arregloObj[i].getNombreId() && !comentario){
                conten=conten+arregloObj[i].getCodigo();
                band=false
                break;
            }
        }
        if(band){
            if(token!='$'){
                conten=conten+token;
            }   
        }

    }while(token!='$');
    return conten;
}


//GRAMATICAS
const sd_3 = ['int', 'float', 'double', 'if', 'cin', 'cout', 'id']
const sd_4 = ['$']
const sd_5 = ['int', 'float', 'double']
const sd_6 = ['id']
const sd_7 = ['if']
const sd_8 = ['cin']
const sd_9 = ['cout']

const sd_12 = [',']
const sd_13 = [';']
const sd_14 = ['=']
const sd_15 = [',']
const sd_16 = ['int']
const sd_17 = ['float']
const sd_18 = ['double']

const sd_20 = ['=']     
const sd_21= ['++','--']     
const sd_22 = ['+','-','*','/']   
const sd_23 = ['++']     
const sd_24 = ['--']     
const sd_27 = ['num']      
const sd_28 = ['id']       
const sd_29 = ['+','-','*','/']      
const sd_30 = [';']                  
const sd_31 = ['+']               
const sd_32 = ['-']       
const sd_33 = ['*']      
const sd_34 = ['/']

const sd_36 = ['else']
const sd_37 = ['$', 'int', 'float', 'double', 'if', 'cin', 'cout', 'id', '}']
const sd_40 = ['&&','||']
const sd_41 = [')']
const sd_43 = ['<']
const sd_44 = ['>']
const sd_45 = ['==']
const sd_46 = ['!=']
const sd_47 = ['>=']
const sd_48 = ['<=']
const sd_49 = ['&&']
const sd_50 = ['||']
const sd_53 = ['int', 'float', 'double', 'if', 'cin', 'cout', 'id']
const sd_54 = ['}']

const sd_56 = ['>>']
const sd_57 = [';']
const sd_60 = ['<<']
const sd_61 = [';']
const sd_63 = ['+','-','*','/']
const sd_64 = ['<<']

function reconocer(){
    document.getElementById('recognized').classList.add("celeste")
}

function error(){
    document.getElementById('unrecognized').classList.add("rojo")
}

function codigo(){
    // debugger   
    TOKEN = scanner()
    programa()
    if(TOKEN =='$'){
        // reconocer()
        // console.log(document.getElementById('recognized'))
        document.getElementById('recognized').classList.remove('default')
        document.getElementById('recognized').classList.add('celeste')

    }else{
        // error()
        // console.log(document.getElementById('unrecognized'))
        document.getElementById('recognized').classList.remove('default')
        document.getElementById('unrecognized').classList.add('rojo')

    }
}

function programa(){      
    linea()
    Y()
}

function Y(){
    if(sd_3.includes(TOKEN) || sd_3.includes(tipo)){
        programa()
    }else if(sd_4.includes(TOKEN)){
        //landa
    }
}

function linea(){
    if(sd_5.includes(TOKEN)){
        declaracion()
        if(TOKEN == ';'){
            TOKEN = scanner()
        }else{
            TOKEN = ' '
        }
    }else if(sd_6.includes(tipo)){
        asignacion()
        if(TOKEN == ';'){
            TOKEN = scanner()
        }else{
            TOKEN = ' '
        }
    }else if(sd_7.includes(TOKEN)){
        condicional()
    }else if(sd_8.includes(TOKEN)){
        entrada()
        if(TOKEN == ';'){
            TOKEN = scanner()
        }else{
            TOKEN = ' '
        }
    }else if(sd_9.includes(TOKEN)){
        salida()
        if(TOKEN == ';'){
            TOKEN = scanner()
        }else{
            TOKEN = ' '
        }
    }
}

function  declaracion(){     
    tipoD()
    listaDeclaraciones()
}

function listaDeclaraciones(){
    if(tipo == "id"){
        TOKEN = scanner()
        Resto()
        M()
    }
}

function M(){
    if(sd_12.includes(TOKEN)){
        if(TOKEN == ','){
            TOKEN =scanner()
            listaDeclaraciones()
        }
    }else if(sd_13.includes(TOKEN)){
            //landa        
    }
}

function Resto(){
    if(sd_14.includes(TOKEN)){
        if(TOKEN =='='){
            TOKEN = scanner()
            if(tipo == 'num'){
            TOKEN =scanner()
            }
        }
    }
    else if(sd_15.includes(TOKEN)){
            //landa
        }
}

function tipoD(){
     
    if(sd_16.includes(TOKEN)){
        if(TOKEN == 'int'){
            TOKEN = scanner()
        }
    }else if(sd_17.includes(TOKEN)){
        if(TOKEN == 'float'){
            TOKEN =scanner()
        } 
    }else if(sd_18.includes(TOKEN)) {
        if(TOKEN == 'double'){
            TOKEN = scanner()
        }
    }
}

function asignacion(){
    if(tipo == 'id'){
        TOKEN = scanner()
        L()
    }
}

function L(){
     
    if(sd_20.includes(TOKEN)){
        if(TOKEN == '='){
            TOKEN = scanner()
            RestoAsignacion()
        }
    }else if(sd_21.includes(TOKEN)){
        operadorIncremento()   
    }else if(sd_22.includes(TOKEN)){
        operadorReducido()
        RestoAsignacion()
    }
}

function operadorIncremento(){
     
    if(sd_23.includes(TOKEN)){
        if(TOKEN == '++'){
            TOKEN =scanner()
        }
    }else if(sd_24.includes(TOKEN)){
        if(TOKEN == '--'){
            TOKEN =scanner()
        }
    }
}

function operadorReducido(){
     
        operador()
        if(TOKEN == '='){
            TOKEN = scanner()
        }
}

function RestoAsignacion(){
     
    X()
    K()    
}

function X(){
     
    if(sd_27.includes(tipo)){
        if(tipo == 'num'){
            TOKEN = scanner()
        }
    }else if(sd_28.includes(tipo)){
        if(tipo == 'id'){
            TOKEN = scanner()
        }
    }
}

function K(){
     
    if(sd_29.includes(TOKEN)){
        operador()
        RestoAsignacion()
    }else if(sd_28.includes(TOKEN)){
        //landa
    }
}

function operador(){
     
    if(sd_31.includes(TOKEN)){
        if(TOKEN == '+'){
            TOKEN = scanner()
        }
    }else if(sd_32.includes(TOKEN)){
        if(TOKEN == '-'){
            TOKEN = scanner()
        }
    }else if(sd_33.includes(TOKEN)){
        if(TOKEN == '*'){
            TOKEN = scanner()
        }
    }else if(sd_34.includes(TOKEN)){
        if(TOKEN == '/'){
            TOKEN = scanner()
        }
    }
}

function condicional(){
     
    if(TOKEN == "if"){
        TOKEN = scanner()
        bloqueCondicion()
        bloqueCodigo()
        Z()
    }
}

function Z(){
     
    if(sd_36.includes(TOKEN)){
        if(TOKEN == "else"){
            TOKEN = scanner()
            bloqueCodigo()
        }
    }else if(sd_37.includes(TOKEN)){
        //landa
    }
}

function bloqueCondicion(){
     
    if(TOKEN == '('){
        TOKEN = scanner()
        listaCondiciones()
        if(TOKEN == ')'){
            TOKEN = scanner()
        }
    }
}

function listaCondiciones(){
     
    condicion()
    U()
}

function U(){
     
    if(sd_40.includes(TOKEN)){
        operadorUnion()
        listaCondiciones()
    }else if(sd_41.includes(TOKEN)){
        //landa
    }
}

function condicion(){
     
    if(tipo == "id"){
        TOKEN = scanner()
        operadorComparacion()
        if(tipo == "num"){
            TOKEN = scanner()
        }
    }
}

function operadorComparacion(){
    //  
    if(sd_43.includes(TOKEN)){
        if(TOKEN == '<'){
            TOKEN = scanner()
        }
    }else if(sd_44.includes(TOKEN)){
        if(TOKEN == '>'){
            TOKEN = scanner()
        }
    }else if(sd_45.includes(TOKEN)){
        if(TOKEN == '=='){
            TOKEN = scanner()
        }
    }else if(sd_46.includes(TOKEN)){
        if(TOKEN == '!='){
            TOKEN = scanner()
        }
    }else if(sd_47.includes(TOKEN)){
        if(TOKEN == '>='){
            TOKEN = scanner()
        }
    }else if(sd_48.includes(TOKEN)){
        if(TOKEN == '<='){
            TOKEN = scanner()
        }
    }
}

function operadorUnion(){
    //  
    if(sd_49.includes(TOKEN)){
        if(TOKEN == "&&"){
            TOKEN = scanner()
        }
    }else if(sd_50.includes(TOKEN)){
        if(TOKEN == "||"){
            TOKEN = scanner()
        }
    }
}


function bloqueCodigo(){
    //  
    if(TOKEN == '{'){
        TOKEN = scanner()
        contenidoBloqueCodigo()
        if(TOKEN ==  '}'){
            TOKEN = scanner()
        }
    }
}

function contenidoBloqueCodigo(){
    //  
    linea()
    Q()
}

function Q(){
    //  
    if(sd_53.includes(TOKEN) || sd_54.includes(tipo)){
        contenidoBloqueCodigo()
    }else if(sd_54.includes(TOKEN)){
    }
}


function entrada(){
    //  
    if(TOKEN == "cin"){
        TOKEN = scanner()
        if(TOKEN == ">>"){
            TOKEN = scanner()
            if(tipo == "id"){
                TOKEN = scanner()
                T()
            }
        }
    }
}

function T(){
    //  
    if(sd_56.includes(TOKEN)){
        RestoEntrada()
    }else if(sd_57.includes(TOKEN)){
    }
}

function RestoEntrada(){
    //  
    if(TOKEN == ">>"){
        TOKEN = scanner()
        if(tipo == "id"){
            TOKEN = scanner()
            T()
        }
    }
}

function salida(){
    //  
    if(TOKEN == "cout"){
        TOKEN = scanner()
        if(TOKEN == "<<"){
            TOKEN = scanner()
            operacion()
            W()
        }
    }
}

function W(){

    if(sd_60.includes(TOKEN)){
        RestoSalida()
    }else if(!sd_61.includes(TOKEN)){
    }
}

function operacion(){
    if(tipo == 'id'){
        TOKEN = scanner()
        H()
    }
}
function H(){
    //  
    if(sd_63.includes(TOKEN)){
        operador()
        operacion()
    }else if(sd_64.includes(TOKEN)){
        //
    }
}

function RestoSalida(){
    //  
    if(TOKEN == "<<"){
        TOKEN = scanner()
        operacion()
        W()
    }
}


















