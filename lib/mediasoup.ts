import { Device } from "mediasoup-client";
import { socket } from "./socket";

export class MediasoupManager {
  private device: Device | null = null;
  private sendTransport: any = null;
  private recvTransport: any = null;
  private producers: Map<string, any> = new Map();

  async init(routerRtpCapabilities: any) {
    this.device = new Device();
    await this.device.load({ routerRtpCapabilities });
  }

  async createSendTransport() {
    return new Promise((resolve, reject) => {
      socket.emit("create-transport", {}, async (data: any) => {
        if (data.error) return reject(data.error);

        this.sendTransport = this.device!.createSendTransport(data);

        this.sendTransport.on(
          "connect",
          ({ dtlsParameters }: any, callback: any, errback: any) => {
            socket.emit("connect-transport", {
              transportId: this.sendTransport.id,
              dtlsParameters,
            });
            callback();
          },
        );

        this.sendTransport.on(
          "produce",
          (
            { kind, rtpParameters, appData }: any,
            callback: any,
            errback: any,
          ) => {
            socket.emit(
              "produce",
              {
                transportId: this.sendTransport.id,
                kind,
                rtpParameters,
                appData,
              },
              (res: any) => {
                callback({ id: res.id });
              },
            );
          },
        );

        resolve(this.sendTransport);
      });
    });
  }

  async createRecvTransport() {
    return new Promise((resolve, reject) => {
      socket.emit("create-transport", {}, async (data: any) => {
        if (data.error) return reject(data.error);

        this.recvTransport = this.device!.createRecvTransport(data);

        this.recvTransport.on(
          "connect",
          ({ dtlsParameters }: any, callback: any, errback: any) => {
            socket.emit("connect-transport", {
              transportId: this.recvTransport.id,
              dtlsParameters,
            });
            callback();
          },
        );

        resolve(this.recvTransport);
      });
    });
  }

  async produce(track: MediaStreamTrack, type: "camera" | "screen") {
    if (!this.sendTransport) await this.createSendTransport();
    const producer = await this.sendTransport.produce({
      track,
      appData: { type },
    });
    this.producers.set(type, producer);
    return producer;
  }

  async shareScreen() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const track = stream.getVideoTracks()[0];
    const producer = await this.produce(track, "screen");
    
    track.onended = () => {
      this.stopProducing("screen");
    };

    return stream;
  }

  async stopProducing(type: "camera" | "screen") {
    const producer = this.producers.get(type);
    if (producer) {
      producer.close();
      this.producers.delete(type);
      socket.emit("producer-closed", { producerId: producer.id });
    }
  }


  async consume(producerId: string) {
    if (!this.recvTransport) await this.createRecvTransport();

    return new Promise((resolve, reject) => {
      socket.emit(
        "consume",
        {
          producerId,
          transportId: this.recvTransport.id,
          rtpCapabilities: this.device!.rtpCapabilities,
        },
        async (data: any) => {
          if (data.error) return reject(data.error);

          const consumer = await this.recvTransport.consume(data);
          resolve(consumer);
        },
      );
    });
  }
}

export const mediasoupManager = new MediasoupManager();
