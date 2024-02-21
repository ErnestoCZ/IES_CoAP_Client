import {
  createServer,
  CoapServerOptions,
  IncomingMessage,
  OutgoingMessage,
} from "coap";

const coapConfig: CoapServerOptions = { type: "udp4", cacheSize: 2000 };
const port = 5683;

const server = createServer(coapConfig);

server.on("request", (req: IncomingMessage, res: OutgoingMessage) => {
  console.log("request received");
});

server.listen(port, "localhost");

// the default CoAP port is 5683
