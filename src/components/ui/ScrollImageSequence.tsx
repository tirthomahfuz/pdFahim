'use client';

import React, { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

type NetworkProfile = 'desktop' | 'mobile' | 'constrained';

function getNetworkProfile(): NetworkProfile {
    if (typeof window === 'undefined') return 'desktop';

    const connection = (navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const narrow = window.matchMedia('(max-width: 768px)').matches;
    const saveData = Boolean(connection?.saveData);
    const slowNetwork = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';

    if (saveData || slowNetwork) return 'constrained';
    return narrow ? 'mobile' : 'desktop';
}

function subscribeNetworkProfile(onChange: () => void) {
    if (typeof window === 'undefined') return () => undefined;
    const media = window.matchMedia('(max-width: 768px)');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
}

function useNetworkProfile() {
    return useSyncExternalStore(subscribeNetworkProfile, getNetworkProfile, () => 'desktop' as NetworkProfile);
}

interface ScrollImageSequenceProps {
    frameFolder: string;
    framePrefix?: string;
    frameExtension?: string;
    frameCount: number;
    /** Load every Nth source frame to cut bandwidth (default 2 → ~half the assets). */
    frameStep?: number;
    canvasClassName?: string;
    /** Optional outer scroll section used for scrubbing (avoids nested GSAP pin). */
    scrollTriggerRef?: React.RefObject<HTMLElement | null>;
    /** When true, show a single static frame and skip scroll scrubbing. */
    reducedMotion?: boolean;
}

export function ScrollImageSequence({
    frameFolder = '/frames/pdf-sequence',
    framePrefix = 'ezgif-frame-',
    frameExtension = '.jpg',
    frameCount = 240,
    frameStep = 2,
    canvasClassName = '',
    scrollTriggerRef,
    reducedMotion = false,
}: ScrollImageSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasSizeRef = useRef({ width: 0, height: 0 });
    const [images, setImages] = useState<(HTMLImageElement | null)[]>([]);
    const [loadedFrames, setLoadedFrames] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const playheadRef = useRef({ frame: 0 });
    const networkProfile = useNetworkProfile();

    const frameIndexes = React.useMemo(() => {
        if (reducedMotion) {
            return [1];
        }

        const step =
            networkProfile === 'constrained'
                ? Math.max(frameStep, 6)
                : networkProfile === 'mobile'
                    ? Math.max(frameStep, 3)
                    : Math.max(1, frameStep);

        const indexes: number[] = [];
        for (let i = 1; i <= frameCount; i += step) {
            indexes.push(i);
        }
        if (indexes[indexes.length - 1] !== frameCount) {
            indexes.push(frameCount);
        }
        return indexes;
    }, [frameCount, frameStep, networkProfile, reducedMotion]);

    useEffect(() => {
        let settled = 0;
        let hasDrawable = false;
        let cancelled = false;
        const loadedImages: (HTMLImageElement | null)[] = new Array(frameIndexes.length).fill(null);

        const markSettled = (success: boolean) => {
            settled += 1;
            if (success) hasDrawable = true;
            if (cancelled) return;
            setLoadedFrames(settled);
            if (hasDrawable || settled === frameIndexes.length) {
                setIsReady(true);
            }
        };

        frameIndexes.forEach((frameNumber, index) => {
            const img = new Image();
            const formattedNumber = frameNumber.toString().padStart(3, '0');
            img.src = `${frameFolder}/${framePrefix}${formattedNumber}${frameExtension}`;
            img.onload = () => {
                loadedImages[index] = img;
                if (!cancelled) {
                    setImages([...loadedImages]);
                }
                markSettled(true);
            };
            img.onerror = () => {
                loadedImages[index] = null;
                markSettled(false);
            };
        });

        return () => {
            cancelled = true;
            loadedImages.forEach((img) => {
                if (!img) return;
                img.onload = null;
                img.onerror = null;
                img.src = '';
            });
        };
    }, [frameIndexes, frameFolder, framePrefix, frameExtension]);

    const getDrawableFrame = useCallback(
        (index: number): HTMLImageElement | null => {
            if (images.length === 0) return null;
            const clamped = Math.max(0, Math.min(images.length - 1, Math.round(index)));
            if (images[clamped]) return images[clamped];

            for (let distance = 1; distance < images.length; distance++) {
                const before = clamped - distance;
                const after = clamped + distance;
                if (before >= 0 && images[before]) return images[before];
                if (after < images.length && images[after]) return images[after];
            }
            return null;
        },
        [images]
    );

    const renderFrame = useCallback(
        (index: number, forceResize = false) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            const img = getDrawableFrame(index);
            if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

            const targetWidth = window.innerWidth;
            const targetHeight = window.innerHeight;

            if (
                forceResize ||
                canvasSizeRef.current.width !== targetWidth ||
                canvasSizeRef.current.height !== targetHeight
            ) {
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                canvasSizeRef.current = { width: targetWidth, height: targetHeight };
            }

            const imgRatio = img.width / img.height;
            const canvasRatio = targetWidth / targetHeight;

            let drawWidth: number;
            let drawHeight: number;
            let offsetX: number;
            let offsetY: number;

            if (canvasRatio > imgRatio) {
                drawWidth = targetWidth;
                drawHeight = targetWidth / imgRatio;
                offsetX = 0;
                offsetY = (targetHeight - drawHeight) / 2;
            } else {
                drawHeight = targetHeight;
                drawWidth = targetHeight * imgRatio;
                offsetX = (targetWidth - drawWidth) / 2;
                offsetY = 0;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        },
        [getDrawableFrame]
    );

    useEffect(() => {
        if (!isReady) return;

        renderFrame(playheadRef.current.frame, true);

        const handleResize = () => {
            renderFrame(playheadRef.current.frame, true);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isReady, renderFrame]);

    useGSAP(
        () => {
            if (!isReady || !containerRef.current || reducedMotion) return;

            const triggerEl = scrollTriggerRef?.current ?? containerRef.current.parentElement;
            if (!triggerEl) return;

            const animation = gsap.to(playheadRef.current, {
                frame: Math.max(0, images.length - 1),
                snap: 'frame',
                ease: 'none',
                onUpdate: () => {
                    renderFrame(playheadRef.current.frame);
                },
            });

            const trigger = ScrollTrigger.create({
                trigger: triggerEl,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.15,
                animation,
            });

            return () => {
                trigger.kill();
                animation.kill();
            };
        },
        { dependencies: [isReady, images.length, renderFrame, scrollTriggerRef, reducedMotion], scope: containerRef }
    );

    const progress = frameIndexes.length
        ? Math.min(100, Math.round((loadedFrames / frameIndexes.length) * 100))
        : 0;

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-zinc-950"
            aria-hidden="true"
        >
            {!isReady && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white">
                    <div className="mb-4 text-sm font-medium tracking-wide flex items-center gap-2">
                        <span className="animate-pulse size-2 bg-primary rounded-full block" />
                        Loading visuals
                    </div>
                    <div className="w-48 h-1 overflow-hidden bg-zinc-800 rounded-full">
                        <div
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full object-cover z-0 mix-blend-screen transition-opacity duration-700 ${isReady ? 'opacity-90' : 'opacity-0'} ${canvasClassName}`}
            />

            <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/90 pointer-events-none" />
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.8)_100%)] pointer-events-none" />
        </div>
    );
}
