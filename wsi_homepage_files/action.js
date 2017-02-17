var timeout = 30;
var Fach;
var Ort;
var Nc;
var baseUrl = "";
var lang = "language="+navigator.language;
var system= "system="+navigator.userAgent;
var individuum=lang+"|"+system;
var sessionId;
var summaryGesText = "gefundene Studiengänge";
var summaryPositiveText = "mit Deinem NC möglich";
var summaryNegativeText = "mit Deinem NC nicht möglich";
var summaryTestsText = "zusätzlich durch Zusatzqualifikationen möglich";

var eingabeFehlerHeaderText = "Eingabefehler";
var eingabeFehlerOrt = "Der <strong>Ort</strong> besteht nur aus Buchstaben,";
eingabeFehlerOrt += "<br>bzw. aus Paaren hiervon. <br>z.B.: Tübingen,Erlangen-Nürnberg<br>Baden Baden, tÜbINGeN";

var eingabeFehlerStudiengang = "Der <strong>Studiengang</strong> besteht nur aus Buchstaben,";
eingabeFehlerStudiengang += "<br>bzw. aus Paaren hiervon. <br>z.B.: Medizin,<br>Technische Informatik,mEdiZin";

var eingabeFehlerNC = "Die <strong>Abiturnote</strong> muß wie folgt eingegeben werden: z.z z,z z.B.: 1.5 oder 1,5";
var eingabeFehlerdoubleNC = "Die <strong>Abiturnote</strong> darf nur einmalig eingegeben werden";
var eingabeFehlerPercentage = "Die <strong>TMS Prozente</strong> müssen wie folgt eingegeben werden: zz bzw. zzz z.B.: 15 oder 100";
var eingabeFehlerNote = "Die <strong>TMS-Note</strong> muß wie folgt eingegeben werden: z.z oder z,z z.B.: 1.5 oder 1,5";
var eingabeFehlerDuty = "Die <strong>Dienstzeit</strong> muss als 1-2 stelliger Wert eingegeben werden: z oder zz z.B.: 5 oder 24";

var showLogo = false;
var textObj;
var wasVisible;
var tmsCheckboxState = false;
var dutyCheckboxState = false;
var ausbCheckboxState = false;
var resetButtonState = false;
var percentageTest = new RegExp('^[1]{0,1}[0-9]{1,2}$');
var dutyTest = new RegExp('^[1-9]{1}[0-9]{0,1}$');
var ncTest = new RegExp('^[1-4]{1}([.,][0-9]){0,1}$');
var tokenTest = new RegExp('^[A-ZÄÜÖa-zäüö]+([-\s]{0,1}[A-ZÄÜÖa-zäüö])*$');
var delay=1000;
var resultsVisible;
//var panelHeaderCreated = false;
var erglistPanelHeaderCreated = false;
var erglist2PanelHeaderCreated = false;

function keyFunc(event) {
	if (event.which == 13) {
		if (($('#main').is(':visible'))) {
			retrieveWrapper();
		} else {
			if (tmsCheckboxState == true) {
				$(document.getElementById('recalcButton')).click();
			}
		}
	}
}

function toggleCheckbox(which) {
	switch(which){
		case 'tms': toggleTMSCheckBox();break;
		case 'duty': toggleDutyCheckBox();break;
		case 'ausb': toggleAusbCheckBox();break; 
	}
		
}

function frage(which){
	alert("frage:"+which);
}

function toggleResetButton(){
	if(resetButtonState){
		resetButtonState = false;
		$(document.getElementById('recalcResetButton')).attr("disabled", true);
		
	}else{
		resetButtonState = true;
		$(document.getElementById('recalcResetButton')).attr("disabled", false);
	}
}


function toggleDutyCheckBox(){
	if (dutyCheckboxState == false) {
		dutyCheckboxState = true;
		$(document.getElementById('duty_time')).attr("disabled", false);
		$(document.getElementById('label_for_duty_time')).removeClass("zusatzQual_disabled");
		$(document.getElementById('label_for_duty_time')).addClass("zusatzQual");
		toggle_recalc_button(tmsCheckboxState||dutyCheckboxState||ausbCheckboxState);
	}else{
		dutyCheckboxState = false;
		document.getElementById('duty_time').value = "";
		$(document.getElementById('duty_time')).attr("disabled", true);
		$(document.getElementById('label_for_duty_time')).removeClass("zusatzQual");
		$(document.getElementById('label_for_duty_time')).addClass("zusatzQual_disabled");
		toggle_recalc_button(tmsCheckboxState||dutyCheckboxState||ausbCheckboxState);
	}
}

