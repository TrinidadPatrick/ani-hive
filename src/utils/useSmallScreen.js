import React, { useState, useEffect } from 'react'

const useSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

   useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");

    const update = () => setIsSmallScreen(media.matches);
    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isSmallScreen
}

export default useSmallScreen