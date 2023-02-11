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
let rotatingElementMouseDown = false;
rotatingElement.dataset.prevDegrees = 0;

function getCoordinates(e) {
	let x, y, coordinates;

	if (e.targetTouches && e.targetTouches[0]) {
		e.preventDefault();
		pointerEvent = e.targetTouches[0];
		x = pointerEvent.pageX;
		y = pointerEvent.pageY;
	} else {
		x = e.clientX;
		y = e.clientY;
	}

	coordinates = [x, y];

	return coordinates;
}

function startRotation(e) {
	const coordinates = getCoordinates(e);
	const x = coordinates[0], y = coordinates[1];

	// Set current mouse postion
	rotatingElement.dataset.mouseStartRadian = Math.atan2(
		x - centerX,
		y - centerY
	);

	rotatingElementMouseDown = true;
}

function endRotation(e) {
	// Reset mouse position
	// Set current percentage along scale
	if (rotatingElementMouseDown) {
		rotatingElement.dataset.prevDegrees = rotatingElement.dataset.nextDegrees;
		rotatingElementMouseDown = false;
	}
}

function performRotation(e) {
	if (!rotatingElementMouseDown)
		return
	// If no change, return
	if (rotatingElement.dataset.mouseDownAtX === 0 || rotatingElement.dataset.mouseDownAtY === 0) return;

	// As mouse moves, get change in position relative to starting position
	const coordinates = getCoordinates(e);
	const x = coordinates[0], y = coordinates[1];

	const mouseCurrentRadian = Math.atan2(
		x - centerX,
		y - centerY
	);

	const mouseDeltaRadian = rotatingElement.dataset.mouseStartRadian - mouseCurrentRadian;
	const mouseDeltaDegrees = (mouseDeltaRadian * (180 / Math.PI));
	rotatingElement.dataset.nextDegrees = parseFloat(rotatingElement.dataset.prevDegrees) + mouseDeltaDegrees;

	rotatingElement.style.transform = `rotate(${parseInt(rotatingElement.dataset.nextDegrees)}deg)`;
}

rotatingElement.addEventListener("mouseover", startRotation);
rotatingElement.addEventListener("touchstart", startRotation);

rotatingElement.addEventListener("mouseleave", endRotation);
rotatingElement.addEventListener("touchend", endRotation);

rotatingElement.addEventListener("mousemove", performRotation);
rotatingElement.addEventListener("touchmove", performRotation);
