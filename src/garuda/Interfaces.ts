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
  metadata?: any
}
export interface IMatchSendInfo {
  max_players: number, 
  room_name: string,
  match_id?: string,
  player_id: string
  mode?: string
}
