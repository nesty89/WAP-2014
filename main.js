document.onreadystatechange = function() {
    var state = document.readyState;
    if (state == 'complete') {
       run();
    }
}

var lastClicked = null;
var elSimlinks = Array();
var domEl;
var pNum = 0;
var opNum = 0;
var cls;
var id;
var elFields = null;

function clickHandler(e){
	var elem, evt = e ? e:event;
 	
	if (evt.srcElement)  elem = evt.srcElement;
 	else if (evt.target) elem = evt.target;
 	if(elem != document.getElementById('dom') && elem != document.getElementById('normalPage') && elem.getAttribute('class') != 'no-tree'){
	 	unColor();
	 	setClicked(elem);
		addColor();
		fillFields();
	}
 	return true;
}

document.onclick = clickHandler;


function prepareLayout(){
	var el = document.body;
	addToElemPre(el, '\n<div id="normalPage">\n');
	
	addToElemPos(el, '\n</div>\n <div id="dom"><form class="no-tree"><label class="no-tree">id: </label><input name="id_edit" type="text" class="no-tree"> <label class="no-tree">class: </label><input name="class_edit" class="no-tree" type="text"> <input type="button" value="change" class="no-tree" onclick="javascript:changeClsId()">\n</div>\n');	
	domEl = document.getElementById("dom");
	cls = document.getElementsByName('class_edit')[0];
	id = document.getElementsByName('id_edit')[0];
	opNum = document.getElementsByTagName('P').length;
}

function loadTree(el){
	var name = el.tagName.toLowerCase();
	var attr = el.attributes;
	var text = "";	
	var elems = document.getElementsByTagName(el.tagName);
	var index;

	if(el.getAttribute('id') == "dom"){
		return;
	}

	if(el.getAttribute("id") != "normalPage"){
		text = "&lt" + name;
		
		for(i = 0; i < attr.length; i++){
			text += " " + attr.item(i).nodeName + '="' + attr.item(i).nodeValue + '"';
		}
		text += "&gt";
		var newNode = document.createElement('P');
		newNode.innerHTML = text;
		domEl.appendChild(newNode);
		pNum++;
		var prePNum = pNum;
		for(i = 0; i < elems.length;i++){
			if(elems[i] == el){
				index = i;
				if(elSimlinks[el.tagName] == null){
					elSimlinks[el.tagName] = Array();
				}
				if(elSimlinks[el.tagName][i] == null){
					elSimlinks[el.tagName][i] = Array();
				}
				if(elSimlinks[el.tagName][i]['P'] == null){
					elSimlinks[el.tagName][i]['P'] = Array();
				}
				elSimlinks[el.tagName][i]['P'].push(pNum); 

				if(elSimlinks['P'] == null){
					elSimlinks['P'] = Array();
				}
				if(elSimlinks['P'][pNum] == null){
					elSimlinks['P'][pNum] = Array();
				}
				if(elSimlinks['P'][pNum][el.tagName] == null){
					elSimlinks['P'][pNum][el.tagName] = Array();
				}
				elSimlinks['P'][pNum][el.tagName].push(i);

			}
		}
	}

	if(el.hasChildNodes()){
		var child = el.firstChild;
	} else {
		child = null;
	}
	
	while(child != null){
		if(child.innerHTML != undefined ){
			loadTree(child);
		}
		child = getNextSibling(child);			
	}
	if(el.getAttribute("id") != "normalPage"){ 
		var newNode = document.createElement('P');
		newNode.innerHTML = '&lt/'+ name + '&gt';
		domEl.appendChild(newNode);
		pNum++;
		elSimlinks[el.tagName][index]['P'].push(pNum);
		if(elSimlinks['P'][pNum] == null){
			elSimlinks['P'][pNum] = Array();
		}
		if(elSimlinks['P'][pNum][el.tagName] == null){
			elSimlinks['P'][pNum][el.tagName] = Array();
		}
		elSimlinks['P'][pNum][el.tagName].push(index);
		if(elSimlinks['P'][prePNum]['P'] == null){
			elSimlinks['P'][prePNum]['P'] = Array();
		}
		elSimlinks['P'][prePNum]['P'].push(pNum);
		if(elSimlinks['P'][pNum]['P'] == null){
			elSimlinks['P'][pNum]['P'] = Array();
		}
		elSimlinks['P'][pNum]['P'].push(prePNum);
	}
}

function run(){
	prepareLayout();
	loadTree(document.documentElement, 0);
}

function log(text){
	console.log(text);
}

function getNextSibling(el){
	ns = el.nextSibling;
		
	if (!ns) {
		return null;
	}

	while (ns.nodeType != 1) { 
		ns = ns.nextSibling;
		if (!ns){
			return null;
		}
	}

	return ns;
}

