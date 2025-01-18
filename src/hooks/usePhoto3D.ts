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
    if (imagesState.current !== imagesState.target) {
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
    const {transform} = imageTransforms[imagesState.target];
    const xy = rotate(transform.rotate, [transform.left, transform.top]);

    if (!imagesState.isSearch) {
      ref.style.transform = `translate3d(${-xy[0]}px, ${-xy[1]}px, ${-maxZoom}px) rotate(${-transform.rotate}deg)`;
    } else {
      ref.style.transform = `translate3d(${-xy[0]}px, ${-xy[1]}px, ${-transform.z}px) rotate(${-transform.rotate}deg)`;
      setImagesState({
        ...imagesState,
        current: imagesState.target,
        isSearch: false,
      });
    }

    if (!imagesState.isSearch) {
      setTimeout(() => {
        setImagesState({
          ...imagesState,
          isSearch: true,
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

    // Add event listener for keydown event
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imagePaths, imageTransforms, imagesState]);

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
