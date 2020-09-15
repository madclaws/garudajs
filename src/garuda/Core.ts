
import {Socket} from "phoenix";
import { IConnectionConfig, IJoinRoom, IMatchSendInfo } from "./Interfaces";
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
  }

  public leaveGameChannel() {
    this.gameChannel.leave();
  }

  public getGameChannel(roomName: string, params: IJoinRoom, callbackFunction: any) {
    let maxPlayer = params.maxPlayers ? params.maxPlayers : 2;
    let playerId = params.playerId ? params.playerId : this.playerId;
    let matchmakerChannelName: string;
    this.gameRoomName = roomName;
    if (params.matchId) {
      matchmakerChannelName = "garuda_matchmaker:" + params.matchId + ":" + roomName + ":" + maxPlayer;
      this.matchId = params.matchId;
    } else {
      matchmakerChannelName = "garuda_matchmaker:" + roomName + ":" + maxPlayer;
      this.matchId = "";
    }
    let matchSendInfo: IMatchSendInfo = {
      player_count: maxPlayer,
      player_id: playerId,
      room_name: matchmakerChannelName,
      match_id: this.matchId,
    }
    this.matchmakerChannel = this.socket.channel(matchmakerChannelName, matchSendInfo);
    this.matchmakerChannel.join()
      .receive("ok", resp => {console.log("Joined matchmaker")})
      .receive("error", resp => {throw Error("unable to join matchmaker");});
  
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
    this.playerId = "gda_anon_" + getRandomId();
    this.socketUrl = connConfig.socketUrl;
  }
  
  private connectToSocket() {
    this.socket = new Socket(this.socketUrl);
    this.socket.connect();
    return this.socket;
  }

}