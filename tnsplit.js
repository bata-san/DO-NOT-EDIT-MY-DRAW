/* tnSplit.js v1.04 rev.2 (c) 2021, phpkobo.com. Free to use under the MIT license.
http://jpn.phpkobo.com/tnsplit-js */
(function(){
"use strict";

	var CElapsed = {
		now:function(){
			return (!!window.performance&&!!window.performance.now)?
				performance.now():-1;
		},
		start:function(){
			this.t0=this.now();
		},
		stop:function(){
			var t=this.now();
			return (t<0)?t:(t-this.t0);
		},
		toSec:function(t){
			return (t/1000).toFixed(3);
		}
	};

	function selectorToNodeArray(selector,def){
		var nx=[];
		if(!selector){selector=def;}
		if (Array.isArray(selector)){
			nx=selector;
		}else if(typeof(selector)==="string"){
			var n=document.querySelectorAll(selector);
			nx=[].slice.call(n);
		}else if(selector instanceof HTMLElement){
			nx.push(selector);
		}else if((selector instanceof HTMLCollection)||
			(selector.constructor.name=="NodeList")){
			nx=[].slice.call(selector);
		}
		return nx;
	};

	function rand(min,max){
		return Math.random()*(max-min)+min;
	};

	function randStr(n){
		var str="";
		var chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		var len=chars.length;
		for(var i=0;i<n;i++){
			str+=chars.charAt(Math.floor(Math.random()*len));
		}
		return str;
	};

	function forceArray(p){
		return (Array.isArray(p))?p:[p];
	};

	function str2SlUtf8Array(str){
		var ax=[];
		var q="";
		for(var i=0;i<str.length;i++){
			var c=str.charCodeAt(i);
			if(((0xD800<=c)&&(c<=0xDBFF))||((0xDC00<=c)&&(c<=0xDFFF))){
				q+=str[i];
			}else{
				if(q){
					ax.push(q);
					q="";
				}
				ax.push(str[i]);
			}
		}
		if(q){ax.push(q);}
		return ax;
	};

	var tnSplit={
		setup:function(px){

			// tagName
			this.tagName=("tagName" in px)?px.tagName:"x-x";

			// excludeClass
			this.excludeClass=forceArray(("excludeClass" in px)?
				px.excludeClass:["tns-exclude"]);

			// excludeTag
			this.excludeTag=forceArray(("excludeTag" in px)?
				px.excludeTag:["script","style","title"])
				.map(function(x){return x.toLowerCase();});

			// idPrefix
			this.idPrefix=(("idPrefix" in px)&&(px.idPrefix.length))?
				px.idPrefix:"tnsid-";

			// idPrefixLen
			this.idPrefixLen=Math.max(0,("idPrefixLen" in px)?
				px.idPrefixLen:10);

			// removeComment
			this.removeComment=("removeComment" in px)?
				px.removeComment:1;

			// stats
			this.stats={
				n_root:0,
				n_text:0,
				n_char:0
			};

			// setup once
			if(!("runcnt" in this)){
				this.runcnt=0;
			}
			if (this.runcnt==0){this.setup_once();}
			this.runcnt++;
		},
		setup_once:function(){
			// apply-classname
			this.cls_apply="tns-apply";

			// style sheet
			this.ele_style = document.createElement("style");
			document.head.appendChild(this.ele_style);
			this.sheet = this.ele_style.sheet;

			// done map
			this.done=new WeakMap();

			// whitespace regular expression
			this.re_wspace = new RegExp("^\\s*$");
		},
		makeId:function(){
			var id;
			var inc=0;
			do {
				id=this.idPrefix+randStr(this.idPrefixLen+inc);
				inc++;
			}while(document.getElementById(id));
			return id;
		},
		insertStyleRule:function(id,loc,str){
			var selector="#"+id+"::"+loc;
			if (str=="\n"){str="\\a";}
			if (str=='"'){str='\\"';}
			var prop = 'content:"'+str+'";';
			var rule=selector+'{'+prop+'}';
			this.sheet.insertRule(rule,0);
		},
		makeStyleRules:function(id,ch_b,ch_a){
			if (ch_b) {
				this.insertStyleRule(id,"before",ch_b);
				this.stats.n_char+=ch_b.length;
			}
			if (ch_a) {
				this.insertStyleRule(id,"after",ch_a);
				this.stats.n_char+=ch_a.length;
			}
		},
		makeNode:function(ch_b,ch_a){
			var id=this.makeId();
			this.makeStyleRules(id,ch_b,ch_a);
			var ele=document.createElement(this.tagName);
			ele.id=id;
			return ele;
		},
		convertStr:function(str){
			var ch_b=null;
			var ch_a=null;
			var len=str.length;
			if (len){
				ch_b=str.shift();
				len--;
				if (len){
					ch_a=str.pop();
					len--;
				}
			}
			var node=this.makeNode(ch_b,ch_a);
			var max=str.length+1;
			while(str.length>0){
				var n=Math.min(str.length,rand(1,max));
				var str0=str.slice(0,n);
				str=str.slice(n);
				node.appendChild(this.convertStr(str0));
			}
			return node;
		},
		processTextNode:function(node){
			var str=node.nodeValue;
			if (str&&!this.re_wspace.test(str)){
				node.replaceWith(this.convertStr(
					str2SlUtf8Array(str)));
				this.stats.n_text++;
			}
		},
		shouldGo:function(node){
			// done?
			if(this.done.has(node)){return false;}

			// exclude class
			var ls=this.excludeClass;
			for(var i=0;i<ls.length;i++){
				if(node.classList.contains(ls[i])){return false;}
			}

			// exclude tagName
			if(this.excludeTag.indexOf(node.tagName.toLowerCase())!=-1){
				return false;
			}

			// Go!
			return true;
		},
		collectTextNodes_x:function(data,node){
			for(var i=0;i<node.childNodes.length;i++){
				var cn=node.childNodes[i];
				var type=cn.nodeType;
				if (type==Node.ELEMENT_NODE){
					if(this.shouldGo(cn)){
						this.collectTextNodes_x(data,cn)
					}
				}else if((type==Node.TEXT_NODE)||
					(type==Node.COMMENT_NODE)){
					data.ls.push(cn);
				}
			}
		},
		collectTextNodes:function(node){
			var data={ls:[]};
			this.collectTextNodes_x(data,node);
			return data.ls;
		},
		processNodes:function(nx){
			for(var i=0;i<nx.length;i++){
				var node=nx[i];
				if(this.shouldGo(node)){
					this.stats.n_root++;
					var tnx=this.collectTextNodes(node);
					for(var j=0;j<tnx.length;j++){
						var tn=tnx[j];
						if(tn.nodeType==Node.COMMENT_NODE){
							if(this.removeComment){
								tn.remove();
							}
						}else{
							this.processTextNode(tn);
						}
					}
					this.done.set(node,1);
				}
			}
		},
		run:function(px){
			// setup
			px=(typeof(px)=="undefined")?{}:px;
			this.setup(px);
			// process
			CElapsed.start();
			var nx=selectorToNodeArray(px.selector,"."+this.cls_apply);
			this.processNodes(nx);
			this.stats.elapsed=CElapsed.stop();
			// return stats
			return this.stats;
		}
	};

	window.tnSplit=tnSplit;
}());