function toggleAusbCheckBox(){
	if (ausbCheckboxState == false) {
		ausbCheckboxState = true;
		toggle_recalc_button(tmsCheckboxState||dutyCheckboxState||ausbCheckboxState);
	}else{
		ausbCheckboxState = false;
		toggle_recalc_button(tmsCheckboxState||dutyCheckboxState||ausbCheckboxState);
	}
}


function toggleTMSCheckBox(){
	if (tmsCheckboxState == false) {
		tmsCheckboxState = true;
		$(document.getElementById('grade_tms')).attr("disabled", false);
		$(document.getElementById('note_tms')).attr("disabled", false);
		$(document.getElementById('label_for_note_tms')).removeClass(
		"zusatzQual_disabled");
		$(document.getElementById('label_for_grade_tms')).removeClass(
		"zusatzQual_disabled");
		$(document.getElementById('label_for_note_tms')).addClass("zusatzQual");
		$(document.getElementById('label_for_grade_tms'))
		.addClass("zusatzQual");
		toggle_recalc_button(tmsCheckboxState||dutyCheckboxState||ausbCheckboxState);
	} else {
		tmsCheckboxState = false;
		document.getElementById('grade_tms').value = "";
		document.getElementById('note_tms').value = "";
		$(document.getElementById('grade_tms')).attr("disabled", true);
		$(document.getElementById('note_tms')).attr("disabled", true);
		$(document.getElementById('label_for_note_tms')).removeClass(
		"zusatzQual");
		$(document.getElementById('label_for_grade_tms')).removeClass(
		"zusatzQual");
		$(document.getElementById('label_for_note_tms')).addClass(
		"zusatzQual_disabled");
		$(document.getElementById('label_for_grade_tms')).addClass(
		"zusatzQual_disabled");
		toggle_recalc_button(tmsCheckboxState||dutyCheckboxState||ausbCheckboxState);
	}
}

function toggle_recalc_button(newState){
	if(newState){
		$(document.getElementById('recalcButton')).attr("disabled", false);
		$(document.getElementById('recalcButton')).removeClass("tgbfdisabled");
		$(document.getElementById('recalcButton')).addClass("tgbf");
		$(document.getElementById('label_for_recalcButton')).removeClass("zusatzQual_disabled");
		$(document.getElementById('label_for_recalcButton')).addClass("zusatzQual");
	}else{
		$(document.getElementById('recalcButton')).attr("disabled", true);
		$(document.getElementById('recalcButton')).removeClass("tgbf");
		$(document.getElementById('recalcButton')).addClass("tgbfdisabled");
		$(document.getElementById('label_for_recalcButton')).removeClass("zusatzQual");
		$(document.getElementById('label_for_recalcButton')).addClass("zusatzQual_disabled");
	}
}

function check_input_withoutEmpty(what, val) {
	var erg = "";
	switch (what) {
	case "percentage":
		erg = val.match(percentageTest);
		break;
	case "duty":
		erg = val.match(dutyTest);
		break;
	case "note":
		erg = val.match(ncTest);
		break;
	case "nc":
		erg = val.match(ncTest);
		break;
	case "ort":
		erg = val.match(ortsTest);
		break;
	}
	return erg;
}

function tmsValues(){
	this.percentage;
	this.note;
	this.checkedAndSet;
	this.correct;
	this.Set;

	
	this.setValues=function(){
		this.note = heal_number(document.getElementById('note_tms').value);
		this.percentage = document.getElementById('grade_tms').value;
		this.checkedAndSet = (this.percentage!=null)&&(this.note)
					&&(check_input_withoutEmpty("percentage",this.percentage)!=null)
					&&(check_input_withoutEmpty("note", this.note)!=null);

		this.Set = (this.percentage!="")&&(this.note!="");
		this.correct = (check_input_withoutEmpty("percentage",this.percentage)!=null)
		&&(check_input_withoutEmpty("note", this.note)!=null);
		
	}
	this.show=function(){
		alert("tmsV:{percentage:"+this.percentage+";note:"+this.note+"}");
	}
}

function dutyValues(){
	this.dutyTime;
	
	this.setValues=function(){
		this.dutyTime = document.getElementById('duty_time').value;
		this.correct = (check_input_withoutEmpty("duty",this.dutyTime)!=null);
	}
}
function ausbValues(){
	this.ausb;
	
	this.setValues=function(){
		this.ausb = document.getElementById('addqual').checked;
	}

	this.show=function(){
		alert("ausbV:{ausb:"+this.ausb+"}");
	}
}

