/*
The MIT License (MIT)

Copyright (c) <2010> <Roberto Gonzalez. http://stormcolour.appspot.com/>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */


/**
* @class
* @constructor
* @augments StormNode

* @property {String} objectType
* @property {StormV3} direction
*/
StormLight = function() {
	this.objectType = 'light';
	
	this.type; // sun | spot
	this.color; // $V3 (0-1,0-1,0-1)
	this.direction = $V3([0.01,-0.5,0.01]);
	
	this.nodeCtxWebGL; // nodo objeto ctxWebGL
	
	this.mrealWMatrix = $M16([1.0, 0.0, 0.0, 0.0,
							  0.0, 1.0, 0.0, 0.0,
							  0.0, 0.0, 1.0, 0.0,
							  0.0, 0.0, 0.0, 1.0]);
	this.mrealRotationLocalSpaceMatrix = $M16([1.0, 0.0, 0.0, 0.0,
											   0.0, 1.0, 0.0, 0.0,
											   0.0, 0.0, 1.0, 0.0,
											   0.0, 0.0, 0.0, 1.0]);
};
StormLight.prototype = new StormNode();
 
/**
* @type Void
* @param {StormV3} value normalize $V3 or Int kelvins(1000K-15000K)
*/
StormLight.prototype.setLightColor = function(color) { 
	var typeV3 = color instanceof StormV3;
	if(typeV3) {
		var vecColor = color;	
	} else {
		// http://en.wikipedia.org/wiki/Color_temperature
		// CIE 1931  2 degree CMFs with Judd Vos corrections http://www.vendian.org/mncharity/dir3/blackbody/UnstableURLs/bbr_color.html
		// 1000k - 15000k (100 en 100)
		var arrK = new Float32Array([1.0000,0.0337,0.0000,1.0000,0.0592,0.0000,1.0000,0.0846,0.0000,1.0000,0.1096,0.0000,1.0000,0.1341,0.0000,1.0000,0.1578,0.0000,1.0000,0.1806,0.0000,1.0000,0.2025,0.0000,1.0000,0.2235,0.0000,1.0000,0.2434,0.0000,1.0000,0.2647,0.0033,1.0000,0.2889,0.0120,1.0000,0.3126,0.0219,1.0000,0.3360,0.0331,1.0000,0.3589,0.0454,1.0000,0.3814,0.0588,1.0000,0.4034,0.0734,1.0000,0.4250,0.0889,1.0000,0.4461,0.1054,1.0000,0.4668,0.1229,1.0000,0.4870,0.1411,1.0000,0.5067,0.1602,1.0000,0.5259,0.1800,1.0000,0.5447,0.2005,1.0000,0.5630,0.2216,1.0000,0.5809,0.2433,1.0000,0.5983,0.2655,1.0000,0.6153,0.2881,1.0000,0.6318,0.3112,1.0000,0.6480,0.3346,1.0000,0.6636,0.3583,1.0000,0.6789,0.3823,1.0000,0.6938,0.4066,1.0000,0.7083,0.4310,1.0000,0.7223,0.4556,1.0000,0.7360,0.4803,1.0000,0.7494,0.5051,1.0000,0.7623,0.5299,1.0000,0.7750,0.5548,1.0000,0.7872,0.5797,1.0000,0.7992,0.6045,1.0000,0.8108,0.6293,1.0000,0.8221,0.6541,1.0000,0.8330,0.6787,1.0000,0.8437,0.7032,1.0000,0.8541,0.7277,1.0000,0.8642,0.7519,1.0000,0.8740,0.7760,1.0000,0.8836,0.8000,1.0000,0.8929,0.8238,1.0000,0.9019,0.8473,1.0000,0.9107,0.8707,1.0000,0.9193,0.8939,1.0000,0.9276,0.9168,1.0000,0.9357,0.9396,1.0000,0.9436,0.9621,1.0000,0.9513,0.9844,0.9937,0.9526,1.0000,0.9726,0.9395,1.0000,0.9526,0.9270,1.0000,0.9337,0.9150,1.0000,0.9157,0.9035,1.0000,0.8986,0.8925,1.0000,0.8823,0.8819,1.0000,0.8668,0.8718,1.0000,0.8520,0.8621,1.0000,0.8379,0.8527,1.0000,0.8244,0.8437,1.0000,0.8115,0.8351,1.0000,0.7992,0.8268,1.0000,0.7874,0.8187,1.0000,0.7761,0.8110,1.0000,0.7652,0.8035,1.0000,0.7548,0.7963,1.0000,0.7449,0.7894,1.0000,0.7353,0.7827,1.0000,0.7260,0.7762,1.0000,0.7172,0.7699,1.0000,0.7086,0.7638,1.0000,0.7004,0.7579,1.0000,0.6925,0.7522,1.0000,0.6848,0.7467,1.0000,0.6774,0.7414,1.0000,0.6703,0.7362,1.0000,0.6635,0.7311,1.0000,0.6568,0.7263,1.0000,0.6504,0.7215,1.0000,0.6442,0.7169,1.0000,0.6382,0.7124,1.0000,0.6324,0.7081,1.0000,0.6268,0.7039,1.0000,0.6213,0.6998,1.0000,0.6161,0.6958,1.0000,0.6109,0.6919,1.0000,0.6060,0.6881,1.0000,0.6012,0.6844,1.0000,0.5965,0.6808,1.0000,0.5919,0.6773,1.0000,0.5875,0.6739,1.0000,0.5833,0.6706,1.0000,0.5791,0.6674,1.0000,0.5750,0.6642,1.0000,0.5711,0.6611,1.0000,0.5673,0.6581,1.0000,0.5636,0.6552,1.0000,0.5599,0.6523,1.0000,0.5564,0.6495,1.0000,0.5530,0.6468,1.0000,0.5496,0.6441,1.0000,0.5463,0.6415,1.0000,0.5431,0.6389,1.0000,0.5400,0.6364,1.0000,0.5370,0.6340,1.0000,0.5340,0.6316,1.0000,0.5312,0.6293,1.0000,0.5283,0.6270,1.0000,0.5256,0.6247,1.0000,0.5229,0.6225,1.0000,0.5203,0.6204,1.0000,0.5177,0.6183,1.0000,0.5152,0.6162,1.0000,0.5128,0.6142,1.0000,0.5104,0.6122,1.0000,0.5080,0.6103,1.0000,0.5057,0.6084,1.0000,0.5035,0.6065,1.0000,0.5013,0.6047,1.0000,0.4991,0.6029,1.0000,0.4970,0.6012,1.0000,0.4950,0.5994,1.0000,0.4930,0.5978,1.0000,0.4910,0.5961,1.0000,0.4891,0.5945,1.0000,0.4872,0.5929,1.0000,0.4853,0.5913,1.0000,0.4835,0.5898,1.0000,0.4817,0.5882,1.0000,0.4799,0.5868,1.0000,0.4782,0.5853,1.0000,0.4765,0.5839,1.0000,0.4749,0.5824,1.0000]);
		var selK = Math.round(color/100)-10;
		var idARRK = selK*3;
		var vecColor = $V3([arrK[idARRK]-0.0001, arrK[idARRK+1]-0.0001, arrK[idARRK+2]-0.0001]);
	}
	
	this.color = vecColor;
	for(var n = 0, f = this.buffersObjects.length; n < f; n++) {
		this.buffersObjects[n].Kd = vecColor;
		this.buffersObjects[n].arrayTEX_Kd = new Uint8Array([parseInt(vecColor.e[0]*255), parseInt(vecColor.e[1]*255), parseInt(vecColor.e[2]*255), 255]); // Typed array map albedo
	}
	this.nodeCtxWebGL.setKdColor(vecColor);
};
/**
* @type Void
* @param {StormV3} dirVector Normalize vector direction
*/
StormLight.prototype.setDirection = function(direction) {
	if(this.objectType == 'light') {
		this.direction = direction.normalize();
		if(this.type == 'sun') {
			var vecEyeLight = this.direction.x(-100.0); 
			
			this.mrealWMatrix.e[3] = vecEyeLight.e[0];
			this.mrealWMatrix.e[7] = vecEyeLight.e[1];
			this.mrealWMatrix.e[11] = vecEyeLight.e[2];
			
			
			var vecEyeLight = stormEngineC.defaultCamera.getPosition().add(this.direction.x(-100.0));
			var vecPosLight = stormEngineC.defaultCamera.getPosition();
			this.MPOS = $M16().makeLookAt(	vecEyeLight.e[0], vecEyeLight.e[1], vecEyeLight.e[2],
												vecPosLight.e[0], vecPosLight.e[1], vecPosLight.e[2],
												0.0,1.0,0.0);
			this.nodeCtxWebGL.MPOS = $M16([1.0, 0.0, 0.0, vecEyeLight.e[0],
											  0.0, 1.0, 0.0, vecEyeLight.e[1],
											  0.0, 0.0, 1.0, vecEyeLight.e[2],
											  0.0, 0.0, 0.0, 1.0
											  ]);
			this.setFov(this.getFov());  
		}
	}
};


