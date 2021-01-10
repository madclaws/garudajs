
import {Socket} from "phoenix";
import { IConnectionConfig, IJoinRoom, IMatchSendInfo, INeoMatchSendInfo } from "./Interfaces";
import { getRandomId } from "./Utils";
import { SERVER_EVENT, gzp_encode, gzp_decode } from "./Constants";

export class Core {
  private socket: any; // websocket object
  private socketUrl: string; // websocket url
  private playerId: string;
  private matchmakerChannel: any;
  private matchId: string;
  private gameChannel: any;
  private gameRoomName: string;
  private isGameRoomJoined: boolean = false;
  public constructor(connConfig: IConnectionConfig) {
    this.setupConfigs(connConfig);
    this.connectToSocket();
    this.registerEvents();
  }

  public leaveGameChannel() {
    this.gameChannel.leave();
  }


  // public getOpenRooms(roomName: string){
  //   console.log("DSB: Core -> getOpenRooms -> this.matchmakerChannel", this.matchmakerChannel);
  //   this.matchmakerChannel.push(
  //     "get_open_rooms", {room_name: roomName}
  //   )
  //   this.matchmakerChannel.on("open_rooms", (message) => {
  //     console.log("GAME ROOMS", message);
  //     // callbackFunction(this.gameChannel, message);
  // });
  // }

  public getGameChannel(roomName: string, params: IJoinRoom, callbackFunction: any) {
    let matchmakerChannelName: string;
    let mode = params.mode || "default";
    let maxPlayer = params.maxPlayers || 2;
    console.log("DSB: Core -> getGameChannel -> maxPlayer", maxPlayer);
    this.gameRoomName = roomName;

    switch (mode){
      case "default":
        matchmakerChannelName = `garuda_neo_matchmaker:lobby` ;
        this.matchId = params.matchId || "";
        break
      case "create":
        matchmakerChannelName = `garuda_matchmaker:${params.matchId}:${roomName}:createjoin` ;
        this.matchId = params.matchId;
        break
      case "join":
        matchmakerChannelName = `garuda_matchmaker:${params.matchId}:${roomName}:createjoin` ;
        this.matchId = params.matchId;
        maxPlayer = -1
        break
      default:
        break

    }
   /*  let matchSendInfo: IMatchSendInfo = {
      player_count: maxPlayer,
      room_name: matchmakerChannelName,
      match_id: this.matchId,
      mode
    } */

    let matchSendInfo: INeoMatchSendInfo = {
      max_players: maxPlayer,
      room_name: this.gameRoomName,
      match_id: this.matchId,
      player_id: this.playerId
    }
    
    console.log("🚀 ~ file: Core.ts ~ line 68 ~ Core ~ getGameChannel ~ matchSendInfo", matchSendInfo)
    this.matchmakerChannel = this.socket.channel(matchmakerChannelName, matchSendInfo);
    this.matchmakerChannel.join()
      .receive("ok", resp => {console.log("Joined matchmaker", resp); 
        this.matchmakerChannel.leave();
        this.matchId = resp;
        this.gameChannel = this.socket.channel("room_" + this.gameRoomName + ":" + this.matchId, {max_players: maxPlayer});
        callbackFunction(this.gameChannel, resp);
        return "ok"
      })
      .receive("error", resp => {
        console.log("Error joining matchmaker", resp);
        this.matchmakerChannel.leave()
        return "error"
      });
  
    this.matchmakerChannel.on("match_maker_event", (message) => {
        console.log("On match maker event", message);
        this.matchmakerChannel.leave();
        this.matchId = message["match_id"];
        this.gameChannel = this.matchId?this.socket.channel("room_" + this.gameRoomName + ":" + this.matchId):undefined;
        callbackFunction(this.gameChannel, message);
    });
  }

  /* 
    Manage configs, that will be used for socket connections
  */
  private setupConfigs(connConfig: IConnectionConfig) {
    this.playerId = connConfig.playerId||"gda_anon_" + getRandomId();
    this.socketUrl = connConfig.socketUrl;
  }
  
  private connectToSocket() {
    this.socket = new Socket(this.socketUrl,{params: {playerId: this.playerId}});
    this.socket.connect();
    return this.socket;
  }

  private registerEvents(): void {
    window.addEventListener("beforeunload", this.onClientUnload.bind(this));
		window.addEventListener("unload", this.onClientUnload.bind(this));
  }

  private onClientUnload(): void {
    this.gameChannel.leave();
  }
  

}