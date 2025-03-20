export const connectToWebSocket = (accessToken, onMessage) => {
    if (!accessToken) {
      console.error('No access token found, unable to connect to WebSocket.');
      return;
    }
    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${accessToken}`);
    socket.onopen = () => {
      console.log('WebSocket connected!');
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
  
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (error instanceof ErrorEvent) {
          console.error('Error details:', error.message);
        } else {
          console.error('Unknown WebSocket error', error);
        }
      };
      
  
    socket.onclose = () => {
      console.log('WebSocket closed');
    };
  
    return socket;
  };
  