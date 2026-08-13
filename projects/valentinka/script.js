// Variables
let noAttempts = 0;
const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');
const attemptText = document.getElementById('attemptText');
const mainCard = document.getElementById('mainCard');
const successScreen = document.getElementById('successScreen');
const container = document.getElementById('buttonContainer');

// Create floating background hearts
function createBackgroundHearts() {
    const bgHearts = document.getElementById('bgHearts');
    const heartSymbols = ['💕', '💖', '💗', '💓', '💝', '❤️', '😍'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            bgHearts.appendChild(heart);
            
            // Remove after animation
            setTimeout(() => heart.remove(), 8000);
        }, i * 300);
    }
}

// Move NO button to random position
function moveNoButton() {
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - btnNo.offsetWidth - 20;
    const maxY = containerRect.height - btnNo.offsetHeight - 20;
    
    // Set absolute position on first move
    btnNo.style.position = 'absolute';
    
    // Random position within container
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
    
    // Add shake effect to card
    mainCard.classList.add('shake');
    setTimeout(() => mainCard.classList.remove('shake'), 500);
    
    // Increment attempts
    noAttempts++;
    updateYesButton();
}

// Update YES button based on attempts
function updateYesButton() {
    // Show attempt text after first try
    if (noAttempts === 1) {
        attemptText.style.opacity = '1';
    }
    
    // Update text based on attempts
    if (noAttempts === 3) {
        attemptText.textContent = 'To tlačidlo "Nie" je nejaké divné... 🤔';
    } else if (noAttempts === 5) {
        attemptText.textContent = 'Už to vzdaj, klikni na Áno! 😊';
    } else if (noAttempts === 8) {
        attemptText.textContent = 'Si strašne zlatý/á keď to skúšaš ďalej! 🥰';
    }
    
    // Grow YES button
    let scale = 1 + (noAttempts * 0.15);
    let paddingX = 8 + (noAttempts * 0.5);
    let paddingY = 4 + (noAttempts * 0.3);
    let fontSize = 1.25 + (noAttempts * 0.1);
    
    // Cap the size
    if (scale > 2.5) scale = 2.5;
    if (fontSize > 3) fontSize = 3;
    
    btnYes.style.transform = `scale(${scale})`;
    btnYes.style.padding = `${paddingY}rem ${paddingX}rem`;
    btnYes.style.fontSize = `${fontSize}rem`;
    
    // Change color intensity based on attempts
    if (noAttempts > 5) {
        btnYes.classList.remove('from-pink-500', 'to-rose-500');
        btnYes.classList.add('from-red-500', 'to-pink-600');
        btnYes.innerHTML = `
            <span class="flex items-center gap-2">
                <i data-lucide="heart" class="w-${6 + noAttempts} h-${6 + noAttempts} fill-white"></i>
                ÁNO! Klikni sem!
            </span>
        `;
        lucide.createIcons();
    }
}

// Handle YES click
btnYes.addEventListener('click', () => {
    // Hide main card
    mainCard.style.display = 'none';
    
    // Show success screen
    successScreen.classList.remove('hidden');
    
    // Create heart explosion
    createHeartExplosion();
    
    // Play celebration sound (optional - browser policy might block)
    try {
        const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio blocked by browser'));
    } catch(e) {
        console.log('Audio not supported');
    }
});

// Create heart explosion animation
function createHeartExplosion() {
    const symbols = ['❤️', '💖', '💕', '💗', '💓', '💝', '😍', '🥰', '😘'];
    const colors = ['#ff6b6b', '#ff8e8e', '#ffb6c1', '#ffc0cb', '#ff69b4', '#ff1493'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.style.position = 'fixed';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '100';
            heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const velocity = Math.random() * 300 + 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            heart.style.transform = 'translate(-50%, -50%)';
            heart.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            document.body.appendChild(heart);
            
            // Animate
            requestAnimationFrame(() => {
                heart.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${Math.random() * 720}deg) scale(0)`;
                heart.style.opacity = '0';
            });
            
            // Cleanup
            setTimeout(() => heart.remove(), 1500);
        }, i * 30);
    }
}

// NO button event listeners - Desktop: mouse hover
btnNo.addEventListener('mouseenter', moveNoButton);

// Mobile: touch detection - move when touching the button
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default click behavior
    e.stopPropagation();
    moveNoButton();
}, { passive: false });

// Click handler for both desktop and mobile (catches any missed events)
btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    moveNoButton();
});

// Mobile enhancement: move button when finger approaches it (within 100px)
let lastTouchMove = 0;
container.addEventListener('touchmove', (e) => {
    const now = Date.now();
    if (now - lastTouchMove < 50) return; // Throttle to 50ms
    lastTouchMove = now;
    
    const touch = e.touches[0];
    const rect = btnNo.getBoundingClientRect();
    
    // Calculate distance from touch point to button center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt(
        Math.pow(touch.clientX - centerX, 2) + 
        Math.pow(touch.clientY - centerY, 2)
    );
    
    // If finger gets within 100px of the button, it runs away!
    if (distance < 100) {
        moveNoButton();
    }
}, { passive: true });

// Prevent scrolling issues on mobile when playing with the button
container.addEventListener('touchstart', (e) => {
    if (e.target === btnNo || btnNo.contains(e.target)) {
        e.preventDefault();
    }
}, { passive: false });

// Reset function
function resetPage() {
    location.reload();
}

// Initial setup
createBackgroundHearts();

// Periodic background hearts
setInterval(createBackgroundHearts, 8000);