function recalc() {
	var tmsV = new tmsValues();
	tmsV.setValues();

	var dutyV = new dutyValues();
	dutyV.setValues();
	
	var ausbV = new ausbValues();
	ausbV.setValues();
	
	if(tmsCheckboxState&&!tmsV.correct){
		showPop('resultpopup',eingabeFehlerHeaderText, eingabeFehlerNote + "<br><br>"
				+ eingabeFehlerPercentage+ "<br><br>" + eingabeFehlerDuty);
		return;
	}
	if(dutyCheckboxState&&!dutyV.correct){
		showPop('resultpopup',eingabeFehlerHeaderText, eingabeFehlerNote + "<br><br>"
				+ eingabeFehlerPercentage + "<br><br>" + eingabeFehlerDuty);
		return;
	}
	if(tmsCheckboxState||dutyCheckboxState||ausbCheckboxState){
		toggleResetButton();
		clearErglists('erglist');
		clearErglists('erglist1');
		var s = tmsV.note + "," + tmsV.percentage+ "," + dutyV.dutyTime+ "," + ausbV.ausb;
		getData("recalc::" +s, baseUrl + "MainServlet",
		timeout, retrieverReceiver, notifyOnTimeout, notifyOnError);
	}
}


function resetZusatzQuals(){
	toggleResetButton();
	clearErglists('erglist');
	clearErglists('erglist1');
	getData("resetZusatzQuals::", baseUrl + "MainServlet",
	timeout, retrieverReceiver, notifyOnTimeout, notifyOnError);	
}

function setDefaults(inString) {
	var s = inString.split(',');
	Fach = s[1];
	Ort = s[0];
	Nc = s[2];
	setupWidgets();
	getData("texte::", baseUrl + "MainServlet", timeout, texteReceiver,
			notifyOnTimeout, notifyOnError);
}

function backHome() {
	if (!($('#main').is(':visible'))) {
		toggle();
		clearErglists('erglist');
		clearErglists('erglist1');
		if (tmsCheckboxState == true) {
			document.getElementById("tms").click();
		}
	}
}

function hide(what) {
	$(what).addClass("hidden");
}

function show(what) {
	$(what).removeClass("hidden");
}

function toggle() {
	if ($('#motivation_text').is(':visible')) {
		hide('#motivation_text');
	}
	if ($('#main').is(':visible')) {
		hide('#all');
		hide('#slogan');
		hide('#wasbietenwir');
		hide('#vorteile');
		hide('#ueberuns');
		hide('#blog');
		show('#navig');
//		show('#requesting_block');
		show('#result');
		resultsVisible = true;
	} else {
		hide('#result');
		resultsVisible = false;
//		hide('#requesting_block');
		hide('#navig');
		show('#all');
		show('#slogan');
		show('#wasbietenwir');
		show('#vorteile');
		show('#ueberuns');
		show('#blog');
	}
}

function clicked(what){
	if(resultsVisible==true){
		hide('#'+what);
		resultsVisible=false;
	}else{
		show('#'+what);
		resultsVisible=true;
	}
	setErgListPanelHeaderGlyphicon(what+'panelHeaderglyph',resultsVisible);
}

function back(what) {
	if (what == 'teilnahme') {
		hide('#Teilnahmebed_text');
		hide('#teilnahmebed_footer');
	}
	if (what == 'impressum') {
		hide('#impressum_text');
		hide('#impressum_footer');
	}
	if (what == 'datenschutz') {
		hide('#datenschutz_text');
		hide('#datenschutz_footer');
	}

	if (what == 'ueberUns') {
		hide('#ueberUns_text');
		hide('#ueberUnsText_footer');
	}
	if (what == 'contact') {
		hide('#Kontakte_text');
		hide('#kontakte_footer');
	}
	if (wasVisible == "page1") {
//		show('#all');
		show('#main');
//		show('#main_footer');		
		show('#all');
		show('#slogan');
		show('#wasbietenwir');
		show('#vorteile');
		show('#ueberuns');
		show('#blog');
		show('#main_footer');		
	}
	if (wasVisible == "page2") {
//		show('#all');
		show('#navig');
		show('#smallLogo');
		show('#result');
		show('#main_footer');
	}
}

function moveTo(tokenName,page){
	if(page==2)backHome();
	$('html, body').animate({
        scrollTop: $(tokenName).offset().top 
    }, delay);	
	
}

//function showUeberUns() {
//	notify('ueberUns');
//	if ($('#main').is(':visible')) {
//		wasVisible = "page1";
//		hide('#main');
//	} else {
//		wasVisible = "page2";
//		hide('#result');
//		hide('#smallLogo');
//	}
//	hide('#all');
//	hide('#main_footer');
//	show('#ueberUns_text');
//	show('#ueberUnsText_footer');
//}

