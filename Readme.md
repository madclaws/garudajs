# garudajs
 Javascript client for [Garuda](https://github.com/madclaws/garuda) multiplayer server framework.
## Installation

    npm install garudajs
## Usage

    let garudaClient = new Garuda(ws://localhost:4000)
Create client by giving the socket url as params

    Garuda.joinGameChannel("tictactoe", {max_players: 2}, onGameChannel)

Returns a phoenix channel in the onGameChannel callback function.

    let gameChannel;
    function onJoinRoom(channelJoinStatus, gameChannel) {
	    this.channel = gameChannel //phoenix gameChannel Object
    }

gameChannel then works like a normal phoenix channel object. We can use all the functions of a channel object onto gameChannel also.

## Contributors
[ghostdsb](https://github.com/ghostdsb)