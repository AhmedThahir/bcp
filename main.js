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
var rotatingElementMouseDown = false;
rotatingElement.dataset.prevPercentage = 0;

rotatingElement.onmousedown = e => {
    // Set current mouse postion
    rotatingElement.dataset.mouseDownAt = e.clientX;
    rotatingElementMouseDown = true;
}

window.onmouseup = e => {
    // Reset mouse position
    // Set current percentage along scale
    if (rotatingElementMouseDown) {
        rotatingElement.dataset.mouseDownAt = 0;
        rotatingElement.dataset.prevPercentage = rotatingElement.dataset.nextPercentage;
        rotatingElementMouseDown = false;
    }
}

window.onmousemove = e => {
    if (rotatingElementMouseDown) animateRotatingElement(e, rotatingElement);
}

function animateRotatingElement(e, rotatingElement) {
    // If no change, return
    if (rotatingElement.dataset.mouseDownAt === 0) return;

    // Set slider size
    const maxDelta = window.innerWidth / 5;

    // As mouse moves, get change in position relative to starting position
    const mouseDelta = parseFloat(rotatingElement.dataset.mouseDownAt) - e.clientX;

    // Calculate percentage over total
    const percentage = mouseDelta * 100 / maxDelta;
    const nextPercentage = parseFloat(rotatingElement.dataset.prevPercentage) + percentage;

    // Save percentage for next mouse scroll after release
    // to prevent reset of element on new mouse click
    rotatingElement.dataset.nextPercentage = nextPercentage;

    // Animate translation of element
    rotatingElement.animate({
        transform: `rotate(${nextPercentage}deg)`
    }, {
        duration: 500,
        fill: "forwards"
    })
}