function showKontakte() {
	notify('Kontakte');
	if ($('#main').is(':visible')) {
		wasVisible = "page1";
//		hide('#main');
		hide('#all');
		hide('#slogan');
		hide('#wasbietenwir');
		hide('#vorteile');
		hide('#ueberuns');
		hide('#blog');
	} else {
		wasVisible = "page2";
		hide('#result');
		hide('#smallLogo');
		hide('#navig');
	}
	hide('#all');
	hide('#main_footer');
	show('#Kontakte_text');
	show('#kontakte_footer');
}//	if(retrieve((document.getElementById('input_main').value," ",";")).trim())


function showResults() {
	hide('#motivation_text');
	hide('#motText_footer');
//	show('#all');
	show('#smallLogo');
	show('#navig');
	show('#result');
	show('#main_footer');
}

function showMotivationText() {
	notify('MotivationText');
	hide('#all');
	hide('#main_footer');
	if ($('#main').is(':visible')) {
		hide('#main');
	} else {
		hide('#result');
		hide('#navig');
		hide('#smallLogo');
	}
	show('#motivation_text');
	show('#motText_footer');
}
//if(retrieve((document.getElementById('input_main').value," ",";")).trim())

function showImpressum() {
	notify('Impressum');
	if ($('#main').is(':visible')) {
		wasVisible = "page1";
//		hide('#main');
		hide('#all');
		hide('#slogan');
		hide('#wasbietenwir');
		hide('#vorteile');
		hide('#ueberuns');
		hide('#blog');
	} else {
		wasVisible = "page2";
		hide('#navig');
		hide('#result');
		hide('#smallLogo');
	}
//	hide('#all');
	hide('#main_footer');
	show('#impressum_text');
	show('#impressum_footer');
}

function showTeilnahmebed() {
	notify('Teilnahmebed');
	if ($('#main').is(':visible')) {
		wasVisible = "page1";
//		hide('#main');		
		hide('#all');//	if(retrieve((document.getElementById('input_main').value," ",";")).trim())

		hide('#slogan');
		hide('#wasbietenwir');
		hide('#vorteile');
		hide('#ueberuns');
		hide('#blog');
	} else {
		wasVisible = "page2";
		hide('#navig');
		hide('#result');
		hide('#smallLogo');
	}
	hide('#all');
	hide('#main_footer');
	show('#Teilnahmebed_text');
	show('#teilnahmebed_footer');
}

function showDatenschutz() {
	notify('Datenschutz');
	if ($('#main').is(':visible')) {
		wasVisible = "page1";
//		hide('#main');
		hide('#all');
		hide('#slogan');
		hide('#wasbietenwir');
		hide('#vorteile');
		hide('#ueberuns');
		hide('#blog');
	} else {
		wasVisible = "page2";
		hide('#navig');
		hide('#result');
		hide('#smallLogo');
	}
	hide('#all');
	hide('#main_footer');
	show('#datenschutz_text');
	show('#datensschutz_footer');
}

$(document).ready(
		function() {
//			alert("referrer:"+document.referrer);//		einzelZahlTester(inputString);
//			if(retrieve((document.getElementById('input_main').value," ",";")).trim())

			getData("defaults::", baseUrl + "MainServlet", timeout,
					defaultsReceiver, notifyOnTimeout, notifyOnError);
/*			window.onhashchange = function() {
				alert("change");
			}
			*/
//			history = window.history;
//			alert("history.length="+history.length);
////			alert("history[1]="+history[1]);
//			history.go(1);
//			  $("#main").fadeIn(3000);
//			$("#requesting_block").fadeIn(30000,"swing",function(){
//				alert("dada");
//			});
		});

function reDelimiterString(s,newDelim,oldDelim){
	var tokens = s.split(oldDelim);
	var erg = "";
	for(var i=0;i<tokens.length;i++){
		erg+=tokens[i];
		if(i<tokens.length-1)erg+=newDelim;
	}
	return erg;
}

function retrieveWrapper() {
//	if(retrieve((document.getElementById('input_main').value," ",";")).trim())
	if(retrieve(document.getElementById('input_main').value," ",";"))
		toggle();
}

function hidePopup(what) {
	$(document.getElementById(what)).empty();
	hide('#' + what);
}

function showPop(which,header, text) {
	if (!($('#'+which).is(':visible'))) {
		$(document.getElementById(which)).append(
			'<div class="text-left"><strong>' + header + '</strong><br><br>' + text
					+ '<br><br><strong>Klicken zum entfernen</strong></div>');
		show('#'+which);
	}

};

function heal_number(nc) {
	var tnc = nc;
	var nc_arr = tnc.split(',');
	if (nc_arr.length != 1) {
		tnc = "" + nc_arr[0] + "." + nc_arr[1];
	}
	return tnc;
}

