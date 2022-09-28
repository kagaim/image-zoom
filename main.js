const img = document.querySelector('img')

img.addEventListener('click', (e) => {
    const url = e.target.src
    const wrapper = e.target.closest('.image-wrapper')
    wrapper.style.backgroundImage = `url('${url}')`;
    wrapper.classList.toggle('image-wrapper__zoomed')
})