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

    menuToggleBtn.addEventListener('click', openMobileMenu);
    menuCloseBtn.addEventListener('click', closeMobileMenu);
    backdrop.addEventListener('click', closeMobileMenu);

    // Close menu when clicking on mobile navigation links
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            closeMobileMenu();
        });
    });


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


    // 6. DYNAMIC FORM DROPDOWNS CUSTOMIZATION & CONSENT INJECTION (Specializations, State & City, DND Consent)
    const specializationsList = [
        "Business Analytics",
        "Entrepreneurship",
        "Financial Management",
        "Healthcare Management",
        "Human Resource Management",
        "International Business Management",
        "Marketing Management",
        "Operations & Supply Chain Management",
        "Retail Management",
        "Tourism & Hospitality Management"
    ];

    const stateCityMap = {
        "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Anantapur", "Kadapa", "Eluru"],
        "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang"],
        "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Purnia"],
        "Chandigarh": ["Chandigarh"],
        "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur"],
        "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Dwarka", "Rohini"],
        "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Navsari"],
        "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
        "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Nahan", "Una"],
        "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Udhampur"],
        "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Hazaribagh", "Giridih"],
        "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Davangere", "Ballari", "Tumakuru", "Shivamogga", "Kalaburagi"],
        "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kannur", "Kottayam"],
        "Ladakh": ["Leh", "Kargil"],
        "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Pimpri-Chinchwad", "Nashik", "Aurangabad", "Navi Mumbai", "Solapur", "Kolhapur", "Amravati"],
        "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Senapati"],
        "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
        "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai"],
        "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
        "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore"],
        "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
        "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar", "Bhilwara", "Sikar", "Bharatpur"],
        "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Nagercoil"],
        "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar"],
        "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Gorakhpur", "Jhansi"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Roorkee", "Rudrapur", "Kashipur"],
        "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Kharagpur", "Bardhaman", "Malda", "Baharampur"]
    };

    // Helper to check if select options match expected array
    const checkOptionsMatch = (selectEl, list, placeholderText) => {
        if (!selectEl) return false;
        const options = selectEl.options;
        if (options.length !== list.length + 1) return false;
        if (options[0].textContent !== placeholderText) return false;
        for (let i = 0; i < list.length; i++) {
            if (options[i + 1].value !== list[i]) return false;
        }
        return true;
    };

    const enforceConsentCheckbox = (form) => {
        if (!form) return;

        // Don't inject again if already present
        if (document.getElementById('custom-consent-container')) return;

        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button.btn, button');
        if (!submitBtn) return;

        // Create container div
        const consentContainer = document.createElement('div');
        consentContainer.id = 'custom-consent-container';

        // Create checkbox element
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'custom-consent-checkbox';
        checkbox.required = true;

        // Create label element
        const label = document.createElement('label');
        label.htmlFor = 'custom-consent-checkbox';
        label.innerHTML = 'I authorize DSBS and its representatives to contact me with updates and notifications via email, SMS, WhatsApp and call. This will override the registry of DND / NDNC.';

        consentContainer.appendChild(checkbox);
        consentContainer.appendChild(label);

        // Insert checkbox container right before the submit button
        submitBtn.parentNode.insertBefore(consentContainer, submitBtn);
        console.log("Consent checkbox injected successfully.");
    };

    const enforceCustomizations = () => {
        const formContainer = document.getElementById('ee-form-1');
        if (!formContainer) return;

        const form = formContainer.querySelector('form');
        if (form) {
            enforceConsentCheckbox(form);
        }

        const selectElements = formContainer.querySelectorAll('select');
        if (selectElements.length === 0) return;

        let specSelect = null;
        let stateSelect = null;
        let citySelect = null;

        selectElements.forEach(select => {
            const name = (select.getAttribute('name') || '').toLowerCase();
            const id = (select.getAttribute('id') || '').toLowerCase();
            const containerText = select.closest('.form-group, .ee-field-container, div')?.textContent?.toLowerCase() || '';

            if (name.includes('course') || name.includes('specialization') || name.includes('program') ||
                id.includes('course') || id.includes('specialization') || id.includes('program') ||
                containerText.includes('course') || containerText.includes('specialization') || containerText.includes('program') ||
                containerText.includes('discipline')) {
                specSelect = select;
            } else if (name.includes('state') || id.includes('state') || containerText.includes('state')) {
                stateSelect = select;
            } else if (name.includes('city') || id.includes('city') || containerText.includes('city')) {
                citySelect = select;
            }
        });

        // 1. Enforce Specialization Options
        if (specSelect && !checkOptionsMatch(specSelect, specializationsList, 'Select Specialization')) {
            const prevVal = specSelect.value;
            specSelect.innerHTML = '';

            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = 'Select Specialization';
            placeholder.selected = !prevVal;
            specSelect.appendChild(placeholder);

            specializationsList.forEach(spec => {
                const opt = document.createElement('option');
                opt.value = spec;
                opt.textContent = spec;
                if (spec === prevVal) opt.selected = true;
                specSelect.appendChild(opt);
            });
            console.log("Enforced custom specializations dropdown options.");
        }

        // 2. Enforce States Options
        const sortedStates = Object.keys(stateCityMap).sort();
        if (stateSelect && !checkOptionsMatch(stateSelect, sortedStates, 'Select State')) {
            const prevVal = stateSelect.value;
            stateSelect.innerHTML = '';

            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = 'Select State';
            placeholder.selected = !prevVal;
            stateSelect.appendChild(placeholder);

            sortedStates.forEach(state => {
                const opt = document.createElement('option');
                opt.value = state;
                opt.textContent = state;
                if (state === prevVal) opt.selected = true;
                stateSelect.appendChild(opt);
            });
            console.log("Enforced custom states dropdown options.");
        }

        // 3. Enforce Cities Options depending on State selection
        if (stateSelect && citySelect) {
            const selectedState = stateSelect.value;
            const expectedCities = (selectedState && stateCityMap[selectedState]) ? [...stateCityMap[selectedState]].sort() : [];

            if (!checkOptionsMatch(citySelect, expectedCities, 'Select City')) {
                const prevVal = citySelect.value;
                citySelect.innerHTML = '';

                const placeholder = document.createElement('option');
                placeholder.value = '';
                placeholder.textContent = 'Select City';
                placeholder.selected = !prevVal;
                citySelect.appendChild(placeholder);

                expectedCities.forEach(city => {
                    const opt = document.createElement('option');
                    opt.value = city;
                    opt.textContent = city;
                    if (city === prevVal) opt.selected = true;
                    citySelect.appendChild(opt);
                });

                if (expectedCities.length > 0) {
                    citySelect.disabled = false;
                } else {
                    citySelect.disabled = true;
                }
                console.log("Enforced custom cities dropdown options for state:", selectedState);
            }
        }
    };

    // Use event delegation to catch user interaction immediately
    document.addEventListener('change', (e) => {
        if (e.target && e.target.tagName === 'SELECT') {
            const containerText = e.target.closest('.form-group, .ee-field-container, div')?.textContent?.toLowerCase() || '';
            const name = (e.target.getAttribute('name') || '').toLowerCase();
            const id = (e.target.getAttribute('id') || '').toLowerCase();

            if (name.includes('state') || id.includes('state') || containerText.includes('state')) {
                // Immediately enforce on State change
                setTimeout(enforceCustomizations, 30);
            }
        }
    });

    // Run enforcement loop to keep form state correct even if the widget loads dynamically or changes async
    const customizationInterval = setInterval(enforceCustomizations, 400);

    // Keep loop active to guard against widget re-initialization or late API updates
    setTimeout(() => {
        clearInterval(customizationInterval);
        // Fallback to a slower interval after initial loading phase to save CPU cycles
        setInterval(enforceCustomizations, 1500);
    }, 30000);
});