function testErg(){
	var inputArr;
	var inputString;
	var errpos;
	var errType;
}

function isalpha(c) {
	return (((c >= 'a') && (c <= 'z')) || ((c >= 'A') && (c <= 'Z')));
}

function isdigit(c) {
	return ((c >= '0') && (c <= '9'));
}

// gibt 'number' oder 'chars' oder 'doubleNumber' zurück
function estimateErrTokenType(erroringToken,ncFound){
	var charsCount=0;
	var numberCount=0;
	var ret = 'number';
	
	if(ncFound>1){
		ret = 'doubleNumber';
	}else{
		for(var i=0;i<erroringToken.length;i++){
			if(isalpha(erroringToken[i]))charsCount ++;
			if(isdigit(erroringToken[i]))numberCount ++;
		}
		if(charsCount>=numberCount)
			ret ='chars';
	}
	return ret;
}

function testInputArr(inputSarr,inputString){
	var valid = true;
//	var NCfound = false;
	var NCfound = 0;
	var n,t,ips;

	var erg = new testErg();
	for(var i=0;i<inputSarr.length;i++){
		n = inputSarr[i].match(ncTest);
		if(n!=null)ips=inputString.replace(inputSarr[i],heal_number(inputSarr[i]));
		t= inputSarr[i].match(tokenTest);
//		if((n==null&&t==null)||(t==null&&NCfound==true)){
		if((n==null&&t==null)||(t==null&&NCfound!=0)){
			valid = false;
			break;
		}
//		if(n!=null)NCfound=true;
		if(n!=null)NCfound++;
	}
	if(n!=null)NCfound++;
	if(valid){
		erg.inputArr = inputSarr;
		if(ips!=undefined)
			erg.inputString= ips;
		else
			erg.inputString = inputString;
	}else{
		erg.inputArr = null;
		erg.errpos= i;
		erg.errType=estimateErrTokenType(inputSarr[i],NCfound);
	}
	return erg;
}

function retrieve(inputString,oldDelim,newDelim){
	var s;
	var token = "retrieve::";
	var t;
	var ret = false;
	var changedInputString;
	var inputSarr;
	s=token;
	if(inputString.length ==0){
		s+=Fach+newDelim+Ort+newDelim+Nc;
	}else{
		changedInputString = reDelimiterString(inputString,newDelim,oldDelim);
		inputSarr = changedInputString.split(newDelim);
		t = testInputArr(inputSarr,changedInputString);
		if(t.inputArr!=null)s+=t.inputString;
	}
	if(t!=undefined&&t.inputArr==null&&inputString.length!=0){
//		alert("errorToken ="+inputSarr[t.errpos]+"t.errpos="+t.errpos+";errorTokenType="+t.errType);
		if(t.errType=='chars')
			showPop('generalpopup',eingabeFehlerHeaderText, eingabeFehlerOrt+"<br><br>"+eingabeFehlerStudiengang);
		if(t.errType=='number')
			showPop('generalpopup',eingabeFehlerHeaderText,eingabeFehlerNC);
		if(t.errType=='doubleNumber')
			showPop('generalpopup',eingabeFehlerHeaderText,eingabeFehlerdoubleNC);
	}else{
		ret = true;
		getData(s, baseUrl + "MainServlet", timeout, retrieverReceiver,
				notifyOnTimeout, notifyOnError);
	}
	return ret;
}

function defaultsReceiver(res, status, what) {
	setDefaults(res);
}

function notify(what){
	getData('notify::'+what, baseUrl + "MainServlet", timeout, notificationResultReceiver,
			notifyOnTimeout, notifyOnError);	
}

function notificationResultReceiver(res, status, what) {
}

function clearErglists(ListName) {
//	var listgroup = document.getElementById('erglist');
	var listgroup = document.getElementById(ListName);
	$(listgroup).empty();
	listgroup = document.getElementById('summary');
	$(listgroup).empty();
}

//function retrieverReceiver(res, status, what) {
//	alert("res="+res);
//	if (what.split('::')[0] == "recalc") {
//		createErgLists(document.getElementById('summary'), JSON.parse(res), 1,'erglist','erglist1','txt1','txt2');
//	} else {
//		createErgLists(document.getElementById('summary'), JSON.parse(res), 0,'erglist','erglist1','txt1','txt2');
//	}
//}

function retrieverReceiver(res, status, what) {
//	alert("res="+res);
	var theWhole = JSON.parse(res);
	if (what.split('::')[0] == "recalc") {
		createErgLists(document.getElementById('summary'), theWhole, 1,'erglist','erglist1',theWhole.l1.whatfor,theWhole.l2.whatfor);
	} else {
		createErgLists(document.getElementById('summary'), theWhole, 0,'erglist','erglist1',theWhole.l1.whatfor,theWhole.l2.whatfor);
	}
}


