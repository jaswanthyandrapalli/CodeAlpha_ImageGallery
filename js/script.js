// DOM Elements
const galleryItems = document.querySelectorAll('.gallery-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const prevBtn = document.querySelector('.nav-btn.prev');
const nextBtn = document.querySelector('.nav-btn.next');
const closeBtn = document.querySelector('.close');

let currentImageIndex = 0;
let visibleImages = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
});

// Initialize gallery
function initializeGallery() {
    updateVisibleImages();
    attachGalleryEventListeners();
    attachFilterEventListeners();
    attachLightboxEventListeners();
}

// Attach click events to gallery items
function attachGalleryEventListeners() {
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('hidden')) {
                openLightbox(item);
            }
        });
    });
}

// Attach filter button events
function attachFilterEventListeners() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter gallery
            const filterValue = btn.getAttribute('data-filter');
            filterGallery(filterValue);
        });
    });
}

// Attach lightbox events
function attachLightboxEventListeners() {
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') showPreviousImage();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'Escape') closeLightbox();
        }
    });
}

// Filter gallery by category
function filterGallery(category) {
    galleryItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });

    updateVisibleImages();
}

// Update visible images array
function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
}

// Open lightbox
function openLightbox(clickedItem) {
    lightbox.classList.add('active');
    
    // Find index of clicked item in visible images
    currentImageIndex = visibleImages.indexOf(clickedItem);
    
    updateLightboxImage();
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
}

// Update lightbox image
function updateLightboxImage() {
    if (visibleImages.length === 0) return;

    const currentItem = visibleImages[currentImageIndex];
    const img = currentItem.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = currentItem.querySelector('p').textContent;
}

// Show next image
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    updateLightboxImage();
}

// Show previous image
function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    updateLightboxImage();
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Optional: Add touch support for mobile lightbox navigation
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
        // Swiped left
        showNextImage();
    } else if (touchEndX - touchStartX > 50) {
        // Swiped right
        showPreviousImage();
    }
}
