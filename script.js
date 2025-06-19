// Global Variables
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// Featured Products Data
const featuredProducts = [
    {
        id: 1,
        name: "Samsung Galaxy M34",
        price: 18999,
        originalPrice: 24999,
        rating: 4.3,
        reviews: 1250,
        image: "images/products/featured/samsung-galaxy-m34.jpeg",
        discount: 24,
        category: "Electronics"
    },
    {
        id: 2,
        name: "Boat Airdopes 141",
        price: 1299,
        originalPrice: 2990,
        rating: 4.1,
        reviews: 8500,
        image: "images/products/featured/boat-airdopes.jpeg",
        discount: 57,
        category: "Electronics"
    },
    {
        id: 3,
        name: "Levi's Men's Jeans",
        price: 1899,
        originalPrice: 3999,
        rating: 4.2,
        reviews: 2100,
        image: "images/products/featured/levis-jeans.jpeg",
        discount: 53,
        category: "Fashion"
    },
    {
        id: 4,
        name: "Prestige Cooker 5L",
        price: 2499,
        originalPrice: 3500,
        rating: 4.5,
        reviews: 950,
        image: "images/products/featured/prestige-cooker.jpeg",
        discount: 29,
        category: "Home & Kitchen"
    },
    {
        id: 5,
        name: "Nike Air Max Shoes",
        price: 7995,
        originalPrice: 12995,
        rating: 4.4,
        reviews: 650,
        image: "images/products/featured/nike-shoes.jpeg",
        discount: 38,
        category: "Sports"
    },
    {
        id: 6,
        name: "Lakme Lipstick Set",
        price: 899,
        originalPrice: 1500,
        rating: 4.0,
        reviews: 3200,
        image: "lakme-lipstick.jpeg",
        discount: 40,
        category: "Beauty"
    }
];

// Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeHeroSlider();
    loadFeaturedProducts();
    updateCartCount();
    setupEventListeners();
});

// Hero Slider Functions
function initializeHeroSlider() {
    if (slides.length > 0) {
        showSlide(0);
        startSlideShow();
    }
}

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    currentSlide = index;
}

function changeSlide(direction) {
    let nextSlide = currentSlide + direction;

    if (nextSlide >= slides.length) {
        nextSlide = 0;
    } else if (nextSlide < 0) {
        nextSlide = slides.length - 1;
    }

    showSlide(nextSlide);
    resetSlideShow();
}

function currentSlideFunc(index) {
    showSlide(index - 1);
    resetSlideShow();
}

function startSlideShow() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function resetSlideShow() {
    clearInterval(slideInterval);
    startSlideShow();
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn i');

    mobileMenu.classList.toggle('active');

    if (mobileMenu.classList.contains('active')) {
        menuBtn.className = 'fas fa-times';
    } else {
        menuBtn.className = 'fas fa-bars';
    }
}

// Product Functions
function loadFeaturedProducts() {
    const productsContainer = document.getElementById('featuredProducts');
    if (!productsContainer) return;

    productsContainer.innerHTML = '';

    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <div class="discount-badge">${product.discount}% OFF</div>
            <div class="category-badge">${product.category}</div>
            <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                <i class="fas fa-heart ${isInWishlist(product.id) ? 'text-red-500' : ''}"></i>
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span class="rating-text">${product.rating} (${product.reviews.toLocaleString()})</span>
            </div>
            <div class="product-price">
                <span class="current-price">₹${product.price.toLocaleString()}</span>
                <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;

    return card;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }

    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    return starsHTML;
}

// Cart Functions
function addToCart(productId) {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartSummary();
    }
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateCartSavings() {
    return cart.reduce((savings, item) => savings + ((item.originalPrice - item.price) * item.quantity), 0);
}

// Wishlist Functions
function toggleWishlist(productId) {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = wishlist.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(product);
        showNotification('Added to wishlist');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Update heart icon
    const heartIcons = document.querySelectorAll(`[onclick="toggleWishlist(${productId})"] i`);
    heartIcons.forEach(icon => {
        if (existingIndex > -1) {
            icon.classList.remove('text-red-500');
        } else {
            icon.classList.add('text-red-500');
        }
    });
}

function isInWishlist(productId) {
    return wishlist.some(item => item.id === productId);
}

// Search Functions
function setupSearch() {
    const searchInputs = document.querySelectorAll('#searchInput, .mobile-search input');

    searchInputs.forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    });

    const searchButtons = document.querySelectorAll('.search-btn');
    searchButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling || document.getElementById('searchInput');
            performSearch(input.value);
        });
    });
}

function performSearch(query) {
    if (query.trim()) {
        // Redirect to search results page
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

// Notification Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Event Listeners
function setupEventListeners() {
    setupSearch();

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            const mobileMenu = document.getElementById('mobileMenu');
            const menuBtn = document.querySelector('.mobile-menu-btn i');

            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                menuBtn.className = 'fas fa-bars';
            }
        }
    });
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(price);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

// Export functions for use in other pages
window.BharatMart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    isInWishlist,
    showNotification,
    formatPrice,
    formatNumber,
    cart,
    wishlist,
    featuredProducts
};