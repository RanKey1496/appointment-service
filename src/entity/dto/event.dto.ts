export class Event {
    summary: string;
    description: string;
    start: { dateTime: string, timeZone: string };
    end: { dateTime: string, timeZone: string };

    reminders: {
        useDefault: boolean,
        overrides: Array<{ method: string, minutes: number }>
    };
}