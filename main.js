const customization_input = document.querySelector("#customization_input");
const customization_output = document.querySelector("#customization_output");
const default_text = "The Rizzler";

init();

function init() {
	let text = sessionStorage.getItem("text");
	if (text == null || text.length == 0)
		text = default_text;
	else
		customization_input.value = text;

	customization_output.textContent = text;
}

function update_text() {
	const text = customization_input.value;

	if (text.length == 0)
		text = default_text

	sessionStorage.setItem("text", text);
	customization_output.textContent = text;
}

function buy() {
	let text = customization_input.value;
	sessionStorage.setItem("text", text);

	if (text.length == 0)
		text = default_text;

	new_page_link = `https://docs.google.com/forms/d/e/1FAIpQLSdlKV-BTigb_wjBhug6vJKieOikpwyijXOf6YS2CmHdvRtz7g/viewform?usp=pp_url&entry.691033026=${text}`
	window.location.replace(new_page_link);
}


// -- ROTATING ELEMENT STUFF --
const rotatingElement = document.getElementById("preview");
const rotatingElementBox = rotatingElement.getBoundingClientRect();
const centers = window.getComputedStyle(rotatingElement).transformOrigin.split(" ");
const centerX = rotatingElementBox.left + parseInt(centers[0]) - window.scrollX;
const centerY = rotatingElementBox.top + parseInt(centers[1]) - window.scrollY;
var rotatingElementMouseDown = false;
// rotatingElement.dataset.rotationNumber = 0;
rotatingElement.dataset.prevDegrees = 0;

function startMovement(e, rotatingElement) {
	// Set current mouse postion
	rotatingElement.dataset.mouseStartRadian = Math.atan2(
		e.clientX - centerX,
		e.clientY - centerY
	);
	// rotatingElement.dataset.mousePrevRadian =  parseFloat(rotatingElement.dataset.mouseStartRadian);
	rotatingElementMouseDown = true;
}

rotatingElement.onmouseenter = e => {
	startMovement(e, rotatingElement)
};
rotatingElement.ontouchstart = e => {
	startMovement(e, rotatingElement);
}

function endMovement(e, rotatingElement) {
	// Reset mouse position
	// Set current percentage along scale
	if (rotatingElementMouseDown) {
		rotatingElement.dataset.prevDegrees = rotatingElement.dataset.nextDegrees;
		rotatingElementMouseDown = false;
	}
}

window.onmouseleave = e => {
	endMovement(e, rotatingElement)
}
window.ontouchend = e => {
	endMovement(e, rotatingElement)
}

window.onmousemove = e => {
	animateRotatingElement(e, rotatingElement);
}

window.ontouchmove = e => {
	animateRotatingElement(e, rotatingElement);
}

function animateRotatingElement(e, rotatingElement) {
	if (!rotatingElementMouseDown)
		return
	// If no change, return
	if (rotatingElement.dataset.mouseDownAtX === 0 || rotatingElement.dataset.mouseDownAtY === 0) return;

	// Set slider size
	// const maxDelta = window.innerWidth / 5;


	// As mouse moves, get change in position relative to starting position
	// const mouseDelta = e.clientX - parseFloat(rotatingElement.dataset.mouseDownAt);
	const mouseCurrentRadian = Math.atan2(
		e.clientX - centerX,
		e.clientY - centerY
	);

	// if(
	//     Math.abs(parseFloat(rotatingElement.dataset.mousePrevRadian)) > 3.1 &&
	//     Math.abs(mouseCurrentRadian) > 3.1 &&
	//     Math.abs(parseFloat(rotatingElement.dataset.mousePrevRadian) - mouseCurrentRadian) < 0.2
	// ) rotatingElement.dataset.rotationNumber++;

	// const mouseDeltaRadian = (
	//     parseInt(rotatingElement.dataset.rotationNumber) * Math.PI + 
	//     (rotatingElement.dataset.mouseStartRadian - mouseCurrentRadian)
	// );
	const mouseDeltaRadian = rotatingElement.dataset.mouseStartRadian - mouseCurrentRadian;
	const mouseDeltaDegrees = (mouseDeltaRadian * (180 / Math.PI));
	rotatingElement.dataset.nextDegrees = parseFloat(rotatingElement.dataset.prevDegrees) + mouseDeltaDegrees;

	rotatingElement.style.transform = `rotate(${parseInt(rotatingElement.dataset.nextDegrees)}deg)`;
	// Animate translation of element
	// rotatingElement.animate({
	//     transform: `rotate(${parseFloat(rotatingElement.dataset.nextDegrees)}deg)`
	// }, {
	//     duration: 500,
	//     fill: "forwards"
	// })
}
