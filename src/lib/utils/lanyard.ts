export interface LanyardResponse {
  data: {
    spotify: {
      song: string;
      artist: string;
      album_art_url: string;
      timestamps: {
        start: number;
        end: number;
      };
    } | null;
    discord_status: string;
    activities: Array<{
      type: number;
      state: string;
      name: string;
      id: string;
    }>;
    discord_user: {
      username: string;
      public_flags: number;
      id: string;
      discriminator: string;
      avatar: string;
    };
  };
}

export class LanyardWebSocket {
  private ws: WebSocket;
  private heartbeat: NodeJS.Timeout | null = null;

  constructor(userId: string, onUpdate: (data: LanyardResponse['data']) => void) {
    this.ws = new WebSocket('wss://api.lanyard.rest/socket');

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
      
      // Set up heartbeat
      this.heartbeat = setInterval(() => {
        this.ws.send(JSON.stringify({ op: 3 }));
      }, 30000);
    };

    this.ws.onmessage = ({ data }) => {
      const { t, d } = JSON.parse(data);
      
      if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
        onUpdate(d);
      }
    };

    this.ws.onclose = () => {
      if (this.heartbeat) {
        clearInterval(this.heartbeat);
      }
    };

    this.ws.onerror = (error) => {
      console.error('Lanyard WebSocket error:', error);
      this.reconnect(userId, onUpdate);
    };
  }

  private reconnect(userId: string, onUpdate: (data: LanyardResponse['data']) => void) {
    setTimeout(() => {
      new LanyardWebSocket(userId, onUpdate);
    }, 5000);
  }

  disconnect() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
    }
    this.ws.close();
  }
}