function texteReceiver(res, status, what) {
	textObj = JSON.parse(res);
	insertTextObject(textObj);
	insertBlogContent(textObj);
	insertVorteile(textObj);
}

function setupWidgets() {
	insertRequestingBlock();
}

function insertTextObject(tObj) {
	var to;
	to = document.getElementById('motText');
	$(to).append('<div id="spkId" class="text-left">' + tObj.spk + '</div>');
	to = document.getElementById('ueuText');
	$(to).append('<div id="ueUId" class="text-left">' + tObj.ueU + '</div>');
	to = document.getElementById('contactText');
	$(to).append('<div id="contactId" class="text-left">' + tObj.contact + '</div>');
	to = document.getElementById('impressumText');
	$(to).append('<div id="impressumId" class="text-left">' + tObj.impress + '</div>');
	to = document.getElementById('TeilnahmebedText');
	$(to).append('<div id="teilnahmeBedId" class="text-left">' + tObj.teilnahme + '</div>');
	to = document.getElementById('datenschutzText');
	$(to).append('<div id="datenschutzId" class="text-left">' + tObj.datenschutz + '</div>');

	to = document.getElementById('wasbietenwirrow');
	$(to).append('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5 text-left wasbietenwirinnerclass2" id="wasbietenwirbeschrDiv">' + tObj.wasbietenwir + '</div>');
}

function insertRequestingBlock() {
	createInputFieldForRequestingBlock(document
			.getElementById('requesting_block'), 'input_main', Fach+" "+Ort+" "+Nc+" oder "+Ort+" "+Ort+" "+Fach+" "+Fach, false);
}

function createInputFieldForRequestingBlock(reqBlock, id, placeholder, disable) {
	var elem = "";
 	elem+='<span class="input-group-btn">'; 
 	elem+='<button class="btn btn-default search_main maininputButton disabled" id="button_frage" type="button"onClick="frage(\'generalInputField\')">';
	elem+='<img src="images/question-mark.png" width="15">';
 	elem+='</button>'; 
 	elem+='</span>'; 
 	elem+='<span class="input-group-btn maininputF">'; 
 	elem+='<input type="text" id="input_main" class="form-control request-font search_main" placeholder="'+placeholder+'">'; 
 	elem+='</span>'; 
 	elem+='<span class="input-group-btn">'; 
 	elem+='<button class="btn btn-default search_main maininputButton" id="button_main" type="button"onClick="retrieveWrapper()">';
 	elem+='<img src="images/search.png" width="16">';
 	elem+='</button>'; 
 	elem+='</span>'; 
	$(reqBlock).append(elem);
}

function insertBlogContent(tObj){
	var to;
	var elem;
	var objects = tObj.blogTokens.split(",");
	to = document.getElementById('innerCarousel');
	for(var i=0;i<objects.length;i++){
		elem="";
		if(i==0)elem+='<div class="item active">';
		else elem+='<div class="item">';
		elem+='<div class="carousel-content">';
		elem+='<div class="text_item"';
		elem+= 'id="'+objects[i]+'">';
		elem+=tObj[objects[i]];
		elem+='</div>';
		elem+='</div>';
		elem+='</div>';
		$(to).append(elem);
	}
}

function insertVorteile(tObj){
	var to;
	var elem;
	var objects = tObj.vorteileTokens.split(",");
	to = document.getElementById('vorteilerow');
	for(var i=0;i<objects.length;i++){
		elem="";
   	    elem+='<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center vorteileinnerclass" id="timeSp">';
		elem+=tObj[objects[i]];
		elem+='</div>';
		$(to).append(elem);
	}
}

function createErgLists(SummaryListGroup, ar, mode,ListName,ListName2,headerText1,headerText2) { 
	// mode =0 --> initial;
	// mode =1 --> recalc;
	createSummary(SummaryListGroup, ar);
	if(erglistPanelHeaderCreated==false){
		createErglistPanel(ListName,'panel',headerText1);
		erglistPanelHeaderCreated = true;
	}
	if(erglist2PanelHeaderCreated==false){
		createErglistPanel(ListName2,'panel',headerText2);
		erglist2PanelHeaderCreated = true;
	}

	for (var i = 0; i < ar.l1.positives.arr.length; i++) {
		createErgListElem(document.getElementById(ListName), ar.l1.positives.arr[i], true, mode,ar.summary);
	}
	for (var i = 0; i < ar.l1.negatives.arr.length; i++) {
		createErgListElem(document.getElementById(ListName), ar.l1.negatives.arr[i], false, mode,ar.summary);
	}
	for (var i = 0; i < ar.l2.positives.arr.length; i++) {
		createErgListElem(document.getElementById(ListName2), ar.l2.positives.arr[i], true, mode,ar.summary);
	}
	for (var i = 0; i < ar.l2.negatives.arr.length; i++) {
		createErgListElem(document.getElementById(ListName2), ar.l2.negatives.arr[i], false, mode,ar.summary);
	}
}


