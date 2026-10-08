/* ==========================================
   AURA RESORT — MASTER APPLICATION SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {

  // --- BACKGROUND VIDEO AUTOPLAY ENFORCEMENT ---
  const bgVideos = document.querySelectorAll('.hero-bg-video, .page-hero-video');
  bgVideos.forEach(function(v) {
    v.muted = true;
    v.play().catch(function(err) {
      console.log('Video autoplay fallback:', err);
    });
  });

  // ==========================================
  // PREMIUM NAVBAR — MOBILE TOGGLE & SCROLL
  // ==========================================

  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');

  if (navToggle && mobileDrawer && mobileBackdrop) {
    function toggleMobileNav(open) {
      const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', shouldOpen);
      mobileBackdrop.classList.toggle('open', shouldOpen);
      navToggle.classList.toggle('open', shouldOpen);
      document.body.style.overflow = shouldOpen ? 'hidden' : '';
    }

    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMobileNav();
    });

    mobileBackdrop.addEventListener('click', function() {
      toggleMobileNav(false);
    });

    mobileDrawer.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        toggleMobileNav(false);
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMobileNav(false);
      }
    });
  }

  // --- SCROLL EFFECT ---
  const navbar = document.getElementById('navbarWrapper');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ==========================================
  // AUTHENTICATION FUNCTIONS
  // ==========================================

  function getUsers() {
    return JSON.parse(localStorage.getItem('aura_users')) || [];
  }

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('aura_current_user')) || null;
  }

  function setCurrentUser(user) {
    localStorage.setItem('aura_current_user', JSON.stringify(user));
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  function logoutUser() {
    if (!isLoggedIn()) {
      sessionStorage.setItem('aura_auth_msg', 'Please Login or Signup first.');
      window.location.href = 'login.html';
      return;
    }
    localStorage.removeItem('aura_current_user');
    sessionStorage.setItem('aura_auth_msg', 'You have logged out successfully.');
    window.location.href = 'login.html';
  }

  // ==========================================
  // UPDATE NAVBAR BASED ON LOGIN STATE (FIXED)
  // ==========================================

  function updateNavbarAuth() {
    const user = getCurrentUser();
    
    // Toggle body class for instant CSS visibility rules
    if (user) {
      document.body.classList.add('logged-in');
    } else {
      document.body.classList.remove('logged-in');
    }

    const profileLinks = document.querySelectorAll('#profile-link, #mobile-profile-link');
    const logoutLinks = document.querySelectorAll('#logout-link, #mobile-logout-link');
    const loginLinks = document.querySelectorAll('#login-link, #mobile-login-link');
    const signupLinks = document.querySelectorAll('#signup-link, #mobile-signup-link');

    if (user) {
      profileLinks.forEach(el => {
        el.style.display = el.id.startsWith('mobile') ? 'block' : 'inline-block';
        const p = el.closest('.nav-item');
        if (p) p.style.display = 'inline-block';
      });
      logoutLinks.forEach(el => {
        el.style.display = el.id.startsWith('mobile') ? 'block' : 'inline-block';
        const p = el.closest('.nav-item');
        if (p) p.style.display = 'inline-block';
      });
      loginLinks.forEach(el => {
        el.style.display = 'none';
        const p = el.closest('.nav-item');
        if (p) p.style.display = 'none';
      });
      signupLinks.forEach(el => {
        el.style.display = 'none';
        const p = el.closest('.nav-item');
        if (p) p.style.display = 'none';
      });
    } else {
      profileLinks.forEach(el => {
        el.style.display = 'none';
        const p = el.closest('.nav-item');
        if (p) p.style.display = 'none';
      });
      logoutLinks.forEach(el => {
        el.style.display = 'none';
        const p = el.closest('.nav-item');
        if (p) p.style.display = 'none';
      });
      loginLinks.forEach(el => {
        el.style.display = el.id.startsWith('mobile') ? 'block' : 'inline-block';
        const p = el.closest('.nav-item');
        if (p) p.style.display = 'inline-block';
      });
      signupLinks.forEach(el => {
        el.style.display = el.id.startsWith('mobile') ? 'block' : 'inline-block';
        const p = el.closest('.nav-item');
        if (p) p.style.display = 'inline-block';
      });
    }

    console.log('Navbar updated. Logged in:', !!user);
  }

  // Call on page load
  updateNavbarAuth();

  // ==========================================
  // LOGOUT & PROFILE CLICK GUARDS
  // ==========================================

  const logoutLinks = document.querySelectorAll('#logout-link, #mobile-logout-link');
  logoutLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      logoutUser();
    });
  });

  document.querySelectorAll('#profile-link, #mobile-profile-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      if (!isLoggedIn()) {
        e.preventDefault();
        sessionStorage.setItem('aura_auth_msg', 'Access Restricted: Please Login or Signup first to view your Profile.');
        window.location.href = 'login.html';
      }
    });
  });

  // ==========================================
  // STRICT PROTECTED PAGE REDIRECT & AUTH GUARDS
  // ==========================================

  const rawPath = window.location.pathname;
  const currentPage = rawPath.split('/').pop().split('?')[0].split('#')[0] || 'index.html';
  const protectedPages = ['profile.html', 'my-bookings.html', 'room-booking.html', 'banquet-booking.html', 'resturant-booking.html', 'payment.html', 'booking-confirmation.html'];
  const authPages = ['login.html', 'signup.html'];

  // Check 1: Redirect unauthenticated user away from protected pages
  if (protectedPages.includes(currentPage) && !isLoggedIn()) {
    sessionStorage.setItem('aura_auth_msg', 'Access Restricted: Please Login or Signup first to access Profile and Bookings.');
    window.location.href = 'login.html';
  }

  // Check 2: Redirect logged-in user away from login/signup pages
  if (authPages.includes(currentPage) && isLoggedIn()) {
    window.location.href = 'profile.html';
  }

  // Check 3: Show auth restriction message on login page if set
  if (currentPage === 'login.html') {
    const authMsg = sessionStorage.getItem('aura_auth_msg');
    if (authMsg) {
      const feedback = document.getElementById('login-feedback');
      if (feedback) {
        feedback.textContent = authMsg;
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
      }
      sessionStorage.removeItem('aura_auth_msg');
    }
  }

  // ==========================================
  // DYNAMIC ACTIVE LINK HIGHLIGHTING
  // ==========================================

  function highlightActiveNavLink() {
    let pageName = currentPage || 'index.html';

    const pageCategoryMap = {
      'room-details.html': 'rooms.html',
      'room-booking.html': 'rooms.html',
      'resturant-booking.html': 'dining.html',
      'banquet-booking.html': 'banquet.html',
      'payment.html': 'rooms.html',
      'booking-confirmation.html': 'rooms.html',
      'my-bookings.html': 'profile.html'
    };

    if (pageCategoryMap[pageName]) {
      pageName = pageCategoryMap[pageName];
    }

    // Remove active class from all links first
    document.querySelectorAll('.navbar-nav .nav-link, .mobile-drawer .nav-link').forEach(function(link) {
      link.classList.remove('active');
    });

    // Add active class strictly to current page link
    document.querySelectorAll('.navbar-nav .nav-link, .mobile-drawer .nav-link').forEach(function(link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop().split('?')[0].split('#')[0];
      if (linkPage === pageName || (pageName === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  highlightActiveNavLink();

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  function getBookings() {
    return JSON.parse(localStorage.getItem('aura_bookings')) || [];
  }

  function saveBookings(bookings) {
    localStorage.setItem('aura_bookings', JSON.stringify(bookings));
  }

  function generateBookingId() {
    return 'AUR-' + Date.now().toString().slice(-8) + '-' + Math.floor(1000 + Math.random() * 9000);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addDaysToDate(dateStr, days) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return getLocalDateString(d);
  }

  function bindCheckinCheckoutConstraints(checkinEl, checkoutEl, onUpdate) {
    if (!checkinEl || !checkoutEl) return;

    const todayStr = getLocalDateString();
    const maxCheckinStr = addDaysToDate(todayStr, 90);

    checkinEl.setAttribute('min', todayStr);
    checkinEl.setAttribute('max', maxCheckinStr);

    if (!checkinEl.value || checkinEl.value < todayStr) {
      checkinEl.value = todayStr;
    } else if (checkinEl.value > maxCheckinStr) {
      checkinEl.value = maxCheckinStr;
    }

    function updateCheckoutLimits() {
      let currentIn = checkinEl.value || todayStr;

      if (currentIn < todayStr) {
        currentIn = todayStr;
        checkinEl.value = todayStr;
      } else if (currentIn > maxCheckinStr) {
        currentIn = maxCheckinStr;
        checkinEl.value = maxCheckinStr;
      }

      const minOut = addDaysToDate(currentIn, 1);
      const maxOut = addDaysToDate(currentIn, 7);

      checkoutEl.setAttribute('min', minOut);
      checkoutEl.setAttribute('max', maxOut);

      if (!checkoutEl.value || checkoutEl.value < minOut || checkoutEl.value > maxOut) {
        checkoutEl.value = minOut;
      }

      if (typeof onUpdate === 'function') {
        onUpdate();
      }
    }

    checkinEl.addEventListener('change', updateCheckoutLimits);
    checkinEl.addEventListener('input', updateCheckoutLimits);

    checkoutEl.addEventListener('change', function() {
      const currentIn = checkinEl.value || todayStr;
      const minOut = addDaysToDate(currentIn, 1);
      const maxOut = addDaysToDate(currentIn, 7);

      if (checkoutEl.value < minOut) {
        checkoutEl.value = minOut;
      } else if (checkoutEl.value > maxOut) {
        checkoutEl.value = maxOut;
      }

      if (typeof onUpdate === 'function') {
        onUpdate();
      }
    });

    updateCheckoutLimits();
  }

  // ==========================================
  // SIGNUP FORM
  // ==========================================

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const fname = document.getElementById('signup-fname').value.trim();
      const lname = document.getElementById('signup-lname').value.trim();
      const username = document.getElementById('signup-username').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const mobile = document.getElementById('signup-mobile').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirmPass = document.getElementById('signup-confirm-password').value;
      const feedback = document.getElementById('signup-feedback');

      if (!fname || !lname || !username || !email || !mobile || !password || !confirmPass) {
        feedback.textContent = 'Please complete all required fields.';
        feedback.className = 'form-feedback error';
        return;
      }

      if (password !== confirmPass) {
        feedback.textContent = 'Passwords do not match.';
        feedback.className = 'form-feedback error';
        return;
      }

      if (password.length < 6) {
        feedback.textContent = 'Password must be at least 6 characters.';
        feedback.className = 'form-feedback error';
        return;
      }

      const users = getUsers();
      if (users.find(u => u.username === username || u.email === email)) {
        feedback.textContent = 'Username or Email already exists.';
        feedback.className = 'form-feedback error';
        return;
      }

      const newUser = { fname, lname, username, email, mobile, password };
      users.push(newUser);
      localStorage.setItem('aura_users', JSON.stringify(users));

      feedback.textContent = 'Account created successfully! Redirecting to login...';
      feedback.className = 'form-feedback success';
      setTimeout(function() { window.location.href = 'login.html'; }, 1500);
    });
  }

  // ==========================================
  // LOGIN FORM
  // ==========================================

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const feedback = document.getElementById('login-feedback');

      if (!username || !password) {
        feedback.textContent = 'Please enter username and password.';
        feedback.className = 'form-feedback error';
        return;
      }

      const users = getUsers();
      const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

      if (!user) {
        feedback.textContent = 'Invalid username or password.';
        feedback.className = 'form-feedback error';
        return;
      }

      setCurrentUser(user);
      updateNavbarAuth();
      feedback.textContent = 'Login successful! Redirecting...';
      feedback.className = 'form-feedback success';
      setTimeout(function() { window.location.href = 'index.html'; }, 1000);
    });
  }

  // ==========================================
  // ROOM BOOKING
  // ==========================================

  const roomBookingForm = document.getElementById('room-booking-form');
  if (roomBookingForm) {
    if (!isLoggedIn()) {
      alert('Please Login or Signup to continue with your booking.');
      window.location.href = 'login.html';
    }

    const roomSelect = document.getElementById('room-type');
    const checkinInput = document.getElementById('check-in');
    const checkoutInput = document.getElementById('check-out');
    const roomsInput = document.getElementById('num-rooms');
    const totalDisplay = document.getElementById('total-amount');
    const nightsDisplay = document.getElementById('total-nights');

    const roomPrices = {
      'deluxe': 3000,
      'premium': 4500,
      'suite': 6000
    };

    function calculateTotal() {
      const roomType = roomSelect ? roomSelect.value : 'deluxe';
      const checkin = checkinInput ? checkinInput.value : '';
      const checkout = checkoutInput ? checkoutInput.value : '';
      const numRooms = roomsInput ? parseInt(roomsInput.value) || 1 : 1;

      if (checkin && checkout) {
        const start = new Date(checkin + 'T00:00:00');
        const end = new Date(checkout + 'T00:00:00');
        const nights = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
        const price = roomPrices[roomType] || 3000;
        const total = price * numRooms * nights;

        if (nightsDisplay) nightsDisplay.textContent = nights;
        if (totalDisplay) totalDisplay.textContent = '₹' + total.toLocaleString();
        return { nights, total };
      }
      return { nights: 0, total: 0 };
    }

    if (roomSelect) roomSelect.addEventListener('change', calculateTotal);
    if (roomsInput) roomsInput.addEventListener('change', calculateTotal);

    // Auto-fill logged in user info
    const loggedUser = getCurrentUser();
    if (loggedUser) {
      const nameEl = document.getElementById('full-name');
      const emailEl = document.getElementById('email');
      const mobileEl = document.getElementById('mobile');
      if (nameEl && !nameEl.value) nameEl.value = (loggedUser.fname + (loggedUser.lname ? ' ' + loggedUser.lname : '')).trim();
      if (emailEl && !emailEl.value) emailEl.value = loggedUser.email || '';
      if (mobileEl && !mobileEl.value) mobileEl.value = loggedUser.mobile || '';
    }

    // Read URL query parameters if passed from index.html reservation bar
    const urlParams = new URLSearchParams(window.location.search);
    const qIn = urlParams.get('checkin');
    const qOut = urlParams.get('checkout');
    const qGuests = urlParams.get('guests');
    const qRooms = urlParams.get('rooms');

    if (qIn && checkinInput) checkinInput.value = qIn;
    if (qOut && checkoutInput) checkoutInput.value = qOut;
    if (qGuests && document.getElementById('num-guests')) document.getElementById('num-guests').value = qGuests;
    if (qRooms && roomsInput) roomsInput.value = qRooms;

    if (checkinInput && checkoutInput) {
      bindCheckinCheckoutConstraints(checkinInput, checkoutInput, calculateTotal);
    }

    calculateTotal();

    roomBookingForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!isLoggedIn()) {
        alert('Please Login or Signup to continue with your booking.');
        window.location.href = 'login.html';
        return;
      }

      const fname = document.getElementById('full-name').value.trim();
      const email = document.getElementById('email').value.trim();
      const mobile = document.getElementById('mobile').value.trim();
      const idType = document.getElementById('id-type').value;
      const idNumber = document.getElementById('id-number').value.trim();
      const roomType = document.getElementById('room-type').value;
      const checkin = document.getElementById('check-in').value;
      const checkout = document.getElementById('check-out').value;
      const guests = document.getElementById('num-guests').value;
      const numRooms = document.getElementById('num-rooms').value;
      const feedback = document.getElementById('booking-feedback');

      if (!fname || !email || !mobile || !idNumber || !checkin || !checkout) {
        feedback.textContent = 'Please complete all required fields.';
        feedback.className = 'form-feedback error';
        return;
      }

      if (!idType) {
        feedback.textContent = 'Please select a Government ID type.';
        feedback.className = 'form-feedback error';
        return;
      }

      const start = new Date(checkin + 'T00:00:00');
      const end = new Date(checkout + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const maxCheckin = new Date(today);
      maxCheckin.setDate(maxCheckin.getDate() + 90);

      if (start < today) {
        feedback.textContent = 'Check-in date cannot be in the past.';
        feedback.className = 'form-feedback error';
        return;
      }

      if (start > maxCheckin) {
        feedback.textContent = 'Check-in date cannot be more than 90 days from today.';
        feedback.className = 'form-feedback error';
        return;
      }

      if (end <= start) {
        feedback.textContent = 'Check-out date must be after check-in date.';
        feedback.className = 'form-feedback error';
        return;
      }

      const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
      if (nights > 7) {
        feedback.textContent = 'Check-out date cannot be more than 7 days (1 week) after check-in date.';
        feedback.className = 'form-feedback error';
        return;
      }

      const roomPrice = roomPrices[roomType] || 3000;
      const total = roomPrice * parseInt(numRooms) * nights;

      const currentUser = getCurrentUser();
      const booking = {
        id: generateBookingId(),
        type: 'Room Booking',
        customer: fname,
        email: email,
        userEmail: currentUser ? currentUser.email : email,
        username: currentUser ? currentUser.username : '',
        mobile: mobile,
        roomType: roomType.charAt(0).toUpperCase() + roomType.slice(1),
        checkin: checkin,
        checkout: checkout,
        nights: nights,
        guests: guests,
        rooms: numRooms,
        amount: total,
        paymentStatus: 'Pending',
        bookingStatus: 'Confirmed',
        date: new Date().toISOString()
      };

      const bookings = getBookings();
      bookings.push(booking);
      saveBookings(bookings);

      localStorage.setItem('aura_current_booking', JSON.stringify(booking));

      feedback.textContent = 'Booking successful! Redirecting to payment...';
      feedback.className = 'form-feedback success';
      setTimeout(function() { window.location.href = 'payment.html'; }, 1000);
    });
  }

  // ==========================================
  // HOME PAGE RESERVATION BAR
  // ==========================================

  const homeCheckin = document.getElementById('home-checkin');
  const homeCheckout = document.getElementById('home-checkout');
  if (homeCheckin && homeCheckout) {
    bindCheckinCheckoutConstraints(homeCheckin, homeCheckout);
  }

  const homeResBar = document.getElementById('home-res-bar');
  if (homeResBar) {
    const resBtn = homeResBar.querySelector('.res-btn');
    if (resBtn) {
      resBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const checkin = homeCheckin ? homeCheckin.value : '';
        const checkout = homeCheckout ? homeCheckout.value : '';
        const guests = document.getElementById('home-guests') ? document.getElementById('home-guests').value : '2';
        const rooms = document.getElementById('home-room') ? document.getElementById('home-room').value : '1';
        window.location.href = `room-booking.html?checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}&guests=${encodeURIComponent(guests)}&rooms=${encodeURIComponent(rooms)}`;
      });
    }
  }

  // ==========================================
  // RESTAURANT BOOKING
  // ==========================================

  const restaurantForm = document.getElementById('restaurant-booking-form');
  const restDateInput = document.getElementById('rest-date');
  if (restDateInput) {
    const todayStr = getLocalDateString();
    const maxDateStr = addDaysToDate(todayStr, 90);
    restDateInput.setAttribute('min', todayStr);
    restDateInput.setAttribute('max', maxDateStr);
    if (!restDateInput.value || restDateInput.value < todayStr) {
      restDateInput.value = todayStr;
    } else if (restDateInput.value > maxDateStr) {
      restDateInput.value = maxDateStr;
    }
    restDateInput.addEventListener('change', function() {
      if (this.value < todayStr) this.value = todayStr;
      if (this.value > maxDateStr) this.value = maxDateStr;
    });
  }

  if (restaurantForm) {
    if (!isLoggedIn()) {
      alert('Please Login or Signup to continue with your booking.');
      window.location.href = 'login.html';
    }

    restaurantForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!isLoggedIn()) {
        alert('Please Login or Signup to continue with your booking.');
        window.location.href = 'login.html';
        return;
      }

      const fname = document.getElementById('rest-fname').value.trim();
      const email = document.getElementById('rest-email').value.trim();
      const mobile = document.getElementById('rest-mobile').value.trim();
      const idType = document.getElementById('rest-id-type').value;
      const idNumber = document.getElementById('rest-id-number').value.trim();
      const date = document.getElementById('rest-date').value;
      const time = document.getElementById('rest-time').value;
      const guests = document.getElementById('rest-guests').value;
      const request = document.getElementById('rest-request').value.trim();
      const feedback = document.getElementById('rest-feedback');

      if (!fname || !email || !mobile || !idNumber || !date || !time) {
        feedback.textContent = 'Please complete all required fields.';
        feedback.className = 'form-feedback error';
        return;
      }

      if (!idType) {
        feedback.textContent = 'Please select a Government ID type.';
        feedback.className = 'form-feedback error';
        return;
      }

      const todayStr = getLocalDateString();
      const maxDateStr = addDaysToDate(todayStr, 90);
      if (date < todayStr) {
        feedback.textContent = 'Booking date cannot be in the past.';
        feedback.className = 'form-feedback error';
        return;
      }
      if (date > maxDateStr) {
        feedback.textContent = 'Booking date cannot be more than 90 days from today.';
        feedback.className = 'form-feedback error';
        return;
      }

      const currentUser = getCurrentUser();
      const booking = {
        id: generateBookingId(),
        type: 'Restaurant Booking',
        customer: fname,
        email: email,
        userEmail: currentUser ? currentUser.email : email,
        username: currentUser ? currentUser.username : '',
        mobile: mobile,
        date: date,
        time: time,
        guests: guests,
        specialRequest: request || 'None',
        amount: 0,
        paymentStatus: 'N/A',
        bookingStatus: 'Confirmed',
        bookingDate: new Date().toISOString()
      };

      const bookings = getBookings();
      bookings.push(booking);
      saveBookings(bookings);

      localStorage.setItem('aura_current_booking', JSON.stringify(booking));

      feedback.textContent = 'Restaurant booking confirmed! Redirecting to confirmation...';
      feedback.className = 'form-feedback success';
      setTimeout(function() { window.location.href = 'booking-confirmation.html'; }, 1000);
    });
  }

  // ==========================================
  // BANQUET BOOKING
  // ==========================================

  const banquetForm = document.getElementById('banquet-booking-form');
  const eventDateInput = document.getElementById('event-date');
  if (eventDateInput) {
    const todayStr = getLocalDateString();
    const maxDateStr = addDaysToDate(todayStr, 90);
    eventDateInput.setAttribute('min', todayStr);
    eventDateInput.setAttribute('max', maxDateStr);
    if (!eventDateInput.value || eventDateInput.value < todayStr) {
      eventDateInput.value = todayStr;
    } else if (eventDateInput.value > maxDateStr) {
      eventDateInput.value = maxDateStr;
    }
    eventDateInput.addEventListener('change', function() {
      if (this.value < todayStr) this.value = todayStr;
      if (this.value > maxDateStr) this.value = maxDateStr;
    });
  }

  if (banquetForm) {
    if (!isLoggedIn()) {
      alert('Please Login or Signup to continue with your booking.');
      window.location.href = 'login.html';
    }

    banquetForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!isLoggedIn()) {
        alert('Please Login or Signup to continue with your booking.');
        window.location.href = 'login.html';
        return;
      }

      const fname = document.getElementById('ban-fname').value.trim();
      const email = document.getElementById('ban-email').value.trim();
      const mobile = document.getElementById('ban-mobile').value.trim();
      const idType = document.getElementById('ban-id-type').value;
      const idNumber = document.getElementById('ban-id-number').value.trim();
      const eventType = document.getElementById('event-type').value;
      const eventDate = document.getElementById('event-date').value;
      const guests = document.getElementById('ban-guests').value;
      const hallType = document.getElementById('hall-type').value;
      const startTime = document.getElementById('start-time').value;
      const endTime = document.getElementById('end-time').value;
      const catering = document.getElementById('catering').value;
      const decoration = document.querySelector('input[name="decoration"]:checked');
      const requirements = document.getElementById('special-requirements').value.trim();
      const feedback = document.getElementById('ban-feedback');

      if (!fname || !email || !mobile || !idNumber || !eventDate || !startTime || !endTime) {
        feedback.textContent = 'Please complete all required fields.';
        feedback.className = 'form-feedback error';
        return;
      }

      if (!idType) {
        feedback.textContent = 'Please select a Government ID type.';
        feedback.className = 'form-feedback error';
        return;
      }

      if (!eventType) {
        feedback.textContent = 'Please select an event type.';
        feedback.className = 'form-feedback error';
        return;
      }

      const todayStr = getLocalDateString();
      const maxDateStr = addDaysToDate(todayStr, 90);
      if (eventDate < todayStr) {
        feedback.textContent = 'Event date cannot be in the past.';
        feedback.className = 'form-feedback error';
        return;
      }
      if (eventDate > maxDateStr) {
        feedback.textContent = 'Event date cannot be more than 90 days from today.';
        feedback.className = 'form-feedback error';
        return;
      }

      const hallPrices = {
        'grand': 50000,
        'royal': 35000,
        'executive': 25000
      };
      const basePrice = hallPrices[hallType] || 25000;

      const currentUser = getCurrentUser();
      const booking = {
        id: generateBookingId(),
        type: 'Banquet Booking',
        customer: fname,
        email: email,
        userEmail: currentUser ? currentUser.email : email,
        username: currentUser ? currentUser.username : '',
        mobile: mobile,
        eventType: eventType,
        eventDate: eventDate,
        guests: guests,
        hallType: hallType,
        startTime: startTime,
        endTime: endTime,
        catering: catering || 'None',
        decoration: decoration ? decoration.value : 'No',
        requirements: requirements || 'None',
        amount: basePrice,
        paymentStatus: 'Pending',
        bookingStatus: 'Confirmed',
        bookingDate: new Date().toISOString()
      };

      const bookings = getBookings();
      bookings.push(booking);
      saveBookings(bookings);

      localStorage.setItem('aura_current_booking', JSON.stringify(booking));

      feedback.textContent = 'Banquet booking confirmed! Redirecting to payment...';
      feedback.className = 'form-feedback success';
      setTimeout(function() { window.location.href = 'payment.html'; }, 1000);
    });
  }

  // ==========================================
  // PAYMENT
  // ==========================================

  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    const booking = JSON.parse(localStorage.getItem('aura_current_booking')) || {};
    const amountDisplay = document.getElementById('payment-amount');
    if (amountDisplay && booking.amount) {
      amountDisplay.textContent = '₹' + booking.amount.toLocaleString();
    }

    const methodRadios = document.querySelectorAll('input[name="payment-method"]');
    const upiDetails = document.getElementById('upi-details');
    const cardDetails = document.getElementById('card-details');

    methodRadios.forEach(function(radio) {
      radio.addEventListener('change', function() {
        if (upiDetails) upiDetails.style.display = this.value === 'upi' ? 'block' : 'none';
        if (cardDetails) cardDetails.style.display = this.value === 'card' ? 'block' : 'none';
      });
    });

    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const method = document.querySelector('input[name="payment-method"]:checked');
      const feedback = document.getElementById('payment-feedback');

      if (!method) {
        feedback.textContent = 'Please select a payment method.';
        feedback.className = 'form-feedback error';
        return;
      }

      feedback.textContent = 'Processing payment...';
      feedback.className = 'form-feedback';

      setTimeout(function() {
        if (booking.id) {
          const bookings = getBookings();
          const index = bookings.findIndex(b => b.id === booking.id);
          if (index !== -1) {
            bookings[index].paymentStatus = 'Paid';
            saveBookings(bookings);
            booking.paymentStatus = 'Paid';
            localStorage.setItem('aura_current_booking', JSON.stringify(booking));
          }
        }

        feedback.textContent = 'Payment Successful! Redirecting to confirmation...';
        feedback.className = 'form-feedback success';
        setTimeout(function() {
          window.location.href = 'booking-confirmation.html';
        }, 1500);
      }, 1500);
    });
  }

  // ==========================================
  // BOOKING CONFIRMATION
  // ==========================================

  const confirmationContainer = document.getElementById('confirmation-container');
  if (confirmationContainer) {
    const booking = JSON.parse(localStorage.getItem('aura_current_booking')) || {};

    if (!booking.id) {
      document.querySelector('.conf-box').innerHTML = '<h2>No booking found</h2><p>Please make a booking first.</p><a href="index.html" class="btn btn-primary mt-2">Return Home</a>';
    } else {
      document.getElementById('conf-booking-id').textContent = booking.id || 'N/A';
      document.getElementById('conf-customer').textContent = booking.customer || 'N/A';
      document.getElementById('conf-type').textContent = booking.type || 'N/A';
      document.getElementById('conf-date').textContent = formatDate(booking.bookingDate || booking.date || new Date().toISOString());
      document.getElementById('conf-amount').textContent = booking.amount ? '₹' + booking.amount.toLocaleString() : '₹0';
      document.getElementById('conf-payment-status').textContent = booking.paymentStatus || 'Pending';
      document.getElementById('conf-booking-status').textContent = booking.bookingStatus || 'Confirmed';

      let detailsHTML = '';
      if (booking.type === 'Room Booking') {
        detailsHTML = `
          <div><strong>Room:</strong> ${booking.roomType || 'N/A'}</div>
          <div><strong>Check-in:</strong> ${formatDate(booking.checkin)}</div>
          <div><strong>Check-out:</strong> ${formatDate(booking.checkout)}</div>
          <div><strong>Nights:</strong> ${booking.nights || 0}</div>
          <div><strong>Guests:</strong> ${booking.guests || 0}</div>
          <div><strong>Rooms:</strong> ${booking.rooms || 0}</div>
        `;
      } else if (booking.type === 'Restaurant Booking') {
        detailsHTML = `
          <div><strong>Date:</strong> ${formatDate(booking.date)}</div>
          <div><strong>Time:</strong> ${booking.time || 'N/A'}</div>
          <div><strong>Guests:</strong> ${booking.guests || 0}</div>
          <div><strong>Special Request:</strong> ${booking.specialRequest || 'None'}</div>
        `;
      } else if (booking.type === 'Banquet Booking') {
        detailsHTML = `
          <div><strong>Event:</strong> ${booking.eventType || 'N/A'}</div>
          <div><strong>Date:</strong> ${formatDate(booking.eventDate)}</div>
          <div><strong>Hall:</strong> ${booking.hallType || 'N/A'}</div>
          <div><strong>Guests:</strong> ${booking.guests || 0}</div>
          <div><strong>Time:</strong> ${booking.startTime || 'N/A'} - ${booking.endTime || 'N/A'}</div>
          <div><strong>Catering:</strong> ${booking.catering || 'None'}</div>
          <div><strong>Decoration:</strong> ${booking.decoration || 'No'}</div>
        `;
      }
      document.getElementById('conf-details').innerHTML = detailsHTML;
    }
  }

  // ==========================================
  // PROFILE
  // ==========================================

  const profileContainer = document.getElementById('profile-container');
  if (profileContainer) {
    const user = getCurrentUser();

    if (!user) {
      profileContainer.innerHTML = `
        <div class="text-center">
          <h2>Please Login</h2>
          <p>You need to be logged in to view your profile.</p>
          <a href="login.html" class="btn btn-primary mt-2">Login</a>
        </div>
      `;
    } else {
      profileContainer.innerHTML = `
        <h3 class="mb-3"><i class="bi bi-person-circle me-2"></i>User Profile</h3>
        <div class="row g-3">
          <div class="col-sm-6">
            <span class="text-stone d-block small">FIRST NAME</span>
            <strong class="fs-6" id="profile-fname">${user.fname || 'N/A'}</strong>
          </div>
          <div class="col-sm-6">
            <span class="text-stone d-block small">LAST NAME</span>
            <strong class="fs-6" id="profile-lname">${user.lname || 'N/A'}</strong>
          </div>
          <div class="col-sm-6">
            <span class="text-stone d-block small">USERNAME</span>
            <strong class="fs-6" id="profile-username">${user.username || 'N/A'}</strong>
          </div>
          <div class="col-sm-6">
            <span class="text-stone d-block small">EMAIL ADDRESS</span>
            <strong class="fs-6" id="profile-email">${user.email || 'N/A'}</strong>
          </div>
          <div class="col-sm-6">
            <span class="text-stone d-block small">MOBILE NUMBER</span>
            <strong class="fs-6" id="profile-mobile">${user.mobile || 'N/A'}</strong>
          </div>
        </div>
      `;
    }
  }

  // ==========================================
  // MY BOOKINGS (Inside Profile page)
  // ==========================================

  const bookingsContainer = document.getElementById('bookings-container');
  if (bookingsContainer) {
    const user = getCurrentUser();

    if (!user) {
      bookingsContainer.innerHTML = `
        <div class="text-center">
          <h2>Please Login</h2>
          <p>You need to be logged in to view your bookings.</p>
          <a href="login.html" class="btn btn-primary mt-2">Login</a>
        </div>
      `;
    } else {
      const allBookings = getBookings();
      let userBookings = allBookings.filter(function(b) {
        if (!user) return false;
        const userEmail = (user.email || '').toLowerCase().trim();
        const bEmail = (b.email || b.userEmail || '').toLowerCase().trim();
        const userUsername = (user.username || '').toLowerCase().trim();
        const bUsername = (b.username || '').toLowerCase().trim();
        const userMobile = (user.mobile || '').replace(/\D/g, '');
        const bMobile = (b.mobile || '').replace(/\D/g, '');
        const userFname = (user.fname || '').toLowerCase().trim();
        const userLname = (user.lname || '').toLowerCase().trim();
        const bCustomer = (b.customer || '').toLowerCase().trim();

        // 1. Email match (case-insensitive)
        if (userEmail && bEmail && (userEmail === bEmail || bEmail.includes(userEmail) || userEmail.includes(bEmail))) return true;
        // 2. Username match
        if (userUsername && bUsername && userUsername === bUsername) return true;
        // 3. Mobile match
        if (userMobile && bMobile && userMobile.length >= 5 && (userMobile === bMobile || userMobile.endsWith(bMobile) || bMobile.endsWith(userMobile))) return true;
        // 4. Customer name match
        if (bCustomer) {
          if (userFname && bCustomer.includes(userFname)) return true;
          if (userLname && bCustomer.includes(userLname)) return true;
          if (userUsername && bCustomer.includes(userUsername)) return true;
        }

        // 5. Fallback: if booking was created in the current session
        const currentBooking = JSON.parse(localStorage.getItem('aura_current_booking')) || {};
        if (currentBooking.id && currentBooking.id === b.id) return true;

        return false;
      });

      // Safe Fallback: If user has local bookings stored in browser, display them
      if (userBookings.length === 0 && allBookings.length > 0) {
        userBookings = allBookings;
      }

      if (userBookings.length === 0) {
        bookingsContainer.innerHTML = `
          <div class="text-center">
            <h2>No Bookings Found</h2>
            <p>You haven't made any bookings yet.</p>
            <a href="room-booking.html" class="btn btn-primary mt-2">Book Now</a>
          </div>
        `;
      } else {
        let html = '<div class="table-responsive"><table class="table"><thead><tr><th>Booking ID</th><th>Type</th><th>Date</th><th>Details</th><th>Amount</th><th>Payment</th><th>Status</th></tr></thead><tbody>';
        userBookings.forEach(function(b) {
          let details = '';
          if (b.type === 'Room Booking') {
            details = `${b.roomType || ''} (${b.nights || 0} nights)`;
          } else if (b.type === 'Restaurant Booking') {
            details = `${formatDate(b.date)} at ${b.time || ''}`;
          } else if (b.type === 'Banquet Booking') {
            details = `${b.eventType || ''} - ${b.hallType || ''}`;
          }
          html += `
            <tr>
              <td><strong>${b.id || 'N/A'}</strong></td>
              <td>${b.type || 'N/A'}</td>
              <td>${formatDate(b.bookingDate || b.date || new Date().toISOString())}</td>
              <td>${details}</td>
              <td>${b.amount ? '₹' + b.amount.toLocaleString() : '₹0'}</td>
              <td><span class="badge ${b.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}">${b.paymentStatus || 'Pending'}</span></td>
              <td><span class="badge bg-primary">${b.bookingStatus || 'Confirmed'}</span></td>
            </tr>
          `;
        });
        html += '</tbody></table></div>';
        bookingsContainer.innerHTML = html;
      }
    }
  }

  // ==========================================
  // PROFILE LOGOUT BUTTON
  // ==========================================

  const profileLogoutBtn = document.getElementById('profile-logout-btn');
  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener('click', function() {
      logoutUser();
    });
  }

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================
  // GALLERY FILTER
  // ==========================================

  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');

      const category = this.getAttribute('data-filter');
      galleryItems.forEach(function(item) {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          item.style.display = 'block';
          setTimeout(function() { item.style.opacity = '1'; }, 50);
        } else {
          item.style.opacity = '0';
          setTimeout(function() { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ==========================================
  // LIGHTBOX
  // ==========================================

  const lightbox = document.querySelector('.lightbox-modal');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxCategory = lightbox.querySelector('.lightbox-category');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    let visibleItems = [];

    function getVisibleItems() {
      return Array.from(galleryItems).filter(function(item) {
        return item.style.display !== 'none';
      });
    }

    function updateLightbox(index) {
      visibleItems = getVisibleItems();
      if (visibleItems.length === 0) return;
      if (index < 0) index = visibleItems.length - 1;
      if (index >= visibleItems.length) index = 0;
      currentIndex = index;

      const item = visibleItems[currentIndex];
      const img = item.querySelector('.gallery-img');
      const title = item.getAttribute('data-title') || item.querySelector('.gallery-caption')?.textContent || '';
      const cat = item.getAttribute('data-category') || '';

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Aura Resort Gallery';
      }
      if (lightboxCaption) lightboxCaption.textContent = title;
      if (lightboxCategory) lightboxCategory.textContent = cat.toUpperCase();
      if (lightboxCounter) lightboxCounter.textContent = (currentIndex + 1) + ' / ' + visibleItems.length;
    }

    function openLightbox(item) {
      visibleItems = getVisibleItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) {
        updateLightbox(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function(item) {
      item.addEventListener('click', function() { openLightbox(this); });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function() { updateLightbox(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { updateLightbox(currentIndex + 1); });

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') updateLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') updateLightbox(currentIndex + 1);
    });
  }

  // ==========================================
  // CONTACT FORM
  // ==========================================

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value.trim();
      const feedback = document.getElementById('contact-feedback');

      if (!name || !email || !message) {
        feedback.textContent = 'Please complete all required fields.';
        feedback.className = 'form-feedback error';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedback.textContent = 'Please enter a valid email address.';
        feedback.className = 'form-feedback error';
        return;
      }

      feedback.textContent = 'Thank you for reaching out! Our team will get back to you shortly.';
      feedback.className = 'form-feedback success';
      contactForm.reset();
    });
  }

  console.log('Aura Resort System Initialized.');
});