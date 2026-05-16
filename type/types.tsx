export type ProjectType = {
    id: number;
    projectTd: string;
    device: string;
    userInput: string;
    createdAt: string;
    projectName?: string;
    theme?: string;

}

export type ScreenConfig = {
    id: number;
    screenID: string;
    screenName: string;
    purpose: string;
    screenDescription: string;
    code?: string; 
}

