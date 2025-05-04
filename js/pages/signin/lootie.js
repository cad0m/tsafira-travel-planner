document.addEventListener('DOMContentLoaded', function() {
    // Load the Lottie animation
    const animation = lottie.loadAnimation({
      container: document.getElementById('lottie-container'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../../../assets/data/lootie.json'
    });
    
    // Add a slow wave effect to the animation speed
    let direction = 1;
    let speedFactor = 1;
    
    function waveSpeed() {
      if (speedFactor > 1.3) direction = -1;
      if (speedFactor < 0.7) direction = 1;
      
      speedFactor += (0.01 * direction);
      animation.setSpeed(speedFactor);
      
      setTimeout(waveSpeed, 150);
    }
    
    waveSpeed();
    
    // Adjust the animation container and SVG for better fitting
    animation.addEventListener('data_ready', function() {
      const container = document.getElementById('lottie-container');
      
      // Add dark overlay to the container to improve text contrast
      container.style.backgroundColor = 'rgba(26, 26, 46, 0.8)';
      
      // Set animation scaling and position
      const svgElement = container.querySelector('svg');
      if (svgElement) {
        // Center the SVG better in the flipped orientation
        svgElement.style.transformOrigin = 'center center';
        svgElement.style.opacity = '0.9';
        
        // Apply "deep water" feel to the animation
        svgElement.style.filter = 'saturate(1.2) contrast(1.1)';
        
        // Enhance animation with particle effects
        createParticles(container);
        
        // Darken paths that may be too bright
        const paths = svgElement.querySelectorAll('path');
        paths.forEach(path => {
          if (path.getAttribute('fill') && !path.getAttribute('fill').includes('rgba')) {
            path.style.filter = 'brightness(0.9)';
          }
        });
      }
      
      animation.resize();
    });
    
    // Add floating particles effect
    function createParticles(container) {
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 6 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.zIndex = '1';
        particle.style.opacity = '0';
        particle.style.animation = `floatParticle ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.parentNode.appendChild(particle);
      }
    }
    
    // Add subtle interaction effect on the content box
    const contentBox = document.querySelector('.auth-image-content');
    contentBox.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate the tilt based on mouse position
      const tiltX = (y / rect.height - 0.5) * 10;
      const tiltY = (x / rect.width - 0.5) * -10;
      
      // Apply subtle transform to create a 3D effect
      this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
    });
    
    contentBox.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
    
    // Resize animation on window resize
    window.addEventListener('resize', function() {
      animation.resize();
    });
  });