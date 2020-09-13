
var keywords = "var,function,if,for,while,try,catch".split(",");

var loop = -1;
var ctx;
var runInd;
var canvas;
var editor;
var output;
var input;

var keyd;
var keyu;
var moused;
var mouseu;
var mousem;

function run(){
	if(loop<0){
		eval(editor.innerText);
		try {
			init();
		} catch(e){
			console.error(e);
		}
		document.addEventListener("keydown", keyDown);
		document.addEventListener("keyup", keyUp);
		document.addEventListener("mousedown", mouseDown);
		document.addEventListener("mouseup", mouseUp);
		document.addEventListener("mousemove", mouseMove);
		keyd = keyDown;
		keyu = keyUp;
		moused = mouseDown;
		mouseu = mouseUp;
		mousem = mouseMove;
		ctx = canvas.getContext("2d");
		loop = setInterval(function(){
			try {
				run(ctx);
			} catch(e){
				console.error(e);
			}
		}, 1000/20);
		runInd.style.background = "#0f0";
		runInd.title = "running";
		output.focus();
	} else {
		stop();
		run();
	}
}

function stop(){
	document.removeEventListener("keydown", keyd);
	document.removeEventListener("keyup", keyu);
	document.removeEventListener("mousedown", moused);
	document.removeEventListener("mouseup", mouseu);
	document.removeEventListener("mousemove", mousem);
	clearInterval(loop);
	runInd.style.background = "#f00";
	runInd.title = "stopped";
	loop = -1;
}

function onload(){
	runInd = document.querySelector("#runInd");
	canvas = document.querySelector("#canvas");
	editor = document.querySelector("#editor");
	output = document.querySelector("#output");
	input = document.querySelector("#input");
	
	editor.addEventListener("keydown", editorKeyDown);
	editor.addEventListener("keyup", editorKeyUp);
	input.addEventListener("keydown", inputKeyDown);
	window.addEventListener("beforeunload", windowClose);
	
	if("jside.editor" in localStorage){
		editor.innerText = localStorage["jside.editor"];
	}
	
	console.log = function(e){
		output.innerHTML += JSON.stringify(e)+"<br>";
		output.scroll(0, output.scrollHeight);
	};
	
	console.warn = function(e){
		output.innerHTML += '<span style="color:yellow">'+e+'</span><br>';
		output.scroll(0, output.scrollHeight);
	}
	
	console.error = function(e){
		output.innerHTML += '<span style="color:red">'+e+'</span><br>';
		output.scroll(0, output.scrollHeight);
	};
	
}

function inputKeyDown(e){
	if(e.which==13){
		e.preventDefault();
		try{
			var res = eval(input.innerText);
			console.log(res);
		} catch(e){
			console.error(e);
		}
		input.innerText = "";
	}
}

function editorKeyDown(e){
	if(e.code=="KeyS"&&e.ctrlKey){
		e.preventDefault();
		localStorage["jside.editor"] = editor.innerText;
	}
	if(e.which==9){
		insert("&nbsp;&nbsp;&nbsp;");
		e.preventDefault();
	}
}

function editorKeyUp(e){
	
}

function insert(t){
	var sel = window.getSelection();
	range = sel.getRangeAt(0);
	range.deleteContents();
	var node = document.createElement("span");
	node.innerHTML = t;
	range.insertNode(node);
	range.collapse();
}

function windowClose(e){
	localStorage["jside.editor"] = editor.innerText;
}

function resize(x, y){
	canvas.width = x;
	canvas.height = y;
}
