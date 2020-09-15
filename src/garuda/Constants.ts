/* 
  Contains all the constants used in the project
*/

// import {encode, decode} from "@msgpack/msgpack"
export const SERVER_EVENT = "0";
export const gzp_encode = (msg, callback) => {
  // console.log("TCL: gzp_encode -> msg", msg)
  let payload = [
    msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload
  ]
  // return callback(encode(payload));
}

export const gzp_decode = (rawPayload: any, callback) => {
  // @ts-ignore
  const responseObj = decode(rawPayload);
    // return callback(responseObj)
}
 