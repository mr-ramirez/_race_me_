import React, { useCallback, useEffect, useState } from 'react';
import { LeadershipModel } from '@/pages/race-me/models';
import { Database } from '@/services/database';

const TABLE_NAME: string = 'corpus';
const COLUMN_NAMES: string = 'words,alix_wpm,leaderboard';

const useDatabaseInfo = () => {
    const [words, setWords] = useState<string>('');
    const [alixWpm, setAlixWpm] = useState<string[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeadershipModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const updateLeaderboard = useCallback(
        async (wpm: number, username: string): Promise<void> => {
            const newLeaderboard: LeadershipModel[] = leaderboard;

            newLeaderboard.push({
                adjusted_wpm: parseFloat(String(wpm)),
                user: username,
            });

            newLeaderboard.sort((a, b) => {
                if (a.adjusted_wpm > b.adjusted_wpm) {
                    return -1;
                } else {
                    return 1;
                }
            });

            await Database.getInstance().updateRecord(TABLE_NAME, {
                words,
                alix_wpm: alixWpm,
                leaderboard: newLeaderboard,
            });
        },
        [],
    );


    const fetchData = useCallback(async (): Promise<void> => {
        const data = await Database.getInstance().getRecords(TABLE_NAME, COLUMN_NAMES);
        console.log('CORPUS INFO', data);

        const [info] = data;

        setWords(info.words);
        setAlixWpm(info.alix_wpm);
        setLeaderboard(info.leaderboard);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    return {
        words,
        alixWpm,
        leaderboard,
        loading,
        updateLeaderboard,
    };
};

export default useDatabaseInfo;
