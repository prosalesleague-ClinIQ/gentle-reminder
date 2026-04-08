declare module 'ws' {
  import { EventEmitter } from 'events';
  import { IncomingMessage, Server as HTTPServer } from 'http';

  class WebSocket extends EventEmitter {
    constructor(address: string | URL, options?: any);
    send(data: string | Buffer, cb?: (err?: Error) => void): void;
    close(code?: number, reason?: string): void;
    on(event: 'close', listener: (code: number, reason: Buffer) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'message', listener: (data: Buffer | string) => void): this;
    on(event: 'open', listener: () => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    readonly readyState: number;
    readonly CONNECTING: number;
    readonly OPEN: number;
    readonly CLOSING: number;
    readonly CLOSED: number;
    static readonly CONNECTING: number;
    static readonly OPEN: number;
    static readonly CLOSING: number;
    static readonly CLOSED: number;
  }

  class WebSocketServer extends EventEmitter {
    constructor(options: { server?: HTTPServer; port?: number; path?: string; noServer?: boolean });
    on(event: 'connection', listener: (socket: WebSocket, request: IncomingMessage) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    close(cb?: () => void): void;
    clients: Set<WebSocket>;
  }

  export { WebSocket, WebSocketServer };
}