function createErglistPanel(ListName,panelName,headerText){
	var elem="";
	var panelHeaderName=""+ListName+panelName+'Header';
	
	/* creation of the Panel itself */
	elem+='<div class="panel panel-default" id="';
	elem+=ListName+panelName;
	elem+='"></div>';
	/* end of creation of the Panel itself */
	$(document.getElementById('resultTabDiv')).append(elem);
	elem="";
	var thePanel = document.getElementById(ListName+panelName);
	elem+='<div class="panel-heading"onClick="clicked(\'';
	elem+=ListName;
	elem+='\')" id="';
	elem+=panelHeaderName;
	elem+='">';
//	elem+='Deine Suchergebnisse&nbsp;&nbsp;';
	elem+=headerText+'&nbsp;&nbsp;';
	elem+='</div>';
	elem+='<ul class="list-group" id="';
	elem+=ListName;
	elem+='">';
	elem+='</ul>';
	$(thePanel).append(elem);
	insertErglistPanelHeaderGlyphicon(panelHeaderName,'up');
}


function setErgListPanelHeaderGlyphicon(glyphiconName,resultsVisible){
	var parentName = glyphiconName.substr(0,glyphiconName.length-5); 
	document.getElementById(glyphiconName).remove();
	if(resultsVisible==true)insertErglistPanelHeaderGlyphicon(parentName,'up');
	else insertErglistPanelHeaderGlyphicon(parentName,'down');
}

function insertErglistPanelHeaderGlyphicon(erglistPanelHeaderName,direction){
	var erglistPanelHeader = document.getElementById(erglistPanelHeaderName);
	var elem ="";
	var theid=""+erglistPanelHeaderName+'glyph';
	if(direction=='up')
		elem+='<span class="glyphicon glyphicon-chevron-up" aria-hidden="true" id="';
	else
		elem+='<span class="glyphicon glyphicon-chevron-down" aria-hidden="true" id="';
	elem+=theid;
	elem+='"></span>';
	$(erglistPanelHeader).append(elem);
}

function createSummary(listGroup, ar) {
	createSummaryListElem(listGroup, ar.summary);
}

function createSummaryListElem(listGroup, Summary) {
	var elem = "";
	var combined = parseInt(Summary.amountPositives)
			+ parseInt(Summary.amountNegatives);
	elem += '<li class="list-group-item"> <div class="row"><div class="col-sm-12">';
	elem += '<article class="text-left col-sm-6">';
	elem += createSummaryInformationRow(combined, 0, summaryGesText);
	elem += createSummaryInformationRow(Summary.amountPositives, 1,
			summaryPositiveText);
	elem += createSummaryInformationRow(Summary.amountNegatives, -1,
			summaryNegativeText);
	elem += '</article>';
	elem += '<aricle class="text-left col-sm-6">';
	elem += createSummaryInformationRow(Summary.amountPositivesInclZusatzQuals, 0,
			summaryTestsText);
	elem += '<div class="university-name text-center">';
	elem += '<button class="btn alternatives" type="button" onClick="showMotivationText()">Alternativen</button>'
	elem += '</div>';
	elem += '</aritcle>';
	elem += '</div></div></li>';
	$(listGroup).append(elem);
}

function createSummaryInformationRow(val, qual, text) {
	var elem = '<div class="city row col-sm-12">';
	elem += createValueBox(val, qual);
	elem += '<div class="city col-sm-11">' + text + '</div></div>';
	return elem;
}

function createValueBox(val, qual) {
	var elem = "";
	elem += '<div class="text-center summaryField col-sm-1';
	switch (qual) {
	case 1:
		elem += ' summaryFieldPositive"';
		break;
	case 0:
		elem += ' summaryFieldNeutral"';
		break;
	case -1:
		elem += ' summaryFieldNegative"';
		break;
	}
	elem += '>';
	elem += val;
	elem += '</div>';
	return elem;
}

