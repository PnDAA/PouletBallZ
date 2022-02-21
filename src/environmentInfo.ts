export class EnvironmentInfo {
    public static get isDev():boolean {
        return window.location.origin.indexOf("localhost:3000") !== -1;
    }

    public static get endpointUri():string {
        if (this.isDev) {
            return "http://localhost:5000";
        }
        return "https://pinnate-verbena-insect.glitch.me";
    }
}
