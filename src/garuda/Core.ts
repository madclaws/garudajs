
import {Socket} from "phoenix";
import { IConnectionConfig, IJoinRoom, IMatchSendInfo} from "./Interfaces";
import { getRandomId } from "./Utils";

export class Core {
  private socket: any; // websocket object
  private socketUrl: string; // websocket url
  private playerId: string;
  private matchmakerChannel: any;
  private matchId: string;
  private gameChannel: any;
  private gameRoomName: string;
  public constructor(connConfig: IConnectionConfig) {
    this.setupConfigs(connConfig);
    this.connectToSocket();
    this.registerEvents();
  }

  /**
   * Leaves the game channel.
   */
  public leaveGameChannel() {
    this.gameChannel.leave();
  }

  /**
   * Joins the game channel, and call the callback function with the join status ("ok" or "error"), 
   * and gameChannel reference, which we can use it as a regualar phoenix channel object.
   * @param roomName - Name of game specified in user-socket
   * @param params  - Join speciif params
   * @param callbackFunction - Function to call on joining game-channel.
   */
  public joinGameChannel(roomName: string, params: IJoinRoom, callbackFunction: any) {
    const maxPlayer: number = params.maxPlayers || 1;
    this.gameRoomName = roomName;
    const matchmakerChannelName: string = `garuda_matchmaker:lobby` ;
    this.matchId = params.matchId || "";
    const metadata = params.metadata || {};
    const matchSendInfo: IMatchSendInfo = {
      max_players: maxPlayer,
      room_name: this.gameRoomName,
      match_id: this.matchId,
      player_id: this.playerId
    }
    
    this.matchmakerChannel = this.socket.channel(matchmakerChannelName, matchSendInfo);
    this.matchmakerChannel.join()
      .receive("ok", resp => { 
        this.matchmakerChannel.leave();
        this.matchId = resp.match_id;
        this.gameChannel = this.socket.channel("room_" + this.gameRoomName + ":" + this.matchId, {metadata: metadata, max_players: maxPlayer});
        this.gameChannel.join()
        .receive("ok", () => {
          callbackFunction("ok", this.gameChannel);
        })
        .receive("error", () => {
          callbackFunction("error", this.gameChannel);
        })
      })
      .receive("error", resp => {
        console.log("Error joining matchmaker", resp);
        this.matchmakerChannel.leave()
        callbackFunction("error", undefined);
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
  }

  private registerEvents(): void {
    window.addEventListener("beforeunload", () => {
      this.onClientUnload();
    });
		window.addEventListener("unload", () => {
      this.onClientUnload();
    });
  }

  private onClientUnload(): void {
    this.gameChannel.leave();
  }

}
