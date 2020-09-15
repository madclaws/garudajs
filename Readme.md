# garudajs
 Javascript client for Garuda.
## Installation

    npm install garudajs
## Usage

    let garudaClient = new Garuda(ws://localhost:4000)
Create garudaClient by giving the socket url as params

    Garuda.getGameChannel("tictactoe", {player_count: 2}, onGameChannel)

Returns a phoenix channel in the onGameChannel callback function, with the matchData.

    let gameChannel;
    function onGameChannel(game_channel, matchData) {
	    gameChannel = game_channel;
    }
    gameChannel.join()
	    .recieve("ok" => {"joined game channel successfully})
	    .receive("error" => {console.log("error")} 

gameChannel then works like a normal phoenix channel object. We can use all the functions of a channel onto gameChannel also.