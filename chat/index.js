const WebSocket = require('ws');
const Dashboard = require('../models/dashboard');

const wss = new WebSocket.Server({port: 8080});

wss.on('connection', ws => {

  ws.on('message', function incoming(data) {
    let json = JSON.parse(data);

    const {dashboard_id, author_id, authorName, text} = json;
    Dashboard.addMessage(dashboard_id, author_id, authorName, text, (error, dash) => {
      if (error) throw error;
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });

    });
  });
});

wss.on('error', function(error)  {
  console.log(error);
});