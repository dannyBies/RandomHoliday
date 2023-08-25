"use client";
import React, { useState, useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Image, { ImageProps } from "next/image";

const IMAGE_CHANGE_INTERVAL = 10000;

type BackgroundSliderProps = {
  children: React.ReactNode;
  images: React.ReactElement<ImageProps, typeof Image>[];
};

export function BackgroundSlider({ children, images }: BackgroundSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, IMAGE_CHANGE_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, [images]);

  return (
    <div className="relative h-screen w-screen">
      <TransitionGroup>
        <CSSTransition key={currentImageIndex} timeout={10000} classNames="fade">
          <div className="absolute top-0 left-0 z-[-1] h-full w-full">{images[currentImageIndex]}</div>
        </CSSTransition>
      </TransitionGroup>
      {children}
    </div>
  );
}
