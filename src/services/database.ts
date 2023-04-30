import { IDatabase } from '@/services/idatabase';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RaceMeGeneralModel } from '@/pages/race-me/models';

export class Database implements IDatabase<RaceMeGeneralModel> {
    private _client: SupabaseClient<RaceMeGeneralModel> | undefined = undefined;
    private static _instance: Database;

    private constructor() {
        this._client = createClient<RaceMeGeneralModel>(
            process.env.NEXT_PUBLIC_SUPABASE_URL as string,
            process.env.NEXT_PUBLIC_SUPABASE_API_KEY as string,
        );
    }

    public async getRecords(tableName: string, column: string): Promise<RaceMeGeneralModel[]> {
        if (!this._client) {
            return [];
        }

        const { data } = await this._client
            .from(tableName)
            .select(column);

        if (data) {
            // @ts-ignore
            return data as RaceMeGeneralModel[];
        }

        return [];
    }

    public static getInstance(): Database {
        if (!Database._instance) {
            this._instance = new Database();
        }

        return this._instance;
    }

    public async updateRecord(tableName: string, newValue: RaceMeGeneralModel): Promise<RaceMeGeneralModel | undefined> {
        if (!this._client) {
            return undefined;
        }

        const { data } = await this._client
            .from(tableName)
            .update(newValue);

        return newValue;
    }
}
