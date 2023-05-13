import React, { FunctionComponent, useCallback, useState } from 'react';
import Loader from 'react-loader-spinner';

import MyResponsiveLine from '@/components/LineGraph';
import { LeadershipModel } from '@/pages/race-me/models';

type Props = {
    alixWpm: string[];
    wpmArray: number[];
    theme: string | undefined;
    wpm: number;
    corpus: string;
    errorCount: number;
    leaderboard: LeadershipModel[];
    postLeaderboard: (score: number, callback: () => void) => Promise<void>;
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
    postLeaderboard,
    submitLeaderboardLoading,
}) => {
    const [wasSaved, setWasSaved] = useState<boolean>(false);

    const afterSaveCallback = useCallback(
        () => {
            setWasSaved(true);
        },
        [setWasSaved],
    );

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
                <div className="flex flex-col items-center">
                    {!wasSaved && (
                        <button className="my-2" onClick={() => postLeaderboard(wpm, afterSaveCallback)}>
                            Submit
                        </button>
                    )}

                    {wasSaved && <span className="my-2">Your WPM was successfully saved!</span>}

                    {submitLeaderboardLoading && (
                        <div className={'my-3'}>
                            <Loader
                                type="TailSpin"
                                color={theme === 'dark' ? '#fff' : '#000'}
                                height={16}
                                width={16}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadershipBoard;
