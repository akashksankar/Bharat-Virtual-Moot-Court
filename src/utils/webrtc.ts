export interface PeerConnectionMap {
  [peerId: string]: RTCPeerConnection;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

export class WebRTCManager {
  private localStream: MediaStream | null = null;
  private peerConnections: PeerConnectionMap = {};
  private onRemoteStreamCallback: ((peerId: string, stream: MediaStream) => void) | null = null;
  private onIceCandidateCallback: ((peerId: string, candidate: RTCIceCandidate) => void) | null = null;
  private ws: WebSocket | null = null;

  constructor(
    onRemoteStream?: (peerId: string, stream: MediaStream) => void,
    ws?: WebSocket
  ) {
    if (onRemoteStream) this.onRemoteStreamCallback = onRemoteStream;
    if (ws) this.ws = ws;
  }

  public setCallbacks(
    onRemoteStream: (peerId: string, stream: MediaStream) => void,
    onIceCandidate: (peerId: string, candidate: RTCIceCandidate) => void
  ) {
    this.onRemoteStreamCallback = onRemoteStream;
    this.onIceCandidateCallback = onIceCandidate;
  }

  public async handleSignal(senderId: string, signal: any) {
    if (signal.offer) {
      const answer = await this.handleOffer(senderId, signal.offer);
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'SIGNAL', targetId: senderId, signal: { answer } }));
      }
    } else if (signal.answer) {
      await this.handleAnswer(senderId, signal.answer);
    } else if (signal.candidate) {
      await this.handleCandidate(senderId, signal.candidate);
    }
  }

  public createPeerConnection(peerId: string): RTCPeerConnection {
    if (this.peerConnections[peerId]) {
      return this.peerConnections[peerId];
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    this.peerConnections[peerId] = pc;

    // Add local tracks if available
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && this.onIceCandidateCallback) {
        this.onIceCandidateCallback(peerId, event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0] && this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(peerId, event.streams[0]);
      }
    };

    return pc;
  }

  public async createOffer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const pc = this.createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }

  public async handleOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const pc = this.createPeerConnection(peerId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }

  public async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit) {
    const pc = this.peerConnections[peerId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  public async handleCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peerConnections[peerId];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  public toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  public toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  public closePeerConnection(peerId: string) {
    if (this.peerConnections[peerId]) {
      this.peerConnections[peerId].close();
      delete this.peerConnections[peerId];
    }
  }

  public removePeerConnection(peerId: string) {
    this.closePeerConnection(peerId);
  }

  public closeAll() {
    this.stopAll();
  }

  public stopAll() {
    Object.keys(this.peerConnections).forEach((peerId) => {
      this.closePeerConnection(peerId);
    });
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
  }
}
