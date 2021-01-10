/* 
  Contains all the interfaces used in the project.
*/


export interface IConnectionConfig {
  socketUrl: string;
  playerId?:string
}

export interface IJoinRoom {
  maxPlayers?: number;
  matchId?: string;
  mode?: string
}

export interface IMatchSendInfo {
  player_count: number, 
  room_name: string,
  match_id?: string,
  mode?: string
}

export interface INeoMatchSendInfo {
  max_players: number, 
  room_name: string,
  match_id?: string,
  player_id: string
  mode?: string
}