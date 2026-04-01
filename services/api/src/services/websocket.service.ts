import { WebSocket } from 'ws';

interface AlertPayload {
  type: string;
  patientId: string;
  severity: string;
  message: string;
  timestamp: string;
}

interface SessionUpdate {
  sessionId: string;
  patientId: string;
  phase: string;
  exerciseIndex: number;
  score?: number;
}

/**
 * WebSocket service for real-time notifications.
 * Manages connections per userId and broadcasts alerts/updates.
 */
class WebSocketService {
  private connections: Map<string, Set<WebSocket>> = new Map();

  handleConnection(ws: WebSocket, userId: string): void {
    if (!this.connections.has(userId)) {
      this.connections.set(userId, new Set());
    }
    this.connections.get(userId)!.add(ws);

    console.log(`[WS] User ${userId} connected (${this.connections.get(userId)!.size} connections)`);

    ws.on('close', () => this.handleDisconnection(ws, userId));
    ws.on('error', () => this.handleDisconnection(ws, userId));

    // Send welcome message
    this.send(ws, { type: 'connected', userId, timestamp: new Date().toISOString() });
  }

  handleDisconnection(ws: WebSocket, userId: string): void {
    const userConns = this.connections.get(userId);
    if (userConns) {
      userConns.delete(ws);
      if (userConns.size === 0) {
        this.connections.delete(userId);
      }
    }
    console.log(`[WS] User ${userId} disconnected`);
  }

  broadcastAlert(caregiverIds: string[], alert: AlertPayload): void {
    const message = { type: 'alert', data: alert };
    for (const userId of caregiverIds) {
      this.sendToUser(userId, message);
    }
  }

  broadcastSessionUpdate(caregiverIds: string[], update: SessionUpdate): void {
    const message = { type: 'session_update', data: update };
    for (const userId of caregiverIds) {
      this.sendToUser(userId, message);
    }
  }

  sendToUser(userId: string, data: unknown): void {
    const conns = this.connections.get(userId);
    if (!conns) return;

    const payload = JSON.stringify(data);
    for (const ws of conns) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
  }

  getConnectedUserCount(): number {
    return this.connections.size;
  }

  private send(ws: WebSocket, data: unknown): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }
}

export const websocketService = new WebSocketService();
