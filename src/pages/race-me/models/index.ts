export type LeadershipModel = {
    user: any;
    adjusted_wpm: number;
};

export type RaceMeGeneralModel = {
    words: string;
    alix_wpm: string[];
    leaderboard: LeadershipModel[];
};

export type LeaderboardModel = {
    username: string;
    scores: number[];
};

export type LeaderboardDatabaseModel = {
    username: string;
    scores: string;
};
