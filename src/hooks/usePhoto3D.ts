import {useEffect, useRef, useState} from 'react';

const rotate = (angle: number, point: [number, number]) => {
  const rad = (Math.PI / 180) * angle;
  const x = point[0] * Math.cos(rad) + point[1] * Math.sin(rad);
  const y = (-point[0]) * Math.sin(rad) + point[1] * Math.cos(rad);
  return [x, y];
};
const maxZoom = 4000;

const usePhoto3D = (imagePaths: any[]) => {
  const [imageTransforms, setImageTransforms] = useState<any>([]);
  const mainDivRef = useRef<HTMLDivElement>(null);
  const [imagesState, setImagesState] = useState({
    current: 0,
    target: 0,
    isSearch: false,
    isMid: false,
  });
  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    accumulatedX: 0,
    accumulatedY: 0,
  });

  useEffect(() => {
    const transforms = imagePaths.map((details, index) => {
      const transform = index === 0 ? {
        top: 0,
        left: 0,
        rotate: 0,
        z: 0,
      } : randomTransform();
      return {
        ...details,
        transform,
      }
    });
    setImageTransforms(transforms);
  }, [imagePaths]);

  useEffect(() => {
    if (imagesState.current !== imagesState.target || imagesState.isMid) {
      animatePage();
    }
  }, [imagesState]);


  const randomTransform = () => {
    const randomTop = Math.round(Math.random() * window.innerWidth * 2) - window.innerWidth;
    const randomLeft = Math.round(Math.random() * window.innerHeight * 2) - window.innerHeight;
    const randomRotate = Math.round(Math.random() * 90) + 10;
    const randomTranslateZ = Math.round(Math.random() * maxZoom / 2) - maxZoom / 4;

    return {
      top: randomTop,
      left: randomLeft,
      rotate: randomRotate,
      z: randomTranslateZ,
    };
  };

  function animatePage() {
    const ref = mainDivRef.current;
    if (!ref) return;
    const {transform} = imageTransforms[imagesState.isSearch ? imagesState.current : imagesState.target];
    const xy = rotate(transform.rotate, [transform.left, transform.top]);

    // Apply accumulated drag offset only in search mode (like legacy code)
    const dragOffsetX = imagesState.isSearch ? dragState.accumulatedX : 0;
    const dragOffsetY = imagesState.isSearch ? dragState.accumulatedY : 0;

    if (!imagesState.isMid) {
      ref.style.transform = `translate3d(${-xy[0] + dragOffsetX}px, ${-xy[1] + dragOffsetY}px, ${-maxZoom}px) rotate(${-transform.rotate}deg)`;
    } else {
      ref.style.transform = `translate3d(${-xy[0] + dragOffsetX}px, ${-xy[1] + dragOffsetY}px, ${-transform.z}px) rotate(${-transform.rotate}deg)`;
      setImagesState({
        ...imagesState,
        current: imagesState.target,
        isMid: false,
      });
    }

    if (!imagesState.isMid && !imagesState.isSearch) {
      setTimeout(() => {
        setImagesState({
          ...imagesState,
          isMid: true,
        });
      }, 1000);
    }
  }

  const next = () => {
    const next = (imagesState.current + 1) % imagePaths.length;
    setImagesState({
      ...imagesState,
      target: next,
    });
  };

  const previous = () => {
    const prev = (imagesState.current - 1 + imagePaths.length) % imagePaths.length
    setImagesState({
      ...imagesState,
      target: prev,
    });
  };

  const search = () => {
    setImagesState({
      ...imagesState,
      target: -1,
      isSearch: true,
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        next(); // Call next on right arrow press
      } else if (event.key === 'ArrowLeft') {
        previous(); // Call previous on left arrow press
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault(); // Prevent default scroll behavior
      if (event.deltaY < 0) {
        next(); // Scroll up triggers next (same as arrow right)
      } else if (event.deltaY > 0) {
        previous(); // Scroll down triggers previous (same as arrow left)
      }
    };

    // Drag handlers for search mode - work like legacy code
    const handleMouseDown = (event: MouseEvent) => {
      if (!imagesState.isSearch) return;
      // Only handle drag if clicking on the main-photodiv or its children
      if (mainDivRef.current && mainDivRef.current.contains(event.target as Node)) {
        event.preventDefault();
        // Disable transitions during drag (like legacy code)
        if (mainDivRef.current) {
          mainDivRef.current.style.transition = '0s';
        }
        setDragState({
          isDragging: true,
          startX: event.clientX,
          startY: event.clientY,
          currentX: event.clientX,
          currentY: event.clientY,
          accumulatedX: dragState.accumulatedX,
          accumulatedY: dragState.accumulatedY,
        });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragState.isDragging || !imagesState.isSearch) return;
      event.preventDefault();
      
      // Calculate movement delta and accumulate it (like legacy code)
      const deltaX = event.clientX - dragState.currentX;
      const deltaY = event.clientY - dragState.currentY;
      
      setDragState(prev => ({
        ...prev,
        currentX: event.clientX,
        currentY: event.clientY,
        accumulatedX: prev.accumulatedX + deltaX,
        accumulatedY: prev.accumulatedY + deltaY,
      }));
      
      // Apply transform immediately (like legacy code)
      const ref = mainDivRef.current;
      if (ref && imagesState.isSearch) {
        const {transform} = imageTransforms[imagesState.current];
        const xy = rotate(transform.rotate, [transform.left, transform.top]);
        const newAccumulatedX = dragState.accumulatedX + deltaX;
        const newAccumulatedY = dragState.accumulatedY + deltaY;
        ref.style.transform = `translate3d(${-xy[0] + newAccumulatedX}px, ${-xy[1] + newAccumulatedY}px, ${-maxZoom}px) rotate(${-transform.rotate}deg)`;
      }
    };

    const handleMouseUp = () => {
      if (!dragState.isDragging) return;
      // Re-enable transitions after drag (like legacy code)
      if (mainDivRef.current) {
        mainDivRef.current.style.transition = '1s';
      }
      setDragState(prev => ({
        ...prev,
        isDragging: false,
      }));
    };

    // Touch handlers for mobile devices - work like legacy code
    const handleTouchStart = (event: TouchEvent) => {
      if (!imagesState.isSearch) return;
      // Only handle drag if touching the main-photodiv or its children
      if (mainDivRef.current && mainDivRef.current.contains(event.target as Node)) {
        event.preventDefault();
        const touch = event.touches[0];
        // Disable transitions during drag (like legacy code)
        if (mainDivRef.current) {
          mainDivRef.current.style.transition = '0s';
        }
        setDragState({
          isDragging: true,
          startX: touch.clientX,
          startY: touch.clientY,
          currentX: touch.clientX,
          currentY: touch.clientY,
          accumulatedX: dragState.accumulatedX,
          accumulatedY: dragState.accumulatedY,
        });
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!dragState.isDragging || !imagesState.isSearch) return;
      event.preventDefault();
      const touch = event.touches[0];
      
      // Calculate movement delta and accumulate it (like legacy code)
      const deltaX = touch.clientX - dragState.currentX;
      const deltaY = touch.clientY - dragState.currentY;
      
      setDragState(prev => ({
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
        accumulatedX: prev.accumulatedX + deltaX,
        accumulatedY: prev.accumulatedY + deltaY,
      }));
      
      // Apply transform immediately (like legacy code)
      const ref = mainDivRef.current;
      if (ref && imagesState.isSearch) {
        const {transform} = imageTransforms[imagesState.current];
        const xy = rotate(transform.rotate, [transform.left, transform.top]);
        const newAccumulatedX = dragState.accumulatedX + deltaX;
        const newAccumulatedY = dragState.accumulatedY + deltaY;
        ref.style.transform = `translate3d(${-xy[0] + newAccumulatedX}px, ${-xy[1] + newAccumulatedY}px, ${-maxZoom}px) rotate(${-transform.rotate}deg)`;
      }
    };

    const handleTouchEnd = () => {
      if (!dragState.isDragging) return;
      // Re-enable transitions after drag (like legacy code)
      if (mainDivRef.current) {
        mainDivRef.current.style.transition = '1s';
      }
      setDragState(prev => ({
        ...prev,
        isDragging: false,
      }));
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [imagePaths, imageTransforms, imagesState, dragState]);

  return {
    next,
    previous,
    search,
    imagesState,
    imageTransforms,
    mainDivRef,
    setImagesState,
  };
};

export default usePhoto3D;
