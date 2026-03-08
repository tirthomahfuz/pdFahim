'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger, a core plugin for GSAP
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollImageSequenceProps {
    frameFolder: string;
    framePrefix?: string;
    frameExtension?: string;
    frameCount: number;
    canvasClassName?: string;
}

export function ScrollImageSequence({
    frameFolder = '/frames/pdf-sequence',
    framePrefix = 'ezgif-frame-',
    frameExtension = '.jpg',
    frameCount = 240,
    canvasClassName = '',
}: ScrollImageSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedFrames, setLoadedFrames] = useState(0);
    const [isFullyLoaded, setIsFullyLoaded] = useState(false);

    // GSAP animation state for frame index
    const playheadRef = useRef({ frame: 0 });

    // 1. Preload all images
    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = [];

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            // Format number to 3 digits (e.g., 001, 045, 240)
            const formattedNumber = i.toString().padStart(3, '0');
            const src = `${frameFolder}/${framePrefix}${formattedNumber}${frameExtension}`;

            img.src = src;
            img.onload = () => {
                loadedCount++;
                setLoadedFrames(loadedCount);
                if (loadedCount === frameCount) {
                    setIsFullyLoaded(true);
                }
            };

            loadedImages.push(img);
        }
        setImages(loadedImages);

        // Cleanup when unmounting
        return () => {
            loadedImages.forEach((img) => {
                img.onload = null;
                img.src = '';
            });
        };
    }, [frameCount, frameFolder, framePrefix, frameExtension]);

    // 2. Draw frame function
    const renderFrame = useCallback(
        (index: number) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx || images.length === 0 || !images[index]) return;

            const img = images[index];

            // Standardize canvas dimensions logic
            const targetWidth = window.innerWidth;
            const targetHeight = window.innerHeight;

            // Update canvas width/height to match window exactly for crisp rendering
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const imgRatio = img.width / img.height;
            const canvasRatio = targetWidth / targetHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            // "Cover" behavior for canvas drawing
            if (canvasRatio > imgRatio) {
                // Canvas is wider than image (scale image by width)
                drawWidth = targetWidth;
                drawHeight = targetWidth / imgRatio;
                offsetX = 0;
                offsetY = (targetHeight - drawHeight) / 2; // Center vertically
            } else {
                // Canvas is taller than image (scale image by height)
                drawHeight = targetHeight;
                drawWidth = targetHeight * imgRatio;
                offsetX = (targetWidth - drawWidth) / 2; // Center horizontally
                offsetY = 0;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        },
        [images]
    );

    // 3. Render initial frame when first loaded or resized
    useEffect(() => {
        if (isFullyLoaded) {
            renderFrame(playheadRef.current.frame);
        }

        const handleResize = () => {
            if (isFullyLoaded) renderFrame(playheadRef.current.frame);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isFullyLoaded, renderFrame]);

    // 4. GSAP ScrollTrigger Sequence
    useGSAP(
        () => {
            // Don't setup ScrollTrigger until fully loaded to avoid incorrect positioning
            if (!isFullyLoaded || !containerRef.current || !canvasRef.current) return;

            const trigger = ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: '+=250%', // 250vh scroll duration
                pin: true,     // Pin the entire container
                scrub: 0.1,    // Smooth scrubbing
                animation: gsap.to(playheadRef.current, {
                    frame: frameCount - 1, // go to the last frame index
                    snap: 'frame', // lock to whole numbers
                    ease: 'none',
                    onUpdate: () => {
                        renderFrame(playheadRef.current.frame);
                    },
                }),
            });

            return () => {
                trigger.kill();
            };
        },
        { dependencies: [isFullyLoaded, frameCount, renderFrame], scope: containerRef }
    );

    return (
        <div ref={containerRef} className="relative w-full h-[100vh] overflow-hidden bg-zinc-950">
            {/* Loading state */}
            {!isFullyLoaded && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white">
                    <div className="mb-4 text-sm font-medium tracking-wide flex items-center gap-2">
                        <span className="animate-pulse size-2 bg-primary rounded-full block"></span>
                        Loading High-Res Visuals
                    </div>
                    <div className="w-48 h-1 overflow-hidden bg-zinc-800 rounded-full">
                        <div
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${(loadedFrames / frameCount) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Canvas container - strictly fills viewport */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-screen transition-opacity duration-1000 ${isFullyLoaded ? 'opacity-90' : 'opacity-0'} ${canvasClassName}`}
            />

            {/* Dynamic gradient overlay to ensure text readability */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/90 pointer-events-none" />
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.8)_100%)] pointer-events-none" />
        </div>
    );
}
