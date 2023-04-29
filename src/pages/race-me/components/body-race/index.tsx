import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import usePoseResultHandler from '@/pages/race-me/components/body-race/use-pose-result-handler';

type BodyRaceProps = {
    setCurrBodyRaceChar: (value: string | null) => void;
};

const BodyRace: FunctionComponent<BodyRaceProps> = ({ setCurrBodyRaceChar }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const landmarkContainerRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState(false);

    usePoseResultHandler({
        videoElement: videoRef.current,
        canvasElement: canvasRef.current,
        landmarkContainer: landmarkContainerRef.current,
        setCurrBodyRaceChar,
    });

    return (
        <div className="container">
            {isLoading && <div>Loading camera...</div>}
            <video
                className="input_video"
                playsInline
                ref={videoRef}
                onLoadStart={() => setIsLoading(true)}
                onLoadedData={() => setIsLoading(false)}
                style={{ transform: `rotateY(180deg)` }}
            ></video>
            <canvas
                className="output_canvas"
                width="1280px"
                height="720px"
                style={{ display: 'none' }}
                ref={canvasRef}
            ></canvas>
            <div
                className="landmark-grid-container"
                ref={landmarkContainerRef}
                style={{ display: 'none' }}
            ></div>
        </div>
    );
};

export default BodyRace;
