// 
// ////////// Examples ////////////////////////////////////////
// 

$(document).ready(function() {
	var A = new Matrix([[10,10], [10, 10]]);
	$("body").append("A = " + A.print());
	var B = new Matrix([[5,0], [0, 5]]);
		$("body").append("B = " + B.print());

	var C = A.Mult(B);
		$("body").append("C = A*B =  " + C.print());

	var D = new Matrix([[-5.0, 2.3],[1, 0]]);
		$("body").append("D = " + D.print());

	var E = D.Mult(C);
		$("body").append("E = D*C " + E.print());

	console.log("E*1.3", E.Mult(1.3));
	$("body").append("E*1.3 = " + E.Mult(1.3).print());
	
	var F = E.Add(A);
	$("body").append("F = E+A " + F.print());	
	$("body").append("F' = " + F.T().print());
		
	
	var Q = new Matrix([[1,2,3],[4,5,6],[7,8,9]]);
	var v = new Vector(1,2,3);
	var m = Q.Mult(v);
	$("body").append("mV = Q*v" + m.print());
	
	var V = new Matrix([[1],[3],[6]]);
	console.log(V.toVector().Norm());
	
		$("body").append("before row ex", Q.print());
	$("body").append("row ex", Q.rowex(1,2).print());
		$("body").append("before row ex", Q.print());
});

// // 2 x 2 Matrix
// var  A = new matrix([[1,2],
// 					 [3,4]]);
// 		
// console.log(A.mat);
// 
// //// Elementary Matrix operations ////
// 
// // Exchange row 0 and 1
// A.rowex(0,1);
// console.log(A.mat);
// 
// // Scalar multiply row 0 with 2
// A.rowmul(0,2);
// console.log(A.mat);
// 
// // Add row 1 times -4 to row 0
// A.rowadd(0,1,-4);
// console.log(A.mat);
// 
// // Matrix operations
// 
// var  B = new matrix([[2,6],
// 					 [4,3]]);
// 					
// 
// // Matrix multiply A and B
// var C = mul(A,B);
// console.log(C.mat);
// 
// // Identity matrix 2x2
// var D = eye(2);
// console.log(D.mat);
// 
// 
// // console.log(A.mat);
// var B = A.transpose();
// 
// // console.log(B);
// // var v = eye(4);
// // console.log(v);
// 
// var k = mul(A,scalar(D,2));
// // console.log(k.mat);
// 
// console.log(print(A));
// 
// 
