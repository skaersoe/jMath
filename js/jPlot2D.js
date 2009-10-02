/****************************************************************************\


	Mathematics for Javascript
	Dam Consult
	
	http://damconsult.dk
	http://gluino.com/jScience/jMath

	Copyright (c) 2009 Morten Dam | Dam Consult

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


\****************************************************************************/



// =======================================================
// = Extending the Vector class with graphics components =
// =======================================================
if (jMath.Vector) {
	Vector.prototype.Draw = function(parent) {
		var x0 = (typeof(this.offsetx) != "undefined") ? this.offsetx : 0;
		var y0 = (typeof(this.offsety) != "undefined") ? this.offsety : 0;
		this.parent = (typeof(this.parent) == "undefined") ? parent : this.parent;

		if (typeof(this.gfx) != "undefined") {
			this.gfx.attr("path", "M " + this.parent.x(x0) + " " + this.parent.y(y0) + " L " + this.parent.x(x0 + this.x) + " " +this.parent.y(y0 + this.y));
		} else {
			this.gfx = parent.r.path({stroke: "#fff"}, "M " + parent.x(x0) + " " + parent.y(y0) + "  L " + parent.x(x0 + this.x) + " " + parent.y(y0 + this.y));
		}
		return this;
	};
	Vector.prototype.Offset = function(x,y) {
		this.offsetx = x;
		this.offsety = y;
		return this;
	};
	Vector.prototype.Length = function(parent) {
		var x0 = (typeof(this.offsetx) != "undefined") ? this.offsetx : 0;
		var y0 = (typeof(this.offsety) != "undefined") ? this.offsety : 0;
		this.parent = (typeof(this.parent) == "undefined") ? parent : this.parent;

		if (typeof(this.lengfx) != "undefined") {
			this.lengfx.attr({"text" : round(this.Norm(),2), "x" : this.parent.x(x0 + this.x/2.0)+20, "y" : this.parent.y(y0  +this.y/2.0)});
		} else {
			this.lengfx = this.parent.r.text(this.parent.x(x0 + this.x/2.0)+20, this.parent.y(y0 + this.y/2.0) , round(this.Norm(),2)).attr("fill", "#fff");
		}
		return this;
	};
};

// ==================================================
// = Plot2D class for handling the demonstration =
// ==================================================
function Plot2D (args) {
	this.args = {"color" : "white", "x" : {"start" : -1, "end": 10, "step" : 0.5}, "y" : {"start" : -4, "end": 10, "step" : 1}};
	this.args = (typeof(args) == "undefined") ? this.args : args;
	
	if (typeof(args) == "undefined" || typeof(args.div) == "undefined") { // If no DOM element is defined, we create one...
		this.div = "plot2d";
		$("body").append('<div id="'+ this.div +'" style="width: 700px; height: 500px; background-color: #000;"></div>');
	} else {
		this.div = args.div;
	};
	
	this.width = $("#" + this.div).width();
	this.height = $("#" + this.div).height();
	this.r = Raphael(this.div, this.width, this.height);
	this.vectors = [];
	
	// Draw coordinate system (REQUIRED)
	this.newCoordinateSystem(this.args);

		this.title(args.title);
}

