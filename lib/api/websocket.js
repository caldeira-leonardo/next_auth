class WebSocketClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...options,
    };

    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.heartbeatTimer = null;
    this.listeners = new Map();
    this.messageQueue = [];
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.scheduleReconnect();
    }
  }

  disconnect() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
  }

  handleOpen(event) {
    console.log('WebSocket connected');
    this.isConnected = true;
    this.reconnectAttempts = 0;

    this.startHeartbeat();

    this.processMessageQueue();

    this.emit('open', event);
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'heartbeat') {
        return;
      }

      this.emit('message', data);

      if (data.type) {
        this.emit(data.type, data);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  handleClose(event) {
    console.log('WebSocket disconnected:', event.code, event.reason);
    this.isConnected = false;

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.emit('close', event);

    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }

  handleError(error) {
    console.error('WebSocket error:', error);
    this.emit('error', error);
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.options.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'heartbeat' });
      }
    }, this.options.heartbeatInterval);
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  send(data) {
    if (this.isConnected && this.ws) {
      try {
        this.ws.send(JSON.stringify(data));
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      this.messageQueue.push(data);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket listener:', error);
        }
      });
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      url: this.url,
    };
  }
}

export function createWebSocketClient(url, options = {}) {
  return new WebSocketClient(url, options);
}

export function useWebSocket(url, options = {}) {
  const [wsClient, setWsClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const client = createWebSocketClient(url, options);

    client.on('open', () => setIsConnected(true));
    client.on('close', () => setIsConnected(false));
    client.on('message', setLastMessage);

    client.connect();
    setWsClient(client);

    return () => {
      client.disconnect();
    };
  }, [url]);

  return {
    wsClient,
    isConnected,
    lastMessage,
    send: (data) => wsClient?.send(data),
    on: (event, callback) => wsClient?.on(event, callback),
    off: (event, callback) => wsClient?.off(event, callback),
  };
}

export default WebSocketClient;
