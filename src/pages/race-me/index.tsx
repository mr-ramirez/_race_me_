import { useTheme, ThemeProvider } from 'next-themes';
import Head from 'next/head';
import { MountainIcon, VolcanoIcon } from '@/assets/images';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ToggleButton from '@/components/ToggleButton';
import { NextRouter, useRouter } from 'next/router';
import Metrics from '@/pages/race-me/components/metrics';
import BodyRace from '@/pages/race-me/components/body-race';
import { useIsSm } from '@/pages/race-me/hooks/use-media-query';
import StartButton from '@/pages/race-me/components/body-race/start-button';
import useBodyKeyPress from '@/pages/race-me/hooks/use-body-key-press';
import useKeyPress from '@/pages/race-me/hooks/use-key-press';
import Script from 'next/script';

const HomeBody = () => {
    const isSm = useIsSm();

    const [isBodyRace, setIsBodyRace] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [wpm, setWpm] = useState<number>(0);
    const [seconds, setTime] = useState<number>(30);
    const [currBodyRaceChar, setCurrBodyRaceChar] = useState<string | undefined>(undefined);

    const [leftPadding, setLeftPadding] = useState(new Array(isSm ? 25 : 30).fill(' ').join('')); // initial 50 spaces to keep current char at center
    const [outgoingChars, setOutgoingChars] = useState<string>(''); // characters just typed
    const [incorrectChar, setIncorrectChar] = useState<boolean>(false);
    const [corpus, setCorpus] = useState<string>('');
    const [currentChar, setCurrentChar] = useState<string>(corpus.charAt(0));
    const [incomingChars, setIncomingChars] = useState(corpus.substr(1)); // next chars to type
    const [startTime, setStartTime] = useState<number>(0);
    const [wordCount, setWordCount] = useState<number>(0);
    const [charCount, setCharCount] = useState<number>(0);
    const [wpmArray, setWpmArray] = useState<number[]>([]);
    const [errorCount, setErrorCount] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const { theme } = useTheme();
    const router: NextRouter = useRouter();

    const currentTime = useCallback(() => {
        return new Date().getTime();
    }, []);

    useEffect(() => {
        const timeoutId =
            seconds > 0 && startTime
                ? setTimeout(() => {
                      setTime(seconds - 1);
                      const durationInMinutes = (currentTime() - startTime) / 60000.0;
                      const newWpm = Number((charCount / 5 / durationInMinutes).toFixed(2));
                      setWpm(newWpm);
                      const newWpmArray = wpmArray;
                      newWpmArray.push(newWpm);
                      setWpmArray(newWpmArray);
                  }, 1000)
                : undefined;

        return () => {
            clearTimeout(timeoutId);
        };
    }, [seconds, startTime]);

    useBodyKeyPress({
        callback: (key) => {
            // Do nothing if we aren't body racing
            if (!isBodyRace) {
                return;
            }

            if (!startTime) {
                setStartTime(currentTime);
            }

            if (seconds === 0 || loading) {
                return;
            }

            let updatedOutgoingChars = outgoingChars;
            let updatedIncomingChars = incomingChars;

            if (key === currentChar) {
                setIncorrectChar(false);
                // For the first 20 characters, move leftPadding forward
                if (leftPadding.length > 0) {
                    setLeftPadding(leftPadding.substring(1));
                }

                // Current char is now in outgoing chars
                updatedOutgoingChars += currentChar;
                setOutgoingChars(updatedOutgoingChars);

                // Current char is now the next letter
                setCurrentChar(incomingChars.charAt(0));

                updatedIncomingChars = incomingChars.substring(1);

                setIncomingChars(updatedIncomingChars);

                setCharCount(charCount + 1);

                if (incomingChars.charAt(0) === ' ') {
                    setWordCount(wordCount + 1);
                }
            } else {
                setIncorrectChar(true);
                setErrorCount(errorCount + 1);
            }
        },
        currBodyRaceChar,
    });

    useKeyPress({
        callback: (key) => {
            // Do nothing if we ARE body racing
            if (isBodyRace) {
                return;
            }

            // Start the timer
            if (!startTime) {
                setStartTime(currentTime);
            }

            // Don't register any keypresses after time is up
            if (seconds === 0 || loading) {
                return;
            }

            let updatedOutgoingChars = outgoingChars;
            let updatedIncomingChars = incomingChars;

            if (key === currentChar) {
                setIncorrectChar(false);
                // For the first 20 characters, move leftPadding forward
                if (leftPadding.length > 0) {
                    setLeftPadding(leftPadding.substring(1));
                }

                // Current char is now in outgoing chars
                updatedOutgoingChars += currentChar;
                setOutgoingChars(updatedOutgoingChars);

                // Current char is now the next letter
                setCurrentChar(incomingChars.charAt(0));

                updatedIncomingChars = incomingChars.substring(1);

                setIncomingChars(updatedIncomingChars);

                setCharCount(charCount + 1);

                if (incomingChars.charAt(0) === ' ') {
                    setWordCount(wordCount + 1);
                }
            } else {
                setIncorrectChar(true);
                setErrorCount(errorCount + 1);
            }
        },
    });

    // useEffect(() => setMounted(true), []);

    const tabIcon: string = useMemo(
        () => (theme === 'light' ? MountainIcon.src : VolcanoIcon.src),
        [theme]
    );

    const backButtonClickHandler = useCallback(() => {
        router.push('/');
    }, [router]);

    const resetState = useCallback(() => {
        console.log('CLICKED');
    }, []);

    const handleTextClick = useCallback(() => {
        if (isSm && inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <>
            <Head>
                <title>Race me</title>
                <link rel="icon" href={tabIcon} />
            </Head>

            <>
                <ToggleButton />

                <div className="flex items-center justify-center relative h-screen">
                    <div className="font-mono text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mb-2 cursor-pointer hover:bg-[#FF990080] sm:mr-auto sm:relative absolute top-4 left-4 sm:top-0 sm:left-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            onClick={backButtonClickHandler}
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>

                        <Metrics
                            isBodyRace={isBodyRace}
                            setIsBodyRace={setIsBodyRace}
                            resetState={resetState}
                            wpm={wpm}
                            seconds={seconds}
                        />

                        {isBodyRace && <BodyRace setCurrBodyRaceChar={setCurrBodyRaceChar} />}

                        {loading ? (
                            <p className="whitespace-pre width-race-me-text">
                                {' '}
                                <span className="text-gray-400">
                                    {Array(16).fill(' ').join('').slice(-30)}
                                </span>
                                Loading corpus...
                            </p>
                        ) : (
                            <>
                                <p className="whitespace-pre width-race-me-text w-screen justify-center flex">
                                    <span
                                        className={`text-gray-400 ${isBodyRace ? 'text-6xl' : ''}`}
                                    >
                                        {(leftPadding + outgoingChars).slice(isSm ? -25 : -30)}
                                    </span>
                                    <span
                                        className={`${
                                            incorrectChar ? 'bg-red-400' : 'bg-[#FF990080]'
                                        } relative flex justify-center  ${
                                            isBodyRace ? 'text-6xl' : ''
                                        }`}
                                        onClick={handleTextClick}
                                    >
                                        {/* Hack for iOS mobile because empty space is rendered as empty string? */}
                                        {currentChar === ' ' ? <span>&nbsp;</span> : currentChar}
                                        {isSm && (
                                            <input
                                                className="border-none cursor-default opacity-0 outline-none pointer-events-none absolute z-[-1] resize-none select-none"
                                                ref={inputRef}
                                            />
                                        )}
                                    </span>
                                    <span
                                        onClick={handleTextClick}
                                        className={`${isBodyRace ? 'text-6xl' : ''}`}
                                    >
                                        {incomingChars.substr(0, isSm ? 25 : 30)}
                                    </span>
                                </p>
                            </>
                        )}

                        <StartButton startTime={startTime} isBodyRace={isBodyRace} />
                        <span
                            className={'' + (startTime && 'cursor-pointer')}
                            onClick={() => resetState()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={
                                    'h-5 w-5 ml-auto mr-auto mb-4 ' +
                                    (!startTime && 'text-gray-400')
                                }
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </>
        </>
    );
};

export default function RaceMe() {
    return (
        <ThemeProvider>

            <Script
                src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
                crossOrigin="anonymous"
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js"
                crossOrigin="anonymous"
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js"
                crossOrigin="anonymous"
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
                crossOrigin="anonymous"
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
                crossOrigin="anonymous"
            />
            <Script src="https://cdn.plot.ly/plotly-2.20.0.min.js" />
            <HomeBody />
        </ThemeProvider>
    );
}