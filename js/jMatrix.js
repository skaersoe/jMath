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


/*
	TODO Make a clone function
	TODO use clone function to do new instances of the matix on elementary row operations
*/
function Matrix (m) {
	if (m.constructor == Array) {
		
		// Get row dimension
		this.rowlength = m.length; 
		
		// Get column dimension
		this.columnlength = m[0].length;
		for (var i = m.length - 1; i >= 0; i--){
			if (!(m[i].constructor == Array) || !(this.columnlength == m[i].length)) {
				throw("Fail, row: " + i + " not valid.");
			};
		};
		// is square?
		this.isSquare = (this.rowlength == this.columnlength) ? true : false;
		
		// Container for arrays
		this.mat = m;
	} else {
		throw("Incorrect format.");
	}

}

// Row exchange
Matrix.prototype.rowex = function(i,j) {
	var tmp = this.mat[i];
	this.mat[i] = this.mat[j];
	this.mat[j] = tmp;
	return this;
};

// Row multiplication
Matrix.prototype.rowmul = function(row, scalar) {
	for (var i=0; i < this.mat[row].length; i++) {
		this.mat[row][i] = scalar * this.mat[row][i]; 
	};
	return this;
};

// Row addition
Matrix.prototype.rowadd = function(row,other,scalar) {

		for (var i=0; i < this.mat[row].length; i++) {
			this.mat[row][i] = this.mat[row][i] +  scalar*this.mat[other][i];
		};
	return this;
};


//Transpose matrix
Matrix.prototype.T = function() {
	var ta = new empty([this.columnlength, this.rowlength]);
	
	for (var i=0; i < this.rowlength; i++) {
		for (var j=0; j < this.columnlength; j++) {
			ta.mat[j][i] = this.mat[i][j];
		};
	};
	return ta;
};
//Multiply matrix by B
Matrix.prototype.Mult = function(B) {
	if (B.constructor == Matrix){ 		// Matrix multiplication
		if (this.columnlength == B.rowlength) {

			var C = new zeros([this.rowlength, B.columnlength]);

			// naive alg.
			for (var i=0; i < C.rowlength; i++) {
				for (var j=0; j < C.columnlength; j++) {
					for (var k=0; k < this.columnlength; k++) {
						C.mat[i][j] = C.mat[i][j] + this.mat[i][k] * B.mat[k][j];
					};
				};
			};
			return C;
		} else {
			throw("Matrixmultiplication failed, dimension mismatch.");
		}
		
	} else if (B.constructor == Number) { // Scalar multiplication
		return this.Scale(B);
		
	} else if (B.constructor == Vector){ // Matrix * vector multiplication
		if (this.columnlength == B.dim) {
			var v = new Matrix([[B.x], [B.y], [B.z]]);
			return this.Mult(v);
		} else {
			throw("Multiplication failed, dimensions don't match.");
		};
	}
	else {
		throw("Multiplication failed, wrong type.");
	}
};

Matrix.prototype.Scale = function(s) {
	var B = new empty([this.rowlength, this.columnlength]);
	for (var i=0; i < this.rowlength; i++) {
		for (var j=0; j < this.columnlength; j++) {
			B.mat[i][j] = this.mat[i][j]*s;
		};
	};
	return B;
};

Matrix.prototype.Add = function(B) {
	if (this.columnlength == B.columnlength && this.rowlength == B.rowlength) {
		// this + B
		var C = new empty([this.rowlength, B.columnlength]);
		for (var i=0; i < C.rowlength; i++) {
			for (var j=0; j < C.columnlength; j++) {
				C.mat[i][j] = this.mat[i][j] + B.mat[i][j];
			};
		};
		return C;
	} else {
		throw("Addition failed, invalid dimensions.");
	}
};
Matrix.prototype.Sub = function(B) {
	if (this.columnlength == B.columnlength && this.rowlength == B.rowlength) {
		// this - B
		var C = new empty([this.rowlength, B.columnlength]);
		for (var i=0; i < C.rowlength; i++) {
			for (var j=0; j < C.columnlength; j++) {
				C.mat[i][j] = this.mat[i][j] - B.mat[i][j];
			};
		};
		return C;
	} else {
		throw("Subtraction failed, invalid dimensions.");
	}
};

// String containing HTML table representation
Matrix.prototype.print = function() {
	var html = '<table class="matrix">';
	for (var i=0; i < this.rowlength; i++) {
		html+= "<tr>";
		for (var j=0; j < this.columnlength; j++) {
			html+= "<td>" + this.mat[i][j] + "</td>";
		};
		html+="<tr>";
	};
	html += "<table>";
	return html;
};
Matrix.prototype.toVector = function() {
	if (jMath.Vector && this.columnlength == 1 && this.rowlength == 3) {
		return new Vector(this.mat[0][0], this.mat[1][0], this.mat[2][0]);
	} else {
		throw ("jMath Vectors must be loaded. and the dimensions must conform to a 3-Vector");
	};
};


//  A 2d matrix with dim [n,m] with undefined values
function empty(dim) {
	var a = new Array(dim[0]);
	for (var i=0; i < a.length; i++) {
		a[i] = new Array(dim[1]);
	};
	return new Matrix(a);
}

// a 2d matrix with dim [n,m] with zeros on all places
function zeros(dim) {
	var a = new empty(dim);
	for (var i=0; i < a.rowlength; i++) {
		for (var j=0; j < a.columnlength; j++) {
			a.mat[i][j] = 0.0;
		};
	};
	return a;
}

// a 2d matrix with ones on all places [n,m]
function ones(dim) {
	var a = new empty(dim);
	for (var i=0; i < a.rowlength; i++) {
		for (var j=0; j < a.columnlength; j++) {
			a.mat[i][j] = 1.0;
		};
	};
	return a;
}

// The square identity matrix of rank dim
function eye(dim) {
	var a = new zeros([dim, dim]);
	for (var i=0; i < a.rowlength; i++) {
		a.mat[i][i] = 1;
	};
	return a;
}

// Loaded
if (typeof jMath == "undefined") var jMath = {};
jMath.Matrix = true;