// Products data - исправлены иконки
const products = [
    {
        id: 1,
        name: "Ayakama Classic",
        description: "Базовая туалетная бумага из 100% переработанной целлюлозы. 2-слойная, 180 метров.",
        price: 129,
        rating: 4,
        icon: "fas fa-toilet-paper"
    },
    {
        id: 2,
        name: "Ayakama Soft",
        description: "Ультрамягкая 3-слойная бумага с экстрактом алоэ вера. 200 метров.",
        price: 199,
        rating: 5,
        icon: "fas fa-toilet-paper"
    },
    {
        id: 3,
        name: "Ayakama Eco",
        description: "Экологичная бумага из бамбуковых волокон. Быстро разлагается в природе. 150 метров.",
        price: 249,
        rating: 5,
        icon: "fas fa-leaf"
    },
    {
        id: 4,
        name: "Ayakama Family Pack",
        description: "Большая упаковка для семьи. 8 рулонов по 200 метров каждый. Экономичный вариант.",
        price: 899,
        rating: 4,
        icon: "fas fa-users"
    },
    {
        id: 5,
        name: "Ayakama Ароматизированная",
        description: "Бумага с нежным ароматом лаванды. 2-слойная, 180 метров.",
        price: 179,
        rating: 4,
        icon: "fas fa-spa"
    },
    {
        id: 6,
        name: "Ayakama Professional",
        description: "Прочная 4-слойная бумага для офисов и ресторанов. 300 метров.",
        price: 349,
        rating: 5,
        icon: "fas fa-building"
    }
];

// Cart data
let cart = [];

// DOM Elements
const cartModal = document.getElementById('cartModal');
const cartIcon = document.getElementById('cartIcon');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const productGrid = document.getElementById('productGrid');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('ayakamaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
    
    // Event Listeners
    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartModal);
    checkoutBtn.addEventListener('click', checkout);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close cart when clicking outside
    document.addEventListener('click', function(event) {
        if (!cartModal.contains(event.target) && !cartIcon.contains(event.target) && cartModal.classList.contains('open')) {
            closeCartModal();
        }
    });
});

// Render products
function renderProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Generate star rating
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= product.rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        productCard.innerHTML = `
            <div class="product-img">
                <i class="${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">${stars}</div>
                <div class="product-price">${product.price} руб.</div>
                <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to "Add to cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            icon: product.icon
        });
    }
    
    // Update UI and save to localStorage
    updateCartUI();
    saveCartToLocalStorage();
    
    // Show notification
    showNotification(`${product.name} добавлен в корзину`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToLocalStorage();
    
    // Show notification
    showNotification('Товар удален из корзины');
}

// Update quantity of item in cart
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
        saveCartToLocalStorage();
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Ваша корзина пуста</p>
            </div>
        `;
        cartTotal.textContent = '0 руб.';
        return;
    }
    
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} руб. × ${item.quantity} = ${itemTotal} руб.</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update total price
    cartTotal.textContent = `${totalPrice} руб.`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('ayakamaCart', JSON.stringify(cart));
}

// Open cart modal
function openCart() {
    cartModal.classList.add('open');
}

// Close cart modal
function closeCartModal() {
    cartModal.classList.remove('open');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста. Добавьте товары перед оформлением заказа.');
        return;
    }
    
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // In a real app, this would redirect to a payment page
    showNotification(`Заказ оформлен! Сумма: ${totalPrice} руб. Спасибо за покупку!`);
    
    // Clear cart
    cart = [];
    updateCartUI();
    saveCartToLocalStorage();
    closeCartModal();
}

// Show notification
function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileNav.classList.toggle('active');
}

// Close mobile menu
function closeMobileMenu() {
    mobileNav.classList.remove('active');
}