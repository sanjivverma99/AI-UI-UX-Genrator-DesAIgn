export type ProjectType = {
    id: number;
    projectId: string;
    device: string;
    userInput: string;
    createdAt: string;
    projectName?: string;
    theme?: string;
    screenshot?: string;

}

export type ScreenConfig = {
    selectedTheme: string;
    id: number;
    screenID: string;
    screenName: string;
    purpose: string;
    screenDescription: string;
    code?: string; 
}

