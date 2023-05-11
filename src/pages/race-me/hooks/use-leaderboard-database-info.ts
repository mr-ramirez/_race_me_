import React, { useCallback, useEffect, useState } from 'react';
import {
    LeaderboardDatabaseModel,
    LeaderboardModel,
    LeadershipModel,
} from '@/pages/race-me/models';
import { Database } from '@/services/database';

const LEADERBOARD_TABLE_NAME: string = 'leaderboard';
const LEADERBOARD_COLUMN_NAMES: string = 'username,scores';
const LEADERBOARD_WHERE_COLUMN_NAME: string = 'username';

type UseLeaderboardDatabaseInfoParams = {
    username: string;
};

export type UseLeaderboardDatabaseInfo = {
    saveScore: (value: number) => Promise<void>;
};

const useLeaderboardDatabaseInfo = ({
    username,
}: UseLeaderboardDatabaseInfoParams): UseLeaderboardDatabaseInfo => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchLeaderboard = useCallback(async (): Promise<void> => {
        if (!username) {
            return;
        }

        setLoading(true);
        const records = (await Database.getInstance().getRecords(
            LEADERBOARD_TABLE_NAME,
            LEADERBOARD_COLUMN_NAMES
        )) as LeaderboardDatabaseModel[];

        const formattedRecords = records.map(
            (record: LeaderboardDatabaseModel): LeaderboardModel => ({
                username: record.username,
                scores: JSON.parse(record.scores) as number[],
            })
        );

        setLeaderboard(formattedRecords);
        setLoading(false);
    }, [username, setLoading]);

    const saveNewRecord = useCallback(async (username: string, score: number): Promise<void> => {
        const newRecord: LeaderboardDatabaseModel = {
            username,
            scores: JSON.stringify([score]),
        };

        await Database.getInstance().createRecord(LEADERBOARD_TABLE_NAME, newRecord);
    }, []);

    const updateRecord = useCallback(
        async (record: LeaderboardModel, newScore: number): Promise<void> => {
            const newScores = [...record.scores, newScore];
            newScores.sort();

            const recordToUpdate: LeaderboardDatabaseModel = {
                username: record.username,
                scores: JSON.stringify(newScores),
            };

            await Database.getInstance().updateRecord(
                LEADERBOARD_TABLE_NAME,
                recordToUpdate,
                username,
                LEADERBOARD_WHERE_COLUMN_NAME
            );
        },
        []
    );

    const saveScore = useCallback(
        async (value: number): Promise<void> => {
            const preexistingRecord = leaderboard.find(
                (item: LeaderboardModel) => item.username === username
            );

            if (!preexistingRecord) {
                await saveNewRecord(username as string, value);
            } else {
                await updateRecord(preexistingRecord, value);
            }

            await fetchLeaderboard();
        },
        [leaderboard, username, saveNewRecord, updateRecord, fetchLeaderboard]
    );

    useEffect(() => {
        fetchLeaderboard();
    }, [username]);

    return {
        saveScore,
    };
};

export default useLeaderboardDatabaseInfo;
