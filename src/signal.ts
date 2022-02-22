// https://www.davideaversa.it/blog/simple-event-system-typescript/
export class Signal<S, T> {
    private handlers: Array<(source: S, data: T) => void> = [];

    public on(handler: (source: S, data: T) => void): void {
        this.handlers.push(handler);
    }

    public off(handler: (source: S, data: T) => void): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(source: S, data: T): void {
        // Duplicate the array to avoid side effects during iteration.
        this.handlers.slice(0).forEach(h => h(source, data));
    }
}

export class AsyncSignal<S, T> {
    private handlers: Array<(source: S, data: T) => Promise<void>> = [];

    public on(handler: (source: S, data: T) => Promise<void>): void {
        this.handlers.push(handler);
    }

    public off(handler: (source: S, data: T) => Promise<void>): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public async trigger(source: S, data: T): Promise<void> {
        this.handlers.slice(0).map(h => h(source, data));
    }

    public async triggerAwait(source: S, data: T): Promise<void> {
        const promises = this.handlers.slice(0).map(h => h(source, data));
        await Promise.all(promises);
    }
}