Plot2D.prototype.title = function(arg) {
	this.titlelabel = {
		"gfx" : this.r.text(this.width/2, 20, arg).attr({"fill" : "#fff"})
	};


};
// Calculate the coordinate system, and defining the scaling functions
Plot2D.prototype.newCoordinateSystem = function(args) {
	var margin = (typeof(args.margin) == "undefined") ? 20 : args.margin;
	var axiscol = (typeof(args.color) == "undefined") ? "#fff" : args.color;
	var textcol = (typeof(args.text) == "undefined") ? axiscol : args.text;
	var arrowHeads = (typeof(args.arrowhead) == "undefined") ? 5 : args.arrowhead;	 // px arrow point 
	var s = this.width/this.height;

	this.xlabel = {};
	this.xlabel.interval = args.x;
	var xzero = (this.xlabel.interval.start < 1 && this.xlabel.interval.end > 0) ? 1 : 0;
	this.xlabel.interval.n = ( xzero + Math.abs(this.xlabel.interval.start - this.xlabel.interval.end))/this.xlabel.interval.step;
	this.ylabel = {};
	this.ylabel.interval = args.y;
	var yzero = (this.ylabel.interval.start < 1 && this.ylabel.interval.end > 0) ? 1 : 0;
	var yz = yzero;
	this.ylabel.interval.n = (yzero + Math.abs(this.ylabel.interval.start - this.ylabel.interval.end))/this.ylabel.interval.step;
		
	this.dashes = {"x" : [], "y" : []};

	
	this.drawYaxis = function  (x) {
		for (var j=1; j < this.ylabel.interval.n; j++) {
		
			var y = j * (this.height-margin*2) / (this.ylabel.interval.n - yzero);
			this.dashes.x.push(
				{
				"l" : this.r.path({stroke: axiscol}).moveTo(x-2, this.height-margin - y).lineTo(x+2, this.height-margin - y),
				"d" : this.r.text(x-10, this.height-margin - y, this.ylabel.interval.start + this.ylabel.interval.step * j).attr({"fill" : textcol})
				});

		};

		this.yaxis = this.r.path({stroke: axiscol}).moveTo(x, this.height-margin).lineTo(x, margin);
		if (this.ylabel.interval.end > 0) {
			this.headytop =  this.r.path({stroke: axiscol, "fill" : axiscol}).moveTo(x, margin-arrowHeads).lineTo(x-arrowHeads, margin).lineTo(x+arrowHeads,margin).lineTo(x, margin-arrowHeads);
			
		};
		if (this.ylabel.interval.start < 0) {
			this.headytop =  this.r.path({stroke: axiscol, "fill" : axiscol}).moveTo(x, this.height-margin).lineTo(x-arrowHeads,(this.height-margin)).lineTo(x,this.height-margin + arrowHeads).lineTo(x+arrowHeads,this.height-margin);
			
		};
	};
	
	// Create the y axis scale
	this.y = function(y) {

		var tab = (this.height - margin*2) / (this.ylabel.interval.n - yzero) / this.ylabel.interval.step;
		return this.height - margin + tab* this.ylabel.interval.start  - y * tab; 
	};

	this.drawXaxis = function(y) {
		for (var i=0; i < this.xlabel.interval.n; i++) {
			var x = i * (this.width-margin*2) / (this.xlabel.interval.n - xzero);
			this.dashes.x.push(
				{
					"l" : this.r.path({stroke: axiscol}).moveTo(margin + x, y+2).lineTo(margin + x, y-2),
					"d" : this.r.text(margin + x, y+10, this.xlabel.interval.start + this.xlabel.interval.step * i).attr({"fill" :textcol})
				});
		};	
		this.xaxis = this.r.path({stroke: axiscol}).moveTo(margin, y).lineTo(this.width-margin, y);

		if (this.xlabel.interval.end > 0) {
			this.headxright =  this.r.path({stroke: axiscol, "fill" : axiscol}).moveTo(this.width-margin+arrowHeads, y).lineTo(this.width-margin, y-arrowHeads).lineTo(this.width-margin, arrowHeads+y).lineTo(this.width-margin+arrowHeads, y);
		};
		if (this.xlabel.interval.start < 0) {
			this.headxleft =  this.r.path({stroke: axiscol, "fill" : axiscol}).moveTo(margin-arrowHeads, y).lineTo(margin, y-arrowHeads).lineTo(margin, arrowHeads+y).lineTo(margin-arrowHeads, y);
		};	
	};
	
	// Create the x axis scale
	this.x =function(x) {
		var tab = (this.width - margin*2) / (this.xlabel.interval.n - xzero) / this.xlabel.interval.step;
		return margin - tab * this.xlabel.interval.start  + x * tab;
	}; 

	this.drawXaxis(this.y(0));
	this.drawYaxis(this.x(0));

	
};

// ================================
// = Various presentation objects =
// ================================
Plot2D.prototype.newVector = function(x,y) {
	var vec = new Vector(x, y, 0);
	vec.gfx = this.r.path({stroke: "#fff"}).moveTo(this.x(0), this.y(0)).lineTo(this.x(vec.x),this.y(vec.y));
	vec.parent = this;
	this.vectors.push(vec);
	return vec;
};

// Plot points (make more MATLAB compatible)
Plot2D.prototype.plot = function(x,y) {
	var plotobj = function() {
		this.objs = [];
		this.remove = function() {
			for (var i=0; i < this.objs.length; i++) {
				this.objs[i].remove();
			};
		};
	};
	var obj = new plotobj();
	
	if (x instanceof Array && y instanceof Array && x.length == y.length) {
		for (var i=0; i < x.length; i++) {
			obj.objs.push(this.r.circle(this.x(x[i]), this.y(y[i]), 1).attr("stroke", "white"));
		};
	} else {
		obj.objs.push(this.r.circle(this.x(x), this.y(y),1).attr("stroke", "white"));
	}
	return obj;
};

/*
	FIXME BUGGY, FALSE AND UGLY 
*/
Plot2D.prototype.histogram = function(x0,x1,bins) { 
	var Hist = function(x0, x1, bins, parent) {
		this.parent = parent;
		this.x0 = x0;
		this.x1 = x1;
		this.n = bins;
		this.data = new Array(this.n);
		this.binwidth =  Math.abs(this.x0 - this.x1) / this.data.length;
		this.Add = function(x) {
			this.data[round(x/this.binwidth,0)] = (	typeof(this.data[round(x/this.binwidth,0)]) == "undefined") ? x : 	this.data[round(x/this.binwidth,0)]  + x;
		};
		this.Draw = function() {
			for (var i=0; i < this.data.length; i++) {
				console.log(i, this.data[i]);
				// this.parent.r.rect(this.parent.x(this.x0 +this.binwidth*i ),this.parent.y(20),this.parent.x(this.x0+this.binwidth*i+this.binwidth),this.parent.y(0)).attr("fill", "#ccc");
				this.parent.r.circle(this.parent.x(this.x0 + this.binwidth*i), this.parent.y(this.data[i]), 2).attr("fill","#fff");
			};
		};
	};
	var h = new Hist(x0, x1, bins, this);
	return h;
};



// ================
// = Util methods =
// ================
function round(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

// Lib loaded
if (typeof jMath == "undefined") var jMath = {};
jMath.Plot2D = true;


