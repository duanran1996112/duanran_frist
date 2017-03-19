//圣杯模式1
function inherit (C,P) {
	function F () {}
	F.prototype = P.prototype;
	C.prototype = new F();
	C.prototype.constructor = C;
	C.prototype.uber = P;
}
//圣杯模式2
var inherit = (function () {
	var F = function () {};
	return function (C,P) {
		F.prototype = P.prototype;
		C.prototype = new F();
		C.prototype.constructor = C;
		C.prototype.uber = P;
	}
}());
//浅层克隆
function clone (src,tar) {
	var tar = tar || {};
	for(var prop in src) {
		if(src.hasOwnProperty(prop))
			tar[prop] = src[prop];
	}
}
//深层克隆
function deepClone (src,tar) {
	var tar = tar || {};
	for(var prop in src) {
		if(typeof(src[prop]) === 'object') {
			tar[prop] = (src[prop].constructor === Array) ? [] : {};
			deepClone(src[prop],tar[prop]);
		}
		else {
			tar[prop] = src[prop];
		}
	}
}
//数组去重
Array.prototype.unique = function () {
	var len = this.length,
		arr = [],
	    obj = {};
	for(var i = 0 ; i < len ; i++) {
		if(!obj[this[i]]) {
			obj[this[i]] = 1;
			arr.push(this[i]);
		}
	}
	return arr;
}
//遍历元素节点数
function retChild(node) {
	var child = node.childNodes,
		len = child.length;
	for(var i = 0 ; i < len ; i++) {
		if(child[i].nodeType === 1) {
			console.log(child[i]);
			child[i].hasChildNodes() && retChild(child[i]);
		}
	}

}
//返回元素e的第n层父节点
function retParent(e,n) {
	var n = n || 0;
	if(n === 0) {
		return e;
	}	
	for(var i = 0 ; e && i < n ; i++) {
		e = e.parentNode;
	}
	return e;
}
//返回元素e的第n个兄弟节点
function retSibling(e, n){
    var n = n || 0;
    if(n === 0) {
            return e;
    }
    while(e && n != 0) {
        if(n > 0) {
            if(e.nextElementSibling){ // 如果不是ie浏览器
                e = e.nextElementSibling;
            }
            else {// 如果是ie浏览器
                e = e.nextSibling;
                while(e && e.nodeType != 1) {
                      e=e.nextSibling;
            	}
        	}
           n--;
        }
        else {
            if(e.previousElementSibling) {// 如果不是ie浏览器
                 e = e.previousElementSibling;
            }
            else {// 如果是ie浏览器
                e = e.previousSibling;
                while(e && e.nodeType != 1) {
                    e=e.previousSibling;
                }
            }
            n++;
        }
    }
    return e;
}  
//封装函数实现children功能
Element.prototype.getChildren = function () {
	var child = this.childNodes,
		len = child.length;
	var obj = {
		'length': 0,
		'push': Array.prototype.push
	}
	for(var i = 0 ; i < len ; i++) {
		if(child[i].nodeType === 1) {
			obj.push(child[i]);
		}
	}
	return obj;
}
//封装是否有元素子节点的方法
Element.prototype.hasChildren = function() {
	var child = this.childNodes,
		len = child.length;
	for(var i = 0 ; i < len ; i++) {
		if(child[i].nodeType === 1) {
			return true;
		}
	}
	return false;
}
//封装insertAfter函数
Element.prototype.insertAfter = function (targetNode,afterNode) {
	var nextSibling = afterNode.nextElementSibling;
	if(this.children.length <= 1 || !nextSibling) {
		this.appendChild(targetNode);
	}
	else {
		this.insertBefore(targetNode,nextSibling);
	}
}
//封装remove函数可以销毁自身
Element.prototype.remove = function () {
	var parent = this.parentNode;
	parent.removeChild(this);
}
//将目标节点的内部节点逆序
Element.prototype.reverseElement = function () {
	var child,
		first = this.firstChild,
		len = this.childNodes.length;
	for(var i = 0 ; i < len - 1; i++) {
		child = this.lastChild;
		this.insertBefore(child,first);
	}
}
//滚动滚动距离
function getScrollOffset () {
	if(window.pageYOffset) {
		return {
			x: window.pageXOffset,
			y: window.pageYOffset
		}
	}
	return {//ie8以下浏览器
		x: document.body.scrollLeft + document.documentElement.scrollLeft,
		y: document.body.scrollTop + document.documentElement.scrollTop
	}
}
//返回浏览器示口大小
function getViewportOffset () {
	if(window.innerWidth) {
		return {
			x: window.innerWidth,
			y: window.innerHeight
		}
	}
	if(document.compatMode == 'CSS1Compat') {//ie8以下标准模式
		return {
			x: document.documentElement.clientWidth,
			y: document.documentElement.clientHeight
		}
	}
	else {//ie8以下怪异模式
		return {
			x: document.body.clientWidth,
			y: document.body.clientHeight
		}
	}
}
//返回元素的宽高
Element.prototype.getElementOffset = function () {
	var objData = this.getBoundingClientRect();
	if(objData.width) {
		return {
			w: objData.width,
			h: objData.height
		}
	}
	else {//老版本ie没有width,height
		return {
			w: objData.right - objData.left,
			h: objData.bottom - objData.top
		}
	}
}
//求元素相对于文档的坐标
Element.prototype.getPosition = function () {
	if(!this.offsetParent) {
		return {
			w: this.offsetLeft,
			h: this.offsetTop
		}
	}
	var width = this.offsetLeft;
	var height = this.offsetTop;
	var ele = this.offsetParent;
	while(ele.offsetParent) {
		width += ele.offsetLeft;
		height += ele.offsetTop;
		ele = ele.offsetParent;
	}
	return {
		w: width,
		h: height
	}
}
//兼容获取样式的函数
function getStyle (obj,prop,fake) {//obj元素,prop""属性,fake尾元素
	var fake = fake || null;
	if(obj.currentStyle) {
		return obj.currentStyle[prop];
	}
	else {
		return window.getComputedStyle(obj,fake)[prop];
	}
}
//封装一个让小方块运动的函数
function move (id,prop) {//id尾元素id,prop为元素属性
	var ele = document.getElementById(id);
	var timer = window.setInterval(function () {
		ele.style.left = parseInt(getStyle(ele,prop)) + 1 + 'px';
		console.log(getStyle(ele,prop));
		if(parseInt(getStyle(ele,prop)) > 1000) {
			clearInterval(timer);
		}
	},10); 
}
//拖拽小方块
function moveAbout (ele) {
	var disX,disY;
	ele.addEventListener('mousedown',function (e) {
		var e = e || window.event;
		disX = e.clientX - parseInt(getStyle(this,'left'));
		disY = e.clientY - parseInt(getStyle(this,'top'));
		document.addEventListener('mousemove',mouseMove,false);
	},false);
	ele.addEventListener('mouseup',function (e) {
		document.removeEventListener('mousemove',mouseMove,false);
	},false);
	function mouseMove (e) {
		var e = e || window.event;
		ele.style.left = e.clientX - disX + 'px';
		ele.style.top = e.clientY - disY + 'px';
	}
}
//绑定事件兼容函数
function attachEvent (ele,type,handle) {
	if(ele.addEventListener) {//谷歌
		ele.addEventListener(type,handle,null);
	}
	else if(ele.attachEvent){//IE
		ele['temp' + type + handle] = handle;
		ele[type + handle] = function () {
			ele['temp' + type + handle].call(ele);
		}
		ele.attachEvent('on' + type,ele[type + handle]);
	}
	else {//句柄
		ele['on' + type] = handle;
	}
}
//解除事件绑定兼容函数
function removeEvent (ele,type,handle) {
	if(ele.removeEventListener) {//谷歌
		ele.removeEventListener(type,handle,false);
	}
	else if(ele.detachEvent) {//IE
		ele.detachEvent('on' + type,handle);
	}
	else {//句柄
		ele['on' + type]  = null;
	}
} 
//解除事件冒泡
function stopBubble (event) {
	if(event.stopPropagation) {//谷歌
		event.stopPropagation();
	}
	else {//IE
		event.cancelBubble = true;
	}
}
//阻止默认事件
function cancelHander (event) {
	if(event.preventDefault) {//谷歌
		event.preventDefault();
	}
	else {//IE
		event.returnValue = false;
	}
}
//事件委托ul li
Element.prototype.eventEntrust = function () {
	this.addEventListener('click',function (e) {
		var event = e || window.event;
		var tar = event.target || event.srcElement;//target 火狐 srcElement IE
		console.log(tar.innerHTML);
	},false);
}
//解决mousedown与click冲突问题
Element.prototype.clickProblem = function () {
	var firstTime,lastTime,flag = false;
	this.onclick = function () {
		if(flag) {
			console.log('click');
		}
		else {
			console.log('mousedown');
		}
	}
	this.onmousedown = function (e) {
		firstTime = new Date().getTime();
	}
	this.onmouseup = function (e) {
		lastTime = new Date().getTime();
		if(lastTime - firstTime < 200) {
			flag = true;
		}
		else {
			flag = false;
		}
	}
}
//兼容版本的fix定位
function beFixed (ele) {
	var initPosX = ele.getPosition().w;
	var initPosY = ele.getPosition().h;
	attachEvent(window,'scroll',function (e) {
		ele.style.top = initPosY + getScrollOffset().y + 'px';
		ele.style.left = initPosX + getScrollOffset().x + 'px';
	});
}
//ajax
function Ajax (json) {
	var method = json.method;
	var url = json.url;
	var flag = json.flag;
	var data = json.data;
	var callback = json.callback;
	var xhr = null;
	if(window.XMLHttpRequest) {
		xhr = new window.XMLHttpRequest();
	}
	else {
		xhr = new ActiveXObject('Microsoft.XMLHttp');
	}
	if(method == 'get') {
		url += '?' + data + new Date().getTime();
		xhr.open('get',url,flag);
	}
	else {
		xhr.oepn('post',url,flag);
	}
	xhr.onreadystatechange = function () {
		if(xhr.readyState == '4')
			if(xhr.status == '200')
				callback(xhr.responseText);
	}
	if(method == 'get') {
		xhr.send();
	}
	else {
		xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		xhr.send(data);
	}
}
