export class Player {
    username: string;

    constructor(username ?: string) {
        this.username = (username === undefined) ? "" : username;
    }
}
