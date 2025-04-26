document.addEventListener('DOMContentLoaded', () => {
    // Add Windows 98 startup sound
    const startupSound = new Audio('sounds/windows98.mp3');
    let soundPlayed = false;

    // Function to play sound on first interaction
    function playStartupSound() {
        if (!soundPlayed) {
            startupSound.play().catch(error => {
                console.log('Audio playback failed:', error);
            });
            soundPlayed = true;
            // Remove the event listeners after first play
            document.removeEventListener('click', playStartupSound);
            document.removeEventListener('keydown', playStartupSound);
        }
    }

    // Add event listeners for first interaction
    document.addEventListener('click', playStartupSound);
    document.addEventListener('keydown', playStartupSound);

    // Terminal-like typing effect for all elements with class 'typing'
    const typingElements = document.querySelectorAll('.typing');
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
                element.classList.add('typing-complete');
            }
        }, 100);
    });

    // Terminal cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
    });

    // Terminal-like hover effects
    const terminalElements = document.querySelectorAll('.terminal-box, .quest-item, .contact-item');
    terminalElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.boxShadow = '0 0 10px var(--glow-color)';
            element.style.transform = 'translateY(-2px)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = 'none';
            element.style.transform = 'translateY(0)';
        });
    });

    // Terminal-like scroll animations
    const sections = document.querySelectorAll('.content-section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add terminal-like typing effect to content
                const terminalTexts = entry.target.querySelectorAll('.terminal-text');
                terminalTexts.forEach(text => {
                    const content = text.textContent;
                    text.textContent = '';
                    let i = 0;
                    const typing = setInterval(() => {
                        if (i < content.length) {
                            text.textContent += content.charAt(i);
                            i++;
                        } else {
                            clearInterval(typing);
                        }
                    }, 50);
                });
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        sectionObserver.observe(section);
    });

    // Add terminal-like loading effect to stat bars
    const statBars = document.querySelectorAll('.stat-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    }, {
        threshold: 0.5
    });

    statBars.forEach(bar => observer.observe(bar));

    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-links');

    mobileMenuButton.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside or on a navigation item
    document.addEventListener('click', (e) => {
        // Don't close if clicking the menu button
        if (e.target === mobileMenuButton || e.target.closest('.mobile-menu-button')) {
            return;
        }
        
        // Close if clicking outside or on a navigation item
        if ((!e.target.closest('nav') || e.target.closest('a') || e.target.closest('button')) && 
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });

    // Button click effects
    const buttons = document.querySelectorAll('.button-98:not(.window-controls button)');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.borderColor = 'var(--win98-darker) var(--win98-lighter) var(--win98-lighter) var(--win98-darker)';
            button.style.transform = 'translate(1px, 1px)';
        });

        button.addEventListener('mouseup', () => {
            button.style.borderColor = 'var(--win98-lighter) var(--win98-darker) var(--win98-darker) var(--win98-lighter)';
            button.style.transform = 'translate(0, 0)';
        });
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const headerOffset = 100; // Adjust this value to change how much of the section is shown at the top
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Stat bars animation
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statBars = entry.target.querySelectorAll('.stat-fill');
                statBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }
        });
    }, {
        threshold: 0.5
    });

    const characterSection = document.querySelector('.profile-section');
    if (characterSection) {
        statObserver.observe(characterSection);
    }

    // Add hover effect to item cards
    const itemCards = document.querySelectorAll('.item-card');
    itemCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.backgroundColor = 'var(--win98-light)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.backgroundColor = 'var(--win98-bg)';
        });
    });

    
    // Load latest news
    const latestNewsContainer = document.getElementById('latest-news');
    const latestNews = newsData.news[0];
    latestNewsContainer.innerHTML = `
        <h3>${latestNews.title}</h3>
        <p><em>${latestNews.date}</em></p>
        ${latestNews.showLatestImage && latestNews.image ? `<img src="${latestNews.image}" alt="${latestNews.title}">` : ''}
        <div class="news-description">${latestNews.description}</div>
        ${latestNews.url ? `<div class="news-link"><a href="${latestNews.url}" target="_blank" style="font-weight: bold;">More...</a></div>` : ''}
    `;

    // Show all news in popup
    const allNewsContainer = document.getElementById('all-news');
    allNewsContainer.innerHTML = newsData.news.map(news => `
        <div class="news-item">
            <h3>${news.title}</h3>
            <div class="news-date">${news.date}</div>
            ${news.showImage && news.image ? `<img src="${news.image}" alt="${news.title}">` : ''}
            <div class="news-description">${news.description}</div>
            ${news.url ? `<div class="news-link"><a href="${news.url}" target="_blank">More...</a></div>` : ''}
        </div>
    `).join('');

    // Open/Close popup
    const newsPopup = document.getElementById('news-popup');
    const openNewsBtn = document.getElementById('more-news-btn');
    const closeNewsBtn = document.getElementById('close-news');

    openNewsBtn.addEventListener('click', () => {
        newsPopup.style.display = 'block';
    });

    closeNewsBtn.addEventListener('click', () => {
        newsPopup.style.display = 'none';
    });

    // Handle CV and Resume PDF opening
    const cvButton = document.querySelector('a[href="./data/cv.pdf"]');
    const resumeButton = document.querySelector('a[href="./data/resume.pdf"]');

    if (cvButton) {
        cvButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('./data/cv.pdf', '_blank');
        });
    }

    if (resumeButton) {
        resumeButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('./data/resume.pdf', '_blank');
        });
    }
}); 