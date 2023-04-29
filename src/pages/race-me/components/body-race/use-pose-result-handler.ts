import { useCallback, useEffect, useState } from 'react';
import { NormalizedLandmark, Pose, POSE_CONNECTIONS, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import L from '@mediapipe/tasks-vision';
import SemaphoreGestures from '@/pages/race-me/components/body-race/semaphore-gestures';

type UsePoseResultHandlerProps = {
    videoElement: HTMLVideoElement | null;
    canvasElement: HTMLCanvasElement | null;
    landmarkContainer: HTMLDivElement | null;
    setCurrBodyRaceChar: (value: string) => void;
};

const VISIBILITY_THRESHOLD: number = 0.8;
const STRAIGHT_LIMB_MARGIN: number = 20;
const EXTENDED_LIMB_MARGIN: number = 0.8;

const usePoseResultHandler = ({ videoElement, canvasElement, landmarkContainer, setCurrBodyRaceChar }: UsePoseResultHandlerProps) => {
    const is_missing = useCallback(
        (part: NormalizedLandmark[]) => {
            return part.some((joint) => {
                if (joint === undefined) {
                    return false;
                }
                return joint!.visibility < VISIBILITY_THRESHOLD;
            });
        },
        [],
    );

    const dist = useCallback(
        (x1: number, y1: number, x2: number, y2: number): number => {
            const dx = x2 - x1;
            const dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        },
        [],
    );

    const is_limb_pointing = useCallback(
        (upper: NormalizedLandmark, mid: NormalizedLandmark, lower: NormalizedLandmark): boolean => {
            if (is_missing([upper, mid, lower])) {
                return false;
            }
            const limb_angle: number = get_angle(upper, mid, lower);
            const is_in_line: boolean = Math.abs(180 - limb_angle) < STRAIGHT_LIMB_MARGIN;

            if (is_in_line) {
                const upper_length = dist(upper.x, upper.y, mid.x, mid.y);
                const lower_length = dist(lower.x, lower.y, mid.x, mid.y);
                const is_extended = lower_length > EXTENDED_LIMB_MARGIN * upper_length;
                return is_extended;
            }

            return false;
        },
        [dist, is_missing],
    );


    const resultsHandler = useCallback(
        (results: Results, grid: LandmarkGrid, canvasContext: CanvasRenderingContext2D, semaphoreGestures: SemaphoreGestures) => {
            if (!results.poseLandmarks) {
                grid.updateLandmarks([]);
                return;
            }

            canvasContext.save();
            canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasContext.drawImage(
                results.segmentationMask,
                0,
                0,
                canvasElement.width,
                canvasElement.height
            );

            canvasContext.globalCompositeOperation = 'source-in';
            canvasContext.fillStyle = '#00FF00';
            canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);

            canvasContext.globalCompositeOperation = 'destination-atop';
            canvasContext.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            canvasContext.globalCompositeOperation = 'source-over';

            drawConnectors(canvasContext, results.poseLandmarks, POSE_CONNECTIONS, {
                color: '#00FF00',
                lineWidth: 4,
            });

            drawLandmarks(canvasContext, results.poseLandmarks, {
                color: '#FF0000',
                lineWidth: 2,
            });

            canvasContext.restore();

            grid.updateLandmarks(results.poseWorldLandmarks); // Include the pose check from Python code

            const [upperPointL, midPointL, lowerPointL] = [
                results.poseLandmarks[11],
                results.poseLandmarks[13],
                results.poseLandmarks[15],
            ];
            const [upperPointR, midPointR, lowerPointR] = [
                results.poseLandmarks[12],
                results.poseLandmarks[14],
                results.poseLandmarks[16],
            ];

            if (
                is_limb_pointing(upperPointL, midPointL, lowerPointL) ||
                is_limb_pointing(upperPointR, midPointR, lowerPointR)
            ) {
                const shoulderL = results.poseLandmarks[11];
                const elbowL = results.poseLandmarks[13];
                const wristL = results.poseLandmarks[15];
                const armL = [shoulderL, elbowL, wristL];

                const shoulderR = results.poseLandmarks[12];
                const elbowR = results.poseLandmarks[14];
                const wristR = results.poseLandmarks[16];
                const armR = [shoulderR, elbowR, wristR]; // const armL_angle = semaphoreGestures.calculateAngles(armL); // const armR_angle = semaphoreGestures.calculateAngles(armR);

                const armLAngle = semaphoreGestures.getLimbDirection(armL);
                const armRAngle = semaphoreGestures.getLimbDirection(armR);

                const currentSemaphore = semaphoreGestures.typeSemaphore(armLAngle, armRAngle);
                if (currentSemaphore) {
                    const currentKey = currentSemaphore['a'];
                    if (currentKey !== semaphoreGestures.lastSemaphore) {
                        semaphoreGestures.output(currentKey === 'space' ? ' ' : currentKey);
                    }
                }
            } else {
                if (semaphoreGestures.lastSemaphore !== '') {
                    semaphoreGestures.output('');
                }
            }
        },
        [canvasElement],
    );

    useEffect(
        () => {
            if (!videoElement || !canvasElement || !landmarkContainer || !window.LandmarkGrid) {
                return;
            }

            const canvasContext = canvasElement.getContext('2d');
            // @ts-ignore
            const grid = new LandmarkGrid(landmarkContainer);
            const semaphoreGestures = new SemaphoreGestures(setCurrBodyRaceChar);

            const pose = new Pose();

            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: true,
                smoothSegmentation: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            pose.onResults((results: Results) => resultsHandler(results, grid, canvasContext as CanvasRenderingContext2D, semaphoreGestures));

            const camera = new Camera(videoElement, {
                onFrame: async () => {
                    await pose.send({ image: videoElement });
                },
                width: 640,
                height: 480,
            });

            camera.start();
            const resizeCanvas = () => {
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
            };

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            return () => {
                window.removeEventListener('resize', resizeCanvas);
                camera.stop();
            };
        },
        [videoElement, canvasElement, landmarkContainer, setCurrBodyRaceChar, resultsHandler, window.LandmarkGrid],
    );

    console.log(window.LandmarkGrid);

    return {};
};

export default usePoseResultHandler;
