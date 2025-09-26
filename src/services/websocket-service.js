/**
 * A WebSocket manager that handles connection, reconnection,
 * message sending, and listener management.
 */

class WebsocketService {
    constructor() {
        this.url = null;
        this.websocket = null;
        this.listeners = new Set();

        this.shouldReconnect = true;
        this.reconnectTimeoutID = null;

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

            // Clear any existing reconnection attempts
            if (this.reconnectTimeoutID) {
                clearTimeout(this.reconnectTimeoutID);
                this.reconnectTimeoutID = null;
            }

            // Send any queued messages
            while (this.messageQueue.length > 0) {
                const message = this.messageQueue.shift();
                this.sendMessage(message);
            }
        };

        /** Handle WebSocket message event */
        this.websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("[WEBSOCKET] Message: ", data);
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
        console.log(`🔄 Reconnecting in 1s...`);
        this.reconnectTimeoutID = setTimeout(() => this.connect(this.url), 1000);
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

/** Instance of the WebSocket service */
const websocketService = new WebsocketService();

export default websocketService;
