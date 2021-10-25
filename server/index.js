/**
 * Phaser Real-Time Template
 * @author       Juan Nicholls <jdnichollsc@hotmail.com>
 * @copyright    2017 Proyecto 26 - https://github.com/proyecto26/Phaser-Workshop
 * @license      {@link http://opensource.org/licenses/MIT}
 * @version 1.0.0
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const Player = require('./socket/player');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Connection established');
  new Player(socket);
  socket.on('disconnect', () => {
    io.emit('enemy.disconnect', socket.id);
    socket.emit('player.disconnect');
  });
});

httpServer.listen(process.env.PORT || 8081, () => {
  console.log('Listening on ' + httpServer.address().port);
});
