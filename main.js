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

if (window.innerWidth <= 768) {
    pinchZoom (img)
}

function pinchZoom (imageElement) {
    let imageElementScale = 1;
  
    let start = {};
  
    // Calculate distance between two fingers
    const distance = (event) => {
      return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
    };
  
    imageElement.addEventListener('touchstart', (event) => {
      if (event.touches.length === 2) {
        event.preventDefault(); // Prevent page scroll
  
        // Calculate where the fingers have started on the X and Y axis
        start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
        start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
        start.distance = distance(event);
      }
    });
  
    imageElement.addEventListener('touchmove', (event) => {
      if (event.touches.length === 2) {
        event.preventDefault(); // Prevent page scroll
        let scale;
  
        // Safari provides event.scale as two fingers move on the screen
        // For other browsers just calculate the scale manually
        if (event.scale) {
          scale = event.scale;
        } else {
          const deltaDistance = distance(event);
          const startDistance = start.distance
          scale = deltaDistance / startDistance;
        }
  
        imageElementScale = Math.min(Math.max(1, scale), 4);
  
        // Calculate how much the fingers have moved on the X and Y axis
        const deltaX = (((event.touches[0].pageX + event.touches[1].pageX) / 2) - start.x) * 2; // x2 for accelarated movement
        const deltaY = (((event.touches[0].pageY + event.touches[1].pageY) / 2) - start.y) * 2; // x2 for accelarated movement
  
        // Transform the image to make it grow and move with fingers
        const transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${imageElementScale})`;
        imageElement.style.transform = transform;
        imageElement.style.WebkitTransform = transform;
        imageElement.style.zIndex = "9999";
      }
    });
    
    // Uncomment below code to reset image to it's original format
    // imageElement.addEventListener('touchend', (event) => {
    //   imageElement.style.transform = "";
    //   imageElement.style.WebkitTransform = "";
    //   imageElement.style.zIndex = "";
    // });
  }