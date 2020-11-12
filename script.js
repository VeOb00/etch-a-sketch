let pixelCount = 23;
let shadesCount = 20;

const setSize = document.getElementById("setSizeBtn");
const reset = document.getElementById("resetBtn");
const erase = document.getElementById("eraseBtn");
const share = document.getElementById("shareBtn");

const colors = [
	"rgb(153, 170, 255)",
	"rgb(255, 153, 229)",
	"rgb(226, 153, 255)",
	"rgb(153, 204, 255)",
	"rgb(255, 187, 153)",
	"rgb(191, 153, 255)",
	"rgb(153, 225, 255)",
	"rgb(255, 242, 153)",
	"rgb(157, 153, 255)",
	"rgb(255, 153, 208)",
	"rgb(153, 238, 255)",
	"rgb(153, 255, 196)",
	"rgb(255, 221, 153)",
	"rgb(153, 255, 183)",
	"rgb(255, 166, 153)",
	"rgb(255, 153, 153)",
	"rgb(153, 255, 217)",
	"rgb(199, 255, 153)",
	"rgb(153, 255, 162)",
	"rgb(153, 255, 251)",
	"rgb(255, 153, 174)",
	"rgb(178, 255, 153)",
	"rgb(213, 153, 255)",
	"rgb(234, 255, 153)",
	"rgb(247, 153, 255)",
];
let colorsMap = new Map();
colorsMap
	.set("a", colors[0])
	.set("b", colors[1])
	.set("c", colors[2])
	.set("d", colors[3])
	.set("e", colors[4])
	.set("f", colors[5])
	.set("g", colors[6])
	.set("h", colors[7])
	.set("i", colors[8])
	.set("j", colors[9])
	.set("k", colors[10])
	.set("l", colors[11])
	.set("m", colors[12])
	.set("n", colors[13])
	.set("o", colors[14])
	.set("p", colors[15])
	.set("q", colors[16])
	.set("r", colors[17])
	.set("s", colors[18])
	.set("t", colors[19])
	.set("u", colors[20])
	.set("v", colors[21])
	.set("w", colors[22])
	.set("x", colors[23])
	.set("y", colors[24])
	.set("z", "rgb(0, 0, 0)");
// .set("Z", "rgb(255, 255, 255)");

let shadesMap = new Map();
shadesMap
	.set(0, "")
	.set(1, "A")
	.set(2, "B")
	.set(3, "C")
	.set(4, "D")
	.set(5, "E")
	.set(6, "F");

renderPixels();
addPixelMousoverListener();

let eraserActive = false;
erase.addEventListener("click", () => {
	eraserActive = !eraserActive;
	if (erase.classList.contains("btn-round-active")) {
		erase.classList.remove("btn-round-active");
	} else {
		erase.classList.add("btn-round-active");
	}
});

reset.addEventListener("click", () => {
	document.querySelector(".canvas").remove();
	renderPixels();
	addPixelMousoverListener();
});

setSize.addEventListener("click", () => {
	let tempPixelCount = "";
	do {
		tempPixelCount = +prompt(
			"Number of pixes per canvas width (min. 3 / max. 99).\n" +
				"\nShare function for a fully colored and shaded image currently supported for max 23 pixels."
		);
	} while (
		tempPixelCount != "" &&
		(tempPixelCount <= 2 || tempPixelCount > 99 || isNaN(tempPixelCount))
	);
	if (tempPixelCount == "") {
		return;
	} else {
		pixelCount = tempPixelCount;
	}
	document.querySelector(".canvas").remove();
	renderPixels();
	addPixelMousoverListener();
});

share.addEventListener("click", getShareLink);

let urlParams = new URLSearchParams(window.location.search);
let colorsString = urlParams.get("p");

if (colorsString) {
	openSharedPicture(colorsString);
}

// // TODO: this deletes the image progress on maybe unintentional resize - needs function similar to share to store progress
// // share is also not working
// function outputsize() {
// 	let c = canvas.offsetWidth;
// 	document.querySelector(".canvas").remove();
// 	renderPixels(c);
// 	addPixelMousoverListener();
// }
// new ResizeObserver(outputsize).observe(canvas);

function renderPixels(c) {
	const canvas = document.getElementById("canvas");
	const doubleBorderWidth = 10;

	const canvasWidth = canvas.offsetWidth;
	// let canvasWidth = c; //works with outputsize()

	let divSize = (canvasWidth - doubleBorderWidth) / pixelCount;
	divSize = +parseFloat(divSize).toPrecision(6);

	let canvasContainer = document.createElement("div");
	canvasContainer.classList.add("canvas");

	let pixelHeightCount = Math.floor(
		((canvasWidth - doubleBorderWidth) * 0.75) / divSize
	);
	canvasContainer.style.cssText = `width: ${canvasWidth}px; height: ${
		pixelHeightCount * divSize + doubleBorderWidth
	}px`;

	for (let i = 0; i < pixelCount * pixelHeightCount; i++) {
		let pixel = document.createElement("div");
		pixel.classList.add("pixel");

		pixel.style.cssText = `width: ${divSize}px; height: ${divSize}px;`;
		canvasContainer.appendChild(pixel);
	}

	canvas.appendChild(canvasContainer);
}

