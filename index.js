const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const mcDataLoader = require('minecraft-data');

function createBot(username) {
  const bot = mineflayer.createBot({
    host: 'localhost', 
    username: username, 
    auth: 'offline'    
  });

  bot.loadPlugin(pathfinder);

  bot.on('chat', (username, message) => {
    if (username === bot.username) return; 

    if (message === '!pos') {
      const pos = bot.entity.position;
      bot.chat(`我是 ${bot.username}，我的位置是 X:${pos.x.toFixed(1)}, Y:${pos.y.toFixed(1)}, Z:${pos.z.toFixed(1)}`);
    }

    if (message === `!come ${bot.username}`) {
      const player = bot.players[username];
      const mcData = mcDataLoader(bot.version);
      const movements = new Movements(bot, mcData);
      bot.pathfinder.setMovements(movements);
      const goal = new goals.GoalNear(player.entity.position.x, player.entity.position.y, player.entity.position.z, 1);
      bot.pathfinder.setGoal(goal);
    }
  });

  bot.on('kicked', console.log);
  bot.on('error', console.log);
}

for (let i = 1; i <= 2; i++) {
  createBot(`Bot${i}`)
}
