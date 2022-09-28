const wrapper = document.querySelector('.image-wrapper')
const img = wrapper.querySelector('img')

/*
*
*  Desktop Zoom
*
*/
let isZoomed = false
img.addEventListener('click', (e) => {
    if (window.innerWidth > 768) {
        const url = e.target.src
        wrapper.style.backgroundImage = `url('${url}')`
        wrapper.classList.toggle('image-wrapper__zoomed')
        if (wrapper.classList.contains('image-wrapper__zoomed')) {
            isZoomed = true
            backgroundImagePosition(e)
        } else {
            isZoomed = false
        }
    }
})

img.addEventListener('mousemove', (e) => {
    if (isZoomed && window.innerWidth > 768) {
        backgroundImagePosition(e)
    }
})

// Set Background Image Position
function backgroundImagePosition(e) {
    let pos, x, y, bgX, bgY
    pos = getCursorPos(e);
    x = pos.x
    y = pos.y

    // Prevent X, Y from using cordinates outside of the image
    if (x > img.width) { x = img.width }
    if (x < 0) {x = 0}
    if (y > img.height) { y = img.height }
    if (y < 0) {y = 0}

    bgX = percentage(x, img.width)
    bgY = percentage(y, img.height)

    wrapper.style.backgroundPosition = `${bgX}% ${bgY}%`
}

// Get Cursor Position relative to the image
function getCursorPos(e) {
    let a, x = 0, y = 0;
    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = img.getBoundingClientRect();
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;

    return {x : x, y : y};
}

// Percentage Calculator
function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue;
}

/*
*
*  Mobile Zoom
*
*/


const para = document.querySelector("#distance")
const scale = document.querySelector("#scale")

img.addEventListener('touchstart', (event) => {
    para.textContent = getIniTouches(event)
})

// Calculate distance between two fingers
const distance = (event) => {
    return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
};

// Get initial mobile touches
function getIniTouches(event) {
    event.preventDefault(); 
    let x, y, d 

    // Calculate where the fingers have started on the X and Y axis
    x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
    y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
    d = distance(event);

    return {x : x, y : y, d : d};
}
