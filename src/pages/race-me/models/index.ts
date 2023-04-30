export type LeadershipModel = {
    user: any;
    adjusted_wpm: number;
};

export type RaceMeGeneralModel = {
    words: string;
    alix_wpm: string[];
    leaderboard: LeadershipModel[];
};
