function dgebi(a){return document.getElementById(a);}
 
var cr=false;
var ff=true;
var c;
var w=window.innerWidth;
var h=window.innerHeight;
var cur_id = 0;
var l_get = 0;
var last_path = [];
var cp=[];
var col = "000000";
var lw = 5;
var dd=false;
function error(d){
	if(!d) return;
	if(d.error){
		alert(d.error);
	}
	if(d.orid){
		cur_id = d.orid+1;
	}
	if(d.orid && d.id){
		ow_p.push(d.id);
	}
}
function receive(){
	$.getJSON("jumal.php?action=gpfp&value="+l_get,function(d){
		if(dd) c.closePath();
		for(var i=0;i<d.path.length;i++){
			c.lineWidth=d.path[i].width;
			c.strokeStyle="#"+d.path[i].color;
			c.beginPath();
			for(var x=0;x<d.path[i].data.length;x++){
				if(x==0) c.moveTo(d.path[i].data[x][0],d.path[i].data[x][1]);
				c.lineTo(d.path[i].data[x][0],d.path[i].data[x][1]);
			}
			c.stroke();
			c.closePath();
		}
		c.lineWidht=lw;
		c.strokeStyle="#"+col;
		if(dd)c.beginPath();
		c.moveTo(cp[0],cp[1]);
		if(d.id) l_get = d.id;
		setTimeout(receive,300);
	});
}
 
 
function transmit(p,color,line_width){
	var dstr="";
	for(var x=0;x<p.length;x++){
		dstr += p[x][0] + "," + p[x][1];
		if( x+1 != p.length ){
			dstr += "|";
		}
	}
	dstr = "jumal.php?action=tp&orid="+cur_id+"&value="+dstr+"&color="+color+"&lw="+line_width;
	$.getJSON(dstr,error);
}
 
function updtMouse(e){
	curX=e.pageX;
	curY=e.pageY;
	if(cr){
		if(ff){
			c.moveTo(curX,curY);
			last_path.push([curX,curY]);
			ff=false;
		}
		else{
			c.lineTo(curX,curY);
			last_path.push([curX,curY]);
			c.stroke();
		}
	}
	cp[0]=curX;
	cp[1]=curY;
 
}
 
 
function init(){
	document.body.onmousedown=function(a){cr=true;ff=true;c.beginPath();dd=true;}
	document.body.onmouseup=function(a){cr=false;c.closePath();transmit(last_path,col,lw);last_path=[];dd=false;}
	c.lineCap="round";
	c.lineJoin="round";
	c.lineWidth=5;
	c.fillStyle="white";
 
	document.body.style.cursor="crosshair";
	receive();
}
window.addEventListener("load",function(){dgebi("canv").width=window.innerWidth;dgebi("canv").height=window.innerHeight;c=dgebi("canv").getContext("2d");init();},true);
 
document.onmousemove=updtMouse;
