document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Logic
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Theme toggle logic...

    // Terminal typing effect (simpler version)
    const terminalLines = document.querySelectorAll('.terminal-body .line.res');
    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
            line.style.transition = 'opacity 0.5s ease-in';
            line.style.opacity = '1';
        }, (index + 1) * 800);
    });

    // Mouse movement light effect
    const gradientLight = document.querySelector('.gradient-light');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        if (gradientLight) {
            gradientLight.style.transform = `translate(${x / 50}px, ${y / 50}px)`;
        }
    });

    // FAQ Accordion logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Testimonials stay fixed on the page.

    // Services stay fixed on the page.

    // Continuous Infinite Project Scroller
    const projectTrack = document.querySelector('.projects-track');
    if (projectTrack) {
        const originalCards = Array.from(projectTrack.children);

        // Clone cards to create a seamless infinite loop
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            projectTrack.appendChild(clone);
        });

        let scrollAmount = 0;
        let isPaused = false;
        const scrollSpeed = 0.8; // Adjust for speed (pixels per frame)

        function getTrackWidth() {
            const card = originalCards[0];
            const style = window.getComputedStyle(projectTrack);
            const gap = parseInt(style.gap) || 0;
            return originalCards.length * (card.offsetWidth + gap);
        }

        function animate() {
            if (!isPaused) {
                scrollAmount += scrollSpeed;
                const trackWidth = getTrackWidth();

                if (scrollAmount >= trackWidth) {
                    scrollAmount = 0;
                }

                projectTrack.style.transform = `translateX(-${scrollAmount}px)`;
            }
            requestAnimationFrame(animate);
        }

        // Start animation
        requestAnimationFrame(animate);

        // Pause on hover
        projectTrack.addEventListener('mouseenter', () => isPaused = true);
        projectTrack.addEventListener('mouseleave', () => isPaused = false);

        // Navigation Buttons
        const pNextBtn = document.querySelector('.next-btn');
        const pPrevBtn = document.querySelector('.prev-btn');

        if (pNextBtn) {
            pNextBtn.addEventListener('click', () => {
                const card = originalCards[0];
                const style = window.getComputedStyle(projectTrack);
                const gap = parseInt(style.gap) || 0;
                scrollAmount += (card.offsetWidth + gap);
                const trackWidth = getTrackWidth();
                if (scrollAmount >= trackWidth) scrollAmount -= trackWidth;
                projectTrack.style.transform = `translateX(-${scrollAmount}px)`;
            });
        }

        if (pPrevBtn) {
            pPrevBtn.addEventListener('click', () => {
                const card = originalCards[0];
                const style = window.getComputedStyle(projectTrack);
                const gap = parseInt(style.gap) || 0;
                scrollAmount -= (card.offsetWidth + gap);
                const trackWidth = getTrackWidth();
                if (scrollAmount < 0) scrollAmount += trackWidth;
                projectTrack.style.transform = `translateX(-${scrollAmount}px)`;
            });
        }
    }

    // Update on resize
    window.addEventListener('resize', () => {
        const newCardsPerView = window.innerWidth > 1100 ? 3 : (window.innerWidth > 992 ? 2 : 1);
        if (newCardsPerView !== cardsPerView) {
            location.reload(); // Simple reload for now as it's safer given the current structural implementation
        } else {
            moveToSlide(currentSlide);
        }
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Change button state
            const submitBtn = contactForm.querySelector('.btn-send');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // Hide previous status
            formStatus.style.display = 'none';
            formStatus.className = 'form-status';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Destinations
            const scriptURL = 'https://script.google.com/macros/s/AKfycbz-a7wB3BvXrIxdQ6CJg5m5ICfXA6GbQXv0QUtS_REWTp7RhEbe4graXQg6Jo2uMrFw/exec';
            const emailURL = 'https://formsubmit.co/ajax/shubhammpathak566@gmail.com';

            try {
                // Send to both destinations concurrently
                const results = await Promise.allSettled([
                    // 1. Google Sheets (Existing)
                    fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' }),

                    // 2. Email Notification (New)
                    fetch(emailURL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                ]);

                // Check if any attempt was at least visually successful
                const isSuccessful = results.some(res =>
                    res.status === 'fulfilled' && (res.value.ok || res.value.type === 'opaque')
                );

                if (isSuccessful) {
                    formStatus.innerText = 'Message sent! Check Gmail for activation (first time).';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    throw new Error('All submission attempts failed');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                formStatus.innerText = 'Error sending message. Please try again or email directly.';
                formStatus.classList.add('error');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                formStatus.style.display = 'block';

                // Hide message after 8 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 8000);
            }
        });
    }

    // Reset button functionality
    const resetBtn = document.querySelector('.btn-reset');
    if (resetBtn && contactForm) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactForm.reset();
            formStatus.style.display = 'none';
        });
    }

    // Chatbot Functionality
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const sendMsg = document.getElementById('send-msg');
    const optionBtns = document.querySelectorAll('.option-btn');

    const responses = {
        skills: "Shubham specializes in Java, Spring Boot, Microservices, and Cloud Engineering (AWS). He also has a strong foundation in SQL, NoSQL, and System Design.",
        projects: "Some of Shubham's featured projects include CampusSetu (Smart Campus Management), a scalable E-Commerce platform, and an AI Chat Assistant. Check the Projects section for details!",
        contact: "You can reach Shubham at shubhammpathak566@gmail.com or call +91 7858024086. You can also use the form in the Contact section!",
        resume: "You can download Shubham's resume directly from the Hero section or by clicking the 'Download Resume' button in the chat menu.",
        default: "I'm not sure about that, but I can tell you about Shubham's skills, projects, or how to contact him. Choose an option above!"
    };

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerText = text;
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    if (chatbotTrigger) {
        chatbotTrigger.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            const tooltip = chatbotTrigger.querySelector('.chatbot-tooltip');
            if (tooltip) {
                tooltip.style.display = chatbotWindow.classList.contains('active') ? 'none' : 'block';
            }
        });
    }

    if (closeChatbot) {
        closeChatbot.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
            const tooltip = chatbotTrigger.querySelector('.chatbot-tooltip');
            if (tooltip) tooltip.style.display = 'block';
        });
    }

    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            addMessage(btn.innerText, 'user');

            setTimeout(() => {
                addMessage(responses[type] || responses.default, 'bot');
            }, 500);
        });
    });

    function handleSend() {
        const text = chatbotInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatbotInput.value = '';

            setTimeout(() => {
                const lowerText = text.toLowerCase();
                let foundResponse = false;

                for (const key in responses) {
                    if (lowerText.includes(key)) {
                        addMessage(responses[key], 'bot');
                        foundResponse = true;
                        break;
                    }
                }

                if (!foundResponse) {
                    addMessage(responses.default, 'bot');
                }
            }, 800);
        }
    }

    if (sendMsg) {
        sendMsg.addEventListener('click', handleSend);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});
