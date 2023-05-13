import { useCallback, useEffect, useState } from 'react';
import { LeadershipModel, RaceMeGeneralModel } from '@/pages/race-me/models';
import { Database } from '@/services/database';

const CORPUS_TABLE_NAME: string = 'corpus';
const CORPUS_COLUMN_NAMES: string = 'words,alix_wpm,leaderboard';

const useDatabaseInfo = () => {
    const [words, setWords] = useState<string>('');
    const [alixWpm, setAlixWpm] = useState<string[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeadershipModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async (): Promise<void> => {
        const data = (await Database.getInstance().getRecords(
            CORPUS_TABLE_NAME,
            CORPUS_COLUMN_NAMES
        )) as RaceMeGeneralModel[];

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
    };
};

export default useDatabaseInfo;
