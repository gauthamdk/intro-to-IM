/*

adapted from: https://github.com/ongzzzzzz/p5.web-serial

MIT License

Copyright (c) 2022 Aaron Sherwood
Copyright (c) 2022 Ong Zhi Zheng

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

let port, reader, writer;
let serialActive = false;
const SELECT_PORT = true;
let portFound = false;

async function checkPorts() {
  const ports = await navigator.serial.getPorts();
  for (let i = 0; i < ports.length; i++) {
    if (ports[i].getInfo().usbProductId != null) portFound = true;
  }
}

async function getPort(baud = 9600, forceSelectPort = false) {
  if (forceSelectPort) {
    port = await navigator.serial.requestPort();
  } else {
    const ports = await navigator.serial.getPorts();

    for (let i = 0; i < ports.length; i++) {
      if (ports[i].getInfo().usbProductId != null) {
        port = ports[i];
        console.log(ports[i].getInfo());
        break;
      }
    }
  }

  await port.open({ baudRate: baud });

  // create read & write streams
  textDecoder = new TextDecoderStream();
  textEncoder = new TextEncoderStream();
  readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

  reader = textDecoder.readable
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();
  writer = textEncoder.writable.getWriter();

  return { port, reader, writer };
}

class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}

async function setUpSerial(forceSelectPort = false) {
  noLoop();
  if (!forceSelectPort) {
    checkPorts();
    await new Promise((r) => setTimeout(r, 20));
  }
  if (portFound || forceSelectPort) {
    ({ port, reader, writer } = await getPort(9600, forceSelectPort));
    serialActive = true;
    runSerial();
  }
  loop();
}

async function runSerial() {
  try {
    while (true) {
      if (typeof readSerial === "undefined") {
        console.log("No readSerial() function found.");
        serialActive = false;
        break;
      } else {
        const { value, done } = await reader.read();
        if (done) {
          // Allow the serial port to be closed later.
          reader.releaseLock();
          break;
        }
        readSerial(value);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

async function writeSerial(msg) {
  await writer.write(msg);
}
