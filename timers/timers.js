var isRunning = false;

handleCommand = (message, args, permissions) => {
    switch(args[0]){
        case "start":{
            init(message, permissions).then(() => start(message));
        }
        case "stop":{
            stop();
        }
    }
}

init = (message, permissions) => {
  var server = message.guild;

  return server.createChannel("Timers", "category").then(category => {
    server
      .createChannel("abyss", "text", [
        {
          id: server.id,
          denied: permissions.ALL
        }
      ])
      .then(channel => {
        channel.setParent(category);
        server
          .createChannel("reset", "text", [
            {
              id: server.id,
              denied: permissions.ALL
            }
          ])
          .then(channel => {
            return channel.setParent(category);
          });
      });
  });
};

start = (message) => {
    isRunning = true;
    let time = 1;

    var interval = setInterval(() => {
        if(isRunning){
            message.guild.channels.find(channel => channel.name.startsWith("abyss")).setName("abyss " + time);
            message.guild.channels.find(channel => channel.name.startsWith("reset")).setName("reset " + time);
            time++;
        }
        else{
            clearInterval(interval);
        }
      }, 1000);
}

stop = () => {
    isRunning = false;
}

module.exports = {
    handleCommand: handleCommand
};