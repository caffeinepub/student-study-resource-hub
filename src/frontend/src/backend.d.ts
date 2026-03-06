import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Suggestion {
    name: string;
    email: string;
    message: string;
}
export interface backendInterface {
    addSuggestion(name: string, email: string, message: string): Promise<bigint>;
    deleteSuggestion(id: bigint): Promise<void>;
    getAllSuggestions(): Promise<Array<[bigint, Suggestion]>>;
    getSuggestion(id: bigint): Promise<Suggestion>;
    updateSuggestion(id: bigint, name: string, email: string, message: string): Promise<void>;
}
