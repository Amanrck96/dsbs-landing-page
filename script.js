/* ==========================================================================
   Dayananda Sagar Business School (DSBS) - Interactive Logic Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. STICKY NAVBAR LOGIC
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check in case of page reload halfway down
    // 2. MOBILE MENU DRAWER
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const backdrop = document.getElementById('backdrop');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    const openMobileMenu = () => {
        mobileNav.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden'; // Disable scroll under drawer
    };

    const closeMobileMenu = () => {
        mobileNav.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = ''; // Re-enable scroll
    };

    if (menuToggleBtn && menuCloseBtn && mobileNav && backdrop) {
        menuToggleBtn.addEventListener('click', openMobileMenu);
        menuCloseBtn.addEventListener('click', closeMobileMenu);
        backdrop.addEventListener('click', closeMobileMenu);

        // Close menu when clicking on any mobile nav links
        mobileNavItems.forEach(item => {
            item.addEventListener('click', closeMobileMenu);
        });
    }

    // 3. SMOOTH NAVIGATION WITH NAVBAR OFFSET
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Ignore blank or dummy links
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 10;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // 4. FAQ ACCORDION INTERACTIVITY
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(questionBtn => {
        questionBtn.addEventListener('click', () => {
            const faqItem = questionBtn.parentElement;
            const faqAnswer = questionBtn.nextElementSibling;

            // Check if item is already active
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQ items first
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
                // Calculate precise content height for smooth transition
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });


    // 5. ENHANCED FORM LOAD FALLBACK
    // Since the widget script loads asynchronously, check if it injects the form.
    // If it takes too long (e.g. adblocker blocking ExtraaEdge script), show a visual message.
    setTimeout(() => {
        const formContainer = document.getElementById('ee-form-1');
        const fallbackLoader = document.querySelector('.form-fallback-loader');

        if (formContainer && fallbackLoader) {
            // If the widget script has not injected its form structure (typically marked by inputs/forms)
            if (formContainer.children.length <= 1 && formContainer.contains(fallbackLoader)) {
                fallbackLoader.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <i class="fa-solid fa-circle-exclamation" style="font-size: 2.5rem; color: var(--accent-gold); margin-bottom: 12px;"></i>
                        <h4 style="color: white; margin-bottom: 8px;">Connect Instantly</h4>
                        <p style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.8); margin-bottom: 16px;">The admissions CRM widget is taking longer than expected to load.</p>
                        <a href="https://wa.me/919611515262?text=Hi%20I%20want%20to%20know%20about%20MBA%20admissions" class="btn btn-secondary" style="width: 100%;">Chat on WhatsApp</a>
                    </div>
                `;
            }
        }
    }, 8000); // 8 seconds timeout

});

