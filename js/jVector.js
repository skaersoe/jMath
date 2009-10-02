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
	TODO Make n-vectors possible
*/

// ===========================================================================
// = Cartesian 3-Vector Class                                                =
// ===========================================================================
function Vector(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
	this.dim = 3;
}
// Transform Cartesian to Spherical 
Vector.prototype.Spherical = function(){     
    var r =  Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
    return new SphericalVector(
        r,
        Math.atan2(this.y,this.x),
        Math.acos(this.z/r)
    );
};
// Transform Cartasian to Cylindrical
Vector.prototype.Cylindrical = function(){
    return {
        r: Math.sqrt(this.x*this.x + this.y*this.y),
        theta: Math.atan2(this.y, this.x),
        z: this.z
    };
    
};

// L2 Norm of Cartasian vector
Vector.prototype.Norm = function(){
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
};

// The square of the L2 norm
Vector.prototype.Norm2Sqr = function() {
	return this.x*this.x + this.y*this.y + this.z*this.z;
};

// the L1 norm  
Vector.prototype.Norm1 = function() {
	return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z);
};

// Dot-product of a Cartasian and another p2
Vector.prototype.Dot = function(p2){
    return this.x*p2.x + this.y*p2.y + this.z*p2.z;
};

// Scalar multiplication of vector and scalar s
Vector.prototype.Scale = function(s){
    return new Vector(
        this.x * s,
        this.y * s,
        this.z * s);
};

// Cross product with this vector and the vector p2
Vector.prototype.Cross = function(p2) {
    return new Vector(
        this.y*p2.z - this.z*p2.y,
        this.z*p2.x - this.x*p2.z,
        this.x*p2.y - this.y*p2.x
    );
};

// Component wise multiplication of this vector and the vector v2 
Vector.prototype.Mult = function(p2){
    return new Vector(
	        this.x * p2.x,
	        this.y * p2.y,
	        this.z * p2.z
    );
};

// Addition of this vector and the vector p2
Vector.prototype.Add = function(p2){
    return new Vector(
	        this.x + p2.x,
	        this.y + p2.y,
	        this.z + p2.z
    );
};

// Subtraction of this vector and the vector p2
Vector.prototype.Sub = function(p2){
    return new Vector(
	        this.x - p2.x,
	        this.y - p2.y,
	        this.z - p2.z
    );
};

//The Squareroot of each component
Vector.prototype.Sqrt = function() {
	return new Vector(
		Math.sqrt(this.x),
		Math.sqrt(this.y),
		Math.sqrt(this.z)
		);
};

// Square each element
Vector.prototype.Sqr = function() {
	return new Vector(
		Math.pow(this.x,2),
		Math.pow(this.y,2),
		Math.pow(this.z,2)
		);
};

// Take the absolute value of the vector
Vector.prototype.Abs = function() {
	return new Vector(
		Math.abs(this.x),
		Math.abs(this.y),
		Math.abs(this.z)
		);
};

// Less then
Vector.prototype.lt = function(p2) {
	if (this.x < p2.x && this.y < p2.y && this.z < p2.z) return true;
	return false;
};

// Greater then
Vector.prototype.gt = function(p2) {
	if (this.x > p2.x && this.y > p2.y && this.z > p2.z) return true;
	return false;
};

// Equal to
Vector.prototype.eq = function(p2) {
	if (this.x == p2.x && this.y == p2.y && this.z == p2.z) return true;
	return false;
};


//Return the unit vector with the same direction
Vector.prototype.Unit = function() {
	    return this.Scale(1.0/this.Norm());
};


// Convert to Matrix form
Vector.prototype.toMatrix = function() {
	if (jMath.Matrix) { // Require jMatrix
		return new Matrix([[this.x], [this.y], [this.z]]);
	} else {
		throw("Error, jMatrix must be loaded before conversion to Matrix");
	};
};

// 3D rotations (in Radians)
Vector.prototype.Rotate = function(x,y,z) {
	if (jMath.Matrix) { // Require jMatrix
		var R1 = new Matrix([
			[1,0,0],
			[0,Math.cos(x), -Math.sin(x)],
			[0, Math.sin(x), Math.cos(x)]
		]);

		var R2 = new Matrix([
			[Math.cos(y), 0, Math.sin(y)],
			[0,1,0],
			[-Math.sin(y), 0, Math.cos(y)]
		]);
		var R3 = new Matrix([
			[Math.cos(z), -Math.sin(z), 0], 
			[Math.sin(z), Math.cos(z), 0], 
			[0,0,1]
		]);
		
		return R3.Mult(R2).Mult(R1).Mult(this).toVector();

	} else {
		throw("Error, Rotations requires jMatrix.");
	};
};

// Return a table with the components
Vector.prototype.print = function() {
	var html = '<table class="vector">';
	html += '<tr><td>' + this.x + '</td></tr><tr><td>' + this.y + '</td></tr><tr><td>' + this.z + '</td></tr>';
	html += "<table>";
	return html;
};

    
// ===========================================================================
// = Spherical 3-Vector Class                                                =
// ===========================================================================
// Reference: http://en.wikipedia.org/wiki/Spherical_coordinates
function SphericalVector (r, phi, theta) {
	this.r = r;
	this.phi = phi;
	this.theta = theta;
}
SphericalVector.prototype.Cartesian = function() {
	return new Vector(
			this.r * Math.sin(this.theta) * Math.cos(this.phi),
			this.r * Math.sin(this.theta) * Math.sin(this.phi),
			this.r * Math.cos(theta)
		);
};
SphericalVector.prototype.Cylindrical = function() {
	return new CylindricalVector(
			this.r * Math.sin(this.theta),
			this.phi,
			this.r * Math.cos(this.theta)
		);
};


// ===========================================================================
// = Cylindrical 3-Vector Class                                              =
// ===========================================================================
// Reference: http://en.wikipedia.org/wiki/Cylindrical_coordinate_system
function CylindricalVector (rho, phi, z) {
	this.rho = rho;
	this.phi = phi;
	this.z = z;
}
CylindricalVector.prototype.Cartesian = function() {
	return new Vector(
			this.rho * Math.cos(this.phi),
			this.rho * Math.sin(this.phi),
			this.z
		);
};
CylindricalVector.prototype.Spherical = function() {
	return new SphericalVector(
		Math.sqrt(this.rho*this.rho + this.z * this.z),
		Math.atan2(this.rho, this.z),
		this.rho
		);
};


// Lib loaded
if (typeof jMath == "undefined") var jMath = {};
jMath.Vector = true;