function createErgListElem(listGroup, data, valid, mode,summary) {
	var elem = "";
	var TestRes=0;
	var DutyRes=0;
	var AusbRes=0;
	elem += '<li class="list-group-item"> <div class="row"><div class="col-sm-8">';
	elem += '<div class="university-name">' + data.Uni
			+ '</div><div class="studyprogram">';
	elem += '<span class="glyphicon glyphicon-book" aria-hidden="true"></span> '
			+ data.Studiengang + '</div>';
	elem += '<div class="city"><span class="glyphicon glyphicon-map-marker" aria-hidden="true">';
	elem += '</span> ' + data.Stadt + '</div></div><div class="col-sm-2';
	if (valid)
		elem += ' university-nc-positive';
	else
		elem += ' university-nc-negative';
	elem += '">';
	elem += '<span class="glyphicon glyphicon-education" aria-hidden="true"></span>';
	elem += data.DN;
	elem += '</div>';
	if (showLogo) {
		elem += '<div class="col-sm-2 university-logo"><img src="images/996005_512677522152253_1640019307_n.png"';
		elem += 'width="100%" />';
		elem += '</div>';
	}
	if (mode == 1){
		if(data.recalcNConIndividualTMS!=undefined &&summary.originalIndividualNC-data.recalcNConIndividualTMS!=0
				|| data.recalcNConIndividualDuty!=undefined&&summary.originalIndividualNC-data.recalcNConIndividualDuty!=0
				|| data.recalcNConIndividualAusbildung!=undefined && summary.originalIndividualNC-data.recalcNConIndividualAusbildung!=0) {
			
			if(data.recalcNConIndividualTMS!=undefined &&summary.originalIndividualNC-data.recalcNConIndividualTMS!=0){
				TestRes = Math.round((parseFloat(summary.originalIndividualNC)-parseFloat(data.recalcNConIndividualTMS))*100)/100;
			}
			
			if(data.recalcNConIndividualDuty!=undefined && summary.originalIndividualNC-data.recalcNConIndividualDuty!=0){
				DutyRes=Math.round((parseFloat(summary.originalIndividualNC)-parseFloat(data.recalcNConIndividualDuty))*100)/100;
			}
			
			if(data.recalcNConIndividualAusbildung!=undefined &&summary.originalIndividualNC-data.recalcNConIndividualAusbildung!=0){
				AusbRes=Math.round((parseFloat(summary.originalIndividualNC)-parseFloat(data.recalcNConIndividualAusbildung))*100)/100;
			}
			
			if (data.DN >= Math.round((summary.originalIndividualNC-TestRes-DutyRes-AusbRes)*100)/100)
				elem += '<div class="col-sm-2 university-nc-positive';
			else
				elem += '<div class="col-sm-2 university-nc-negative';
			elem += '">';
			elem += '<p class="rechText">Dein&nbsp;NC&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;'+summary.originalIndividualNC;

			
			
			if(TestRes!=0)elem+='<br>Dein&nbsp;TMS:&nbsp;-&nbsp;'+TestRes;
			if(DutyRes!=0)elem+='<br>Dein&nbsp;Dienst:&nbsp;-&nbsp;'+DutyRes;
			if(AusbRes!=0)elem+='<br>Ausbildung:&nbsp;-&nbsp;'+AusbRes;
			
			elem+='</p>';
//			elem+='<div class="shortLine"></div>'
			elem+='<p>---------------------------</p>'
//			elem += '<span class="glyphicon glyphicon-education" aria-hidden="true"></span>';
//			elem += '<p class="rechText">NC:</p>';
			elem += 'neuer NC: '+Math.round((summary.originalIndividualNC-TestRes-DutyRes-AusbRes)*100)/100;
			elem += '</div>';
		}else{
			elem += '<div class="col-sm-2 university-nc-positive';
			elem += '">';
			elem += '<p>keine Änderung des NCs durch Einbeziehung Deiner Zusatzqualifikationen </p>';
			elem += '</div>';			
		}
	}
	elem += '</div></div></li>';
	$(listGroup).append(elem);
}

function left(){
	$('#blog').carousel('prev');
}

function right(){
	$('#blog').carousel('next');
}


/**
 * callback-function for the case of reaching the timeout while waiting for a
 * response inside of the ajax call
 */
function notifyOnTimeout() {
	alert("timeout");
};

/**
 * callback-function for the case of connection errors while calling the ajax
 * call
 */
function notifyOnError() {
	alert("Error");
};

function getData(what, url, timeout, successFun, timeoutFun, errorFun) {
	$.ajax({
		async : true,
		timeout : timeout,
		headers: {'individuum':individuum},
		type : 'POST',
		url : url,
		data : what,
		cache : false,
		success : function(result, status) {
			successFun(result, status, what)
		},
		timeout : function(result, status) {
			timeoutFun()
		},
		error : function(result, status) {
			errorFun()
		}
	});
};
