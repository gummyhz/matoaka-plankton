// javascript file
function filterImages(className) {
  const allImages = document.querySelectorAll('.all-imgs');
  allImages.forEach(img => img.style.display = 'none');

  const selectedImages = document.querySelectorAll('.' + className);
  selectedImages.forEach(img => img.style.display = 'block');
}

function openLightbox(src) {
    const overlay = document.getElementById('dynamic-lightbox');
    const fullImg = document.getElementById('lightbox-img');
    
    fullImg.src = src; 
    overlay.style.display = 'flex'; 
}

function closeLightbox() {
    document.getElementById('dynamic-lightbox').style.display = 'none';
}