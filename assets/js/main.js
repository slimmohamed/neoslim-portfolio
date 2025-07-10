// Main JavaScript for Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const checkbox = document.getElementById('checkbox');
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('block');
        mobileMenu.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            checkbox.checked = false;
            document.body.classList.remove('overflow-hidden');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    document.getElementById('hero-btn').addEventListener('click', function() {
        this.classList.toggle('active');
        document.getElementById('works-section').classList.toggle('opened');
    });
    // Works Section Animation
    const heroBtn = document.getElementById('hero-btn');
const worksSection = document.getElementById('works-section');

heroBtn.addEventListener('click', function() {
  // Toggle active state
  this.classList.toggle('active');
  
  // Toggle works section
  worksSection.classList.toggle('opened');
  
  // Optional: Close other open sections
  document.querySelectorAll('.section.opened').forEach(section => {
    if(section !== worksSection) {
      section.classList.remove('opened');
    }
  });
  
  // Optional: Smooth scroll to works section when opening
  if(worksSection.classList.contains('opened')) {
    setTimeout(() => {
      worksSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }
});
    
    function animatePanelClick(panel, targetUrl) {
        gsap.to(panel, {
          scale: 0.95,
          duration: 0.2,
          repeat: 1,
          repeatDelay: 0,
          yoyoEase: true,
          ease: "power1.inOut",
          onComplete: function() {
            // Page transition
            gsap.to("body", {
              opacity: 0,
              duration: 0.5,
              onComplete: function() {
                window.location.href = targetUrl;
              }
            });
          }
        });
    }
    
    // Portfolio Content Toggle Functions
    function hidePortfolioContent(type) {
        const section = document.getElementById(`${type}-portfolio-content`);
        section.classList.add('hidden');
        
        // Show the works section again
        worksSection.classList.remove('hidden');
        document.body.classList.remove('overflow-hidden');
    }
    
    function hideAllCollapsibleSections() {
        document.querySelectorAll('.collapsible-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.body.classList.remove('overflow-hidden');
    }
    
    // Initialize GSAP animations
    function initAnimations() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero section animations
        gsap.from('.gsap-fade-in-up', {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('.gsap-zoom-in', {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'back.out(1.7)'
        });
        
        gsap.from('.gsap-line', {
            scaleX: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        // About section animations
        gsap.from('.gsap-fade-in-left', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%'
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        // Article section animations
        gsap.from('.gsap-zoom-in-up', {
            scrollTrigger: {
                trigger: '#article-section',
                start: 'top 80%'
            },
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });
        
        // Skills section animations
        gsap.from('.chart-container', {
            scrollTrigger: {
                trigger: '#skills',
                start: 'top 80%'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        // Contact section animations
        gsap.from('#contact-section form', {
            scrollTrigger: {
                trigger: '#contact-section',
                start: 'top 80%'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out'
        });
    }
      Chart.register({
        id: 'barStrokeEffect',
        beforeDatasetDraw(chart) {
          const ctx = chart.ctx;
          const meta = chart.getDatasetMeta(0);
          ctx.save();
          meta.data.forEach((bar) => {
            const props = bar.getProps(['x', 'y', 'base'], true);
            const progress = Math.min(1, chart._animations?.['0']?.current || 1);
            const height = props.base - props.y;
            ctx.beginPath();
            ctx.strokeStyle = bar.options.borderColor || '#5EA08C';
            ctx.lineWidth = bar.height;
            ctx.setLineDash([height * progress, height]);
            ctx.moveTo(props.x, props.base);
            ctx.lineTo(props.x, props.y);
            ctx.stroke();
          });
          ctx.restore();
          return false; // skip default rendering
        }
      });

    // Canvas Background Animation
    function initCanvasBackground() {
        const canvas = document.getElementById('background-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Particle system for background
        const particles = [];
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        // Particle factory function
        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                color: `rgba(94, 160, 140, ${Math.random() * 0.5 + 0.1})`
            };
        }
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (const p of particles) {
                // Update position
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Wrap around edges
                if (p.x > canvas.width) p.x = 0;
                if (p.x < 0) p.x = canvas.width;
                if (p.y > canvas.height) p.y = 0;
                if (p.y < 0) p.y = canvas.height;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }
            
            requestAnimationFrame(animate);
        }

        // Handle resize
        function handleResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', handleResize);
        animate();
    }
    
    // Form submission handler
    function handleFormSubmit() {
        const contactForm = document.querySelector('#contact-section form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', { name, email, message });
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Initialize everything
    function init() {
        initAnimations();
        initCanvasBackground();
        handleFormSubmit();
        
        // Set up scroll event for works section
        window.addEventListener('scroll', toggleWorksSection);
        toggleWorksSection(); // Run once on load
        
        // Portfolio panel click handlers
        document.getElementById('design-panel').addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
              e.preventDefault();
              animatePanelClick(this, '/design-projects.html');
            }
          });
          
          // Coding panel click
          document.getElementById('programming-panel').addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
              e.preventDefault();
              animatePanelClick(this, '/coding-projects.html');
            }
          });
        
        // Back buttons in portfolio sections
        document.querySelectorAll('[onclick^="hidePortfolioContent"]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const type = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                hidePortfolioContent(type);
            });
        });
        
        // Home buttons in portfolio sections
        document.querySelectorAll('[onclick="hideAllCollapsibleSections()"]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                hideAllCollapsibleSections();
            });
        });
    }
    // Start the application when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
});