function getValuesFromString(colorsString) {
	pixelCount = colorsString.substring(0, 2);

	if (pixelCount.substring(0, 1) == 0) {
		pixelCount = +pixelCount.substring(1, 2);
	} else {
		pixelCount = +pixelCount;
	}

	let colorCodeString = colorsString.substring(2);
	let colorCodeArray = colorCodeString.split(/(?=[a-z, Z, Y])/);

	let colorValuesArray = [];
	for (const element of colorCodeArray) {
		let colorCode = element.substring(0, 1);
		let shadeCode = element.substring(1, 2);
		let divNr;
		if (isNaN(shadeCode)) {
			divNr = +element.substring(2);
		} else {
			divNr = +element.substring(1);
			shadeCode = 0;
		}

		colorValuesArray.push([
			getColorValue(colorCode),
			getShadeValue(shadeCode),
			divNr,
		]);
	}
	return colorValuesArray;
}

function addPixelMousoverListener() {
	document.querySelectorAll(".pixel").forEach((element) => {
		element.addEventListener("mouseover", colorPixel);
	});
}

function getShareLink() {
	let colorsString = "";
	colorsString = getColorsString(colorsString);

	shareUrl = `${window.location.href}?p=${colorsString}`;
	copyToClipboard(shareUrl);
	alert("Link copied to clipboard!");

	colorsString = "";
}

function copyToClipboard(text) {
	var dummy = document.createElement("input");
	document.body.appendChild(dummy);
	dummy.value = text;
	dummy.select();
	document.execCommand("copy");
	document.body.removeChild(dummy);
}

function openSharedPicture(colorsString) {
	let colorValuesArray = getValuesFromString(colorsString);

	document.querySelector(".canvas").remove();
	renderPixels();

	let divs = document.querySelector(".canvas").childNodes;
	for (let i = 0; i < divs.length; i++) {
		for (let j = 0; j < colorValuesArray.length; j++) {
			if (i == colorValuesArray[j][2]) {
				let divColor = colorValuesArray[j][0];
				for (k = 0; k < colorValuesArray[j][1]; k++) {
					divColor = prepareStrAndApplyDarkLight(
						divColor,
						-shadesCount
					);
				}
				divs[i].style.backgroundColor = divColor;
			}
		}
	}
	addPixelMousoverListener();
}

function getColorsString() {
	if (pixelCount < 10) {
		pixelCount = `0${pixelCount}`;
	}
	colorsString = `${pixelCount}`;
	document.querySelectorAll(".pixel").forEach((element, index) => {
		if (element.style.backgroundColor == "") {
			colorsString += "";
		} else {
			colorsString += `${getColorAndShadeCode(
				element.style.backgroundColor,
				colors
			)}${index}`;
		}
	});
	return colorsString;
}

function getColorAndShadeCode(expression) {
	let colorCode = getColorCode(expression);
	let shadeNr = 0;

	while (colorCode == ".") {
		expression = prepareStrAndApplyDarkLight(expression, shadesCount);
		shadeNr++;
		colorCode = getColorCode(expression);
	}

	let shadeCode = getShadeCode(shadeNr);

	return colorCode + shadeCode;
}

function getShadeCode(shadeNr) {
	let shadeCode = "";
	for (let [key, value] of shadesMap.entries()) {
		if (key == shadeNr) {
			return (shadeCode = value);
		} else {
			shadeCode = "--"; //error catch
		}
	}
	return shadeCode;
}
function getShadeValue(shadeCode) {
	let shadeNr = "";
	for (let [key, value] of shadesMap.entries()) {
		if (value == shadeCode) {
			return (shadeNr = key);
		} else {
			shadeNr = "--"; //error catch
		}
	}
	return shadeNr;
}

function getColorCode(colorValue) {
	let colorCode = "";
	for (let [key, value] of colorsMap.entries()) {
		if (value == colorValue) {
			return (colorCode = key);
		} else {
			colorCode = ".";
		}
	}
	return colorCode;
}
function getColorValue(colorCode) {
	let colorValue = "";
	for (let [key, value] of colorsMap.entries()) {
		if (key == colorCode) {
			return (colorValue = value);
		} else {
			colorValue = ".";
		}
	}
	return colorValue;
}

function colorPixel() {
	if (eraserActive == true) {
		this.style.removeProperty("background-color");
	} else if (this.style.backgroundColor == "") {
		this.style.backgroundColor = `${colors.sample()}`;
	} else {
		this.style.backgroundColor = prepareStrAndApplyDarkLight(
			this.style.backgroundColor,
			-shadesCount
		);
	}
}

function prepareStrAndApplyDarkLight(rgbColorString, lightnessNr) {
	let currentColor = rgbColorString;
	currentColor = currentColor.substring(4, currentColor.length - 1);
	let colorArr = [];
	colorArr = currentColor.split(", ");
	colorArr[0] = +colorArr[0];
	colorArr[1] = +colorArr[1];
	colorArr[2] = +colorArr[2];
	let shadedColor = lightenDarkenColor(colorArr, lightnessNr);
	let anyZero = shadedColor.some((e) => e <= shadesCount);
	if (anyZero) {
		return `rgb(0, 0, 0)`;
	}
	return `rgb(${shadedColor.join(", ")})`;
}

//copy pasted piece of magic code
function lightenDarkenColor(c, n, i, d) {
	for (i = 3; i--; c[i] = d < 0 ? 0 : d > 255 ? 255 : d | 0) d = c[i] + n;
	return c;
}

//copy paste get limited number of colors / used to generate colors 1st time
function selectRandomColors(number) {
	const hue = number * 137.508; // use golden angle approximation
	return `hsl(${hue},100%,80%)`;
}

Array.prototype.sample = function () {
	return this[Math.floor(Math.random() * this.length)];
};

//Avaliable chars in url 2,048
