import {
  createServer,
  CoapServerOptions,
  IncomingMessage,
  OutgoingMessage,
  registerFormat,
} from 'coap';
import { Buffer } from 'node:buffer';
import axios from 'axios';
import rt from 'runtypes';

//configs
const coapConfig: CoapServerOptions = { type: 'udp4', cacheSize: 2000 };
const port = 5683; // 5683 is a standart CoAP Port
registerFormat('application/json', 50);
const server = createServer(coapConfig);
const backendURL: string = 'http://localhost:3000/IESGateway/';

//Add EventListener
server.on('request', (req: IncomingMessage, res: OutgoingMessage) => {
  //processing incoming requests

  if (req.headers.Accept !== 'application/json') {
    res.code = '4.06';
    console.log('rejected request -> wrong format');
    return res.end();
  }

  try {
    const extractedData: object = fromBufferToJSON(req.payload);
    //TODO runtypecheck
    console.log(extractedData);
    const response = sentDataToBackend(extractedData);
    //BUGFIX sends back always a sucessfull response
    response
      .then((value) => {
        sendResponseJSON(res, 'succesfull');
        return;
      })
      .catch((error) => {
        sendResponseJSON(res, 'failed');
        return;
      });
  } catch (error) {
    console.log(error);
    sendResponseJSON(res, 'failed');
    return;
  }
});

//start server
server.listen(port, () => {
  console.log(`IES Coap Server started on port ${port}`);
});

//helper functions
function fromBufferToJSON(data: Buffer): object {
  const jsonData: object = JSON.parse(data.toString('utf-8'));
  return jsonData;
}

function sendResponseJSON(res: OutgoingMessage, message: string): void {
  res.setOption('Content-Format', 'application/json');
  res.end(JSON.stringify({ response: `${message}` }));
}
async function sentDataToBackend(data: object) {
  try {
    const response = await axios.post(backendURL, data);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}
