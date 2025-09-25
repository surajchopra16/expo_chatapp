/**
 * A WebSocket manager that handles connection, reconnection,
 * message sending, and listener management.
 */

class WebsocketManager {
    constructor() {
        this.url = null;
        this.websocket = null;
        this.listeners = new Set();

        this.shouldReconnect = true;

        this.messageQueue = [];
    }

    connect(url) {
        if (!url) return;

        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            console.log("[WS] Already connected");
            return;
        }

        this.url = url;

        // Initialize WebSocket connection
        this.websocket = new WebSocket(this.url);

        /** Handle WebSocket open event */
        this.websocket.onopen = () => {
            console.log("[WEBSOCKET] Connected");

            // Send any queued messages
            while (this.messageQueue.length > 0) {
                const message = this.messageQueue.shift();
                this.sendMessage(message);
            }
        };

        /** Handle WebSocket message event */
        this.websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.listeners.forEach((listener) => listener(data));
        };

        /** Handle WebSocket close event */
        this.websocket.onclose = (event) => {
            console.log("[WEBSOCKET] Disconnected", event.reason);
            if (this.shouldReconnect) this.reconnect();
        };

        /** Handle WebSocket error event */
        this.websocket.onerror = (error) => {
            console.error("[WEBSOCKET] Error", error.message);
            this.websocket.close();
        };
    }

    reconnect() {
        const timeout = 1000;
        console.log(`🔄 Reconnecting in ${timeout / 1000}s...`);

        setTimeout(() => {
            this.connect();
        }, timeout);
    }

    disconnect() {
        this.shouldReconnect = false;
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }

    sendMessage(message) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify(message));
        } else {
            console.warn("[WEBSOCKET] Cannot send message, not connected");
            this.messageQueue.push(message);
        }
    }

    addListener(listener) {
        this.listeners.add(listener);
    }

    removeListener(listener) {
        this.listeners.delete(listener);
    }
}

const websocketManager = new WebsocketManager();

export default websocketManager;