function addToElemByIdPre(id, text){
	var el = document.getElementById(id);
	el.innerHTML = text + el.innerHTML;
}

function addToElemByIdPos(id, text){
	var el = document.getElementById(id);
	el.innerHTML += text;
}

function addToElemPre(el, text){
	el.innerHTML = text + el.innerHTML;
}

function addToElemPos(el, text){
	el.innerHTML += text;
}

function setClicked(el){
	lastClicked = el;

	if(lastClicked.tagName == "P"){
		var elems = document.getElementsByTagName("P");
		for(var i = 0; i < elems.length; i++){
			if(elems[i] == lastClicked){
				if(i < opNum){
					elFields = lastClicked;
					break;
				} else {
					var x;
					for ( x in elSimlinks["P"][i]) {
						break;
					}
					var elms = document.getElementsByTagName(x);	
					elFields = elms[elSimlinks["P"][i][x][0]];
					
				}
			} 
		}
	} else {
		elFields = lastClicked;
	}
}



function unColor(){
	if(lastClicked != null){
		var elems = document.getElementsByTagName(lastClicked.tagName);
		for(i = 0; i < elems.length;i++){

			if(elems[i] == lastClicked){
				for (var x in elSimlinks[lastClicked.tagName][i]){
					var tmp = document.getElementsByTagName(x);
					for( j = 0; j < elSimlinks[lastClicked.tagName][i][x].length; j++){
						tmp[elSimlinks[lastClicked.tagName][i][x][j]].className = tmp[elSimlinks[lastClicked.tagName][i][x][j]].className.replace(/\bhighlight\b/,'');
					}
				}
			}
		}
		lastClicked.className = lastClicked.className.replace(/\bhighlight\b/,'');

		var elems = document.getElementsByTagName(elFields.tagName);
		for(var i = 0; i < elems.length; i++){
			if(elems[i] == elFields){
				var pid = elSimlinks[elFields.tagName][i]['P'][0];
				var els = document.getElementsByTagName('P');
				text = "&lt" + elFields.tagName.toLowerCase();
				var attr = elFields.attributes;
				for(i = 0; i < attr.length; i++){
					text += " " + attr.item(i).nodeName + '="' + attr.item(i).nodeValue + '"';
				}
				text += "&gt";
				els[pid].innerHTML = text;
				break;
			}
		}
	}
}

function addColor(){
	var elems = document.getElementsByTagName(lastClicked.tagName);
	for(i = 0; i < elems.length;i++){

		if(elems[i] == lastClicked){
			for (var x in elSimlinks[lastClicked.tagName][i]){
				var tmp = document.getElementsByTagName(x);
				for( j = 0; j < elSimlinks[lastClicked.tagName][i][x].length; j++){
					tmp[elSimlinks[lastClicked.tagName][i][x][j]].className += " highlight";
				}
			}
		}
	}
	lastClicked.className += " highlight";

	var elems = document.getElementsByTagName(elFields.tagName);
	for(var i = 0; i < elems.length; i++){
		if(elems[i] == elFields){
			var pid = elSimlinks[elFields.tagName][i]['P'][0];
			var els = document.getElementsByTagName('P');
			text = "&lt" + elFields.tagName.toLowerCase();
			var attr = elFields.attributes;
			for(i = 0; i < attr.length; i++){
				text += " " + attr.item(i).nodeName + '="' + attr.item(i).nodeValue + '"';
			}
			text += "&gt";
			els[pid].innerHTML = text;
			break;
		}
	}
}


function changeClsId(){
	elFields.setAttribute('class', cls.value);
	elFields.setAttribute('id', id.value);

	var elems = document.getElementsByTagName(elFields.tagName);
	for(var i = 0; i < elems.length; i++){
		if(elems[i] == elFields){
			var pid = elSimlinks[elFields.tagName][i]['P'][0];
			var els = document.getElementsByTagName('P');
			text = "&lt" + elFields.tagName.toLowerCase();
			var attr = elFields.attributes;
			for(i = 0; i < attr.length; i++){
				text += " " + attr.item(i).nodeName + '="' + attr.item(i).nodeValue + '"';
			}
			text += "&gt";
			els[pid].innerHTML = text;
			break;
		}
	}
	

}

function fillFields(){
	var lCId = elFields.getAttribute('id');
	var lCClass = elFields.getAttribute('class');

	id.value = "";
	cls.value = "";

	if(lCId != null){
		id.value = lCId;
	}
	
	if(lCClass != null){
		cls.value = lCClass;
	}
}

/*funkce vraci posledni kliknuty element z puvodni stranky*/
function getSelectedElement(){
	return elFields;
}