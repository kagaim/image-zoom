// Global Variables
const wrapper = document.querySelector('.image-wrapper') // Image Wrapper
const img = wrapper.querySelector('img') // Image
let isZoomed = false
let values = [] // Mobile x,y and distance values generated on touch

/*
*
*  Desktop Zoom
*
*/
desktopZoom()

/*
*
*  Mobile Pinch Zoom
*
*/
mobileZoom()


/*
*
*  Desktop Functions
*
*/

// Init Desktop Zoom
function desktopZoom() {
  if (window.innerWidth > 768) {

    // Desktop Click Event
    img.addEventListener('click', (e) => {
      const url = e.target.src
      wrapper.style.backgroundImage = `url('${url}')`
      wrapper.classList.toggle('image-wrapper__zoomed')
      if (wrapper.classList.contains('image-wrapper__zoomed')) {
          isZoomed = true
          backgroundImagePosition(e)
      } else {
          isZoomed = false
      }
    })

    // Mobile Mouse Move Event
    img.addEventListener('mousemove', (e) => {
      if (isZoomed) {
          backgroundImagePosition(e)
      }
    })

  }
}

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



/*
*
*  Mobile Pinch Functions
*
*/

// Init Mobile Zoom
function mobileZoom() {
  if (window.innerWidth <= 768) {
    img.addEventListener('touchstart', e => {
      e.preventDefault()
      if (e.targetTouches.length === 2) {
        const url = e.target.src
        wrapper.style.backgroundImage = `url('${url}')`
        wrapper.classList.add('image-wrapper__zoomed')
        if (wrapper.classList.contains('image-wrapper__zoomed')) {
          isZoomed = true
          values.push(getMobilePositionValues(e))
        }
      }
    })
  
    img.addEventListener('touchmove', e => {
      e.preventDefault()
      if (e.targetTouches.length === 2) {
        values.push(getMobilePositionValues(e))
      }
      
      setMobileImgZoom(wrapper, img, e, isZoomed)
      if(isZoomed) {
        moveMobileZoomedImg(img, wrapper, e)
      }
    })
  }
}

// Set Mobile Image Zoom - Two Fingers
function setMobileImgZoom(wrapper, img, e) {
  if (e.targetTouches.length === 2) {
    const x = values[values.length - 1].x
    const y = values[values.length - 1].y
    const bgX = percentage(x, img.width)
    const bgY = percentage(y, img.height)
    
    let scale = values[values.length - 1].distance / values[0].distance

    let percentageScale
    if (scale <= 1) {
      percentageScale = 100
      isZoomed = false
    } else {
      percentageScale = scale * 100
    }

    // Transform the background image to make it grow and move with fingers
    wrapper.style.backgroundPosition = `${bgX}% ${bgY}%`
    wrapper.style.backgroundSize = `${percentageScale}%`
  }
}

// Move mobile zoomed image with one finger
function moveMobileZoomedImg(img, wrapper, e) {
  if (e.targetTouches.length === 1) {
    const x = e.targetTouches[0].pageX
    const y = e.targetTouches[0].pageY
    const bgX = percentage(x, img.width)
    const bgY = percentage(y, img.height)
    wrapper.style.backgroundPosition = `${bgX}% ${bgY}%`
  }
}

// Get actual touch distance
function getMobilePositionValues(e) {
  if(e.targetTouches.length === 2) {
    const xA = e.targetTouches[0].pageX
    const xB = e.targetTouches[1].pageX
    const yA = e.targetTouches[0].pageY
    const yB = e.targetTouches[1].pageY
    
    const distance = getDistance(xA, yA, xB, yB)
    const x = (xA + xB) / 2;
    const y = (yA + yB) / 2;

    return {x:x, y:y, distance:distance}
  }
}

// Calculate distance between two fingers
function getDistance(xA, yA, xB, yB) { 
	const xDiff = xA - xB; 
	const yDiff = yA - yB;

	return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
}



/*
*
*  Global Functions
*
*/

// Percentage Calculator
function percentage(initValue, finalValue) {
    return (100 * initValue) / finalValue;
}