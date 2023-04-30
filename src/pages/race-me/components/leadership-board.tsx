import React, { FunctionComponent, useMemo, useRef } from 'react';
import MyResponsiveLine from '@/components/LineGraph';
import Loader from 'react-loader-spinner';
import { LeadershipModel } from '@/pages/race-me/models';

type Props = {
    alixWpm: number[];
    wpmArray: number[];
    theme: string | undefined;
    wpm: number;
    corpus: string;
    errorCount: number;
    leaderboard: LeadershipModel[];
    showLeaderboardSubmission: boolean;
    profanityDetected: boolean;
    postLeaderboard: () => void;
    submitLeaderboardLoading: boolean;
};

const LeadershipBoard: FunctionComponent<Props> = ({
    alixWpm,
    wpmArray,
    theme,
    wpm,
    corpus,
    errorCount,
    leaderboard,
    showLeaderboardSubmission,
    profanityDetected,
    postLeaderboard,
    submitLeaderboardLoading,
}) => {
    const inputEl = useRef<HTMLInputElement>(null);

    const displayBoardSubmission = useMemo<boolean>(() => {
        if (!leaderboard) return false;

        return (
            (wpm > leaderboard.at(-1).adjusted_wpm || leaderboard.length < 5) &&
            showLeaderboardSubmission
        );
    }, [leaderboard, wpm, showLeaderboardSubmission]);

    return (
        <div className="font-mono px-4 sm:px-0">
            <div className="h-64">
                <MyResponsiveLine
                    data={[
                        {
                            id: 'Alix',
                            color: 'hsl(359, 70%, 50%)',
                            data: alixWpm.map((e, i) => ({ x: i + 1, y: e })),
                        },
                        {
                            id: 'You',
                            data: wpmArray.map((e, i) => ({ x: i + 1, y: e })),
                        },
                    ]}
                    axisLeftName="WPM"
                    axisBottomName="time"
                    theme={theme}
                />
            </div>

            <div className="flex justify-between">
                <h3 className="you-text-decoration underline decoration-3">Your WPM: {wpm}</h3>
                <h3 className="alix-text-decoration underline decoration-3">
                    Alix&apos;s WPM: {alixWpm[alixWpm.length - 1]}
                </h3>
            </div>

            <div className="flex justify-between mb-8">
                <h3 className="you-text-decoration underline decoration-3">
                    Your accuracy: {((corpus.length - errorCount) / corpus.length).toFixed(2)}
                </h3>
                <h3 className="alix-text-decoration underline decoration-3">
                    Alix&apos;s accuracy: 1.00
                </h3>
            </div>

            <div>
                <h3>Leaderboard</h3>
                {leaderboard.map((user, i) => {
                    return (
                        <h3 className="text-left" key={i}>
                            {i + 1}. {user.user}: {user.adjusted_wpm} WPM
                        </h3>
                    );
                })}
                {displayBoardSubmission ? (
                    <div className="flex flex-col items-center">
                        <div className="mt-4 mb-2">
                            Enter your name to be put on the leaderboard
                        </div>
                        <input
                            className="width-5ch border border-black dark:border-white text-center mb-2"
                            ref={inputEl}
                            maxLength={4}
                        ></input>
                        {profanityDetected && (
                            <p className="text-red-500 dark:text-red-300">Profanity detected</p>
                        )}
                        <button className="mb-2" onClick={() => postLeaderboard()}>
                            Submit
                        </button>
                        {submitLeaderboardLoading && (
                            <Loader
                                type="TailSpin"
                                color={theme === 'dark' ? '#fff' : '#000'}
                                height={16}
                                width={16}
                            />
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default LeadershipBoard;
