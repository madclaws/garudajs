/* 
  Contains all the constants used in the project
*/

import {encode, decode} from "@msgpack/msgpack"
export const gzp_encode = (msg, callback) => {
  let payload = [
    msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload
  ]
  return callback(encode(payload));
}

export const gzp_decode = (rawPayload: any, callback) => {
  // @ts-ignore
  const responseObj = decode(rawPayload);
    return callback(responseObj)
}
 