import { useEffect } from 'react';

const StarField = () => {
  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.getElementById('stars-container');
      if (!starsContainer) return;

      // Clear existing stars
      starsContainer.innerHTML = '';

      const count = 50;
      
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDuration = 5 + Math.random() * 15 + 's';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.opacity = (Math.random() * 0.7 + 0.1).toString();
        starsContainer.appendChild(star);
      }
    };

    createStars();

    // Cleanup on unmount
    return () => {
      const starsContainer = document.getElementById('stars-container');
      if (starsContainer) {
        starsContainer.innerHTML = '';
      }
    };
  }, []);

  return <div id="stars-container" className="fixed inset-0 pointer-events-none z-0" />;
};

export default StarField;