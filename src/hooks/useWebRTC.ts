import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

export const useWebRTC = (
  socket: Socket | null, 
  activeCallSid: string | undefined,
  isMuted: boolean,
  isSpeaker: boolean,
  isCaller: boolean = false
) => {
  const [micState, setMicState] = useState<'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR'>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const speakerRef = useRef(isSpeaker);
  
  // Track if we already created an offer to prevent StrictMode duplicate signaling
  const hasOffered = useRef(false);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);

  useEffect(() => {
    speakerRef.current = isSpeaker;
  }, [isSpeaker]);

  useEffect(() => {
    if (!socket || !activeCallSid) return;

    let mounted = true;

    const initWebRTC = async () => {
      try {
        setMicState('CONNECTING');
        console.log('Initializing Peer-to-Peer WebRTC...');
        
        // 1. Get Microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        localStreamRef.current = stream;

        // 2. Create RTCPeerConnection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
          ]
        });
        pcRef.current = pc;

        // Add local tracks to PC
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('webrtc_ice_candidate', {
              callSid: activeCallSid,
              candidate: event.candidate,
            });
          }
        };
        
        pc.oniceconnectionstatechange = () => {
          console.log(`ICE Connection State: ${pc.iceConnectionState}`);
        };

        // Handle Remote Audio Track
        pc.ontrack = (event) => {
          console.log('Received remote track', event.streams[0]);
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
          }
        };

        // 3. Initiate Call if caller
        if (isCaller && !hasOffered.current) {
          hasOffered.current = true;
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('webrtc_offer', {
            callSid: activeCallSid,
            offer: offer
          });
        }

        if (mounted) setMicState('CONNECTED');

      } catch (err: any) {
        console.error('WebRTC init error:', err);
        if (mounted) {
          setError(err.message);
          setMicState('ERROR');
        }
      }
    };

    initWebRTC();

    // 4. Socket Listeners for Signaling
    const handleOffer = async (data: any) => {
      if (data.callSid !== activeCallSid || isCaller) return;
      const pc = pcRef.current;
      if (!pc || pc.signalingState === 'closed') return;

      try {
        if (pc.signalingState !== 'stable') {
          console.warn('Ignoring offer: PC not stable');
          return;
        }
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        
        // Flush queued ICE candidates
        while (candidateQueue.current.length > 0) {
          const candidate = candidateQueue.current.shift();
          if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        socket.emit('webrtc_answer', {
          callSid: activeCallSid,
          answer: answer
        });
      } catch (err) {
        console.error('Error handling offer', err);
      }
    };

    const handleAnswer = async (data: any) => {
      if (data.callSid !== activeCallSid || !isCaller) return;
      const pc = pcRef.current;
      if (!pc || pc.signalingState === 'closed') return;

      try {
        if (pc.signalingState === 'stable') {
          console.warn('Ignoring duplicate answer: PC is already stable');
          return;
        }
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        
        // Flush queued ICE candidates
        while (candidateQueue.current.length > 0) {
          const candidate = candidateQueue.current.shift();
          if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Error handling answer', err);
      }
    };

    const handleIceCandidate = async (data: any) => {
      if (data.callSid !== activeCallSid) return;
      const pc = pcRef.current;
      if (!pc || pc.signalingState === 'closed') return;

      try {
        if (data.candidate) {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          } else {
            // Queue candidate until remote description is set
            candidateQueue.current.push(data.candidate);
          }
        }
      } catch (err) {
        console.error('Error adding ICE candidate', err);
      }
    };

    socket.on('webrtc_offer', handleOffer);
    socket.on('webrtc_answer', handleAnswer);
    socket.on('webrtc_ice_candidate', handleIceCandidate);

    return () => {
      mounted = false;
      hasOffered.current = false;
      socket.off('webrtc_offer', handleOffer);
      socket.off('webrtc_answer', handleAnswer);
      socket.off('webrtc_ice_candidate', handleIceCandidate);
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
      setRemoteStream(null);
    };
  }, [socket, activeCallSid, isCaller]);

  // Handle Microphone Mute
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  // Handle Speaker (Remote Audio Mute)
  useEffect(() => {
    if (!activeCallSid) return;
    const audioId = `remoteAudio_${activeCallSid}`;
    const audioEl = document.getElementById(audioId) as HTMLAudioElement;
    if (audioEl) {
      audioEl.muted = !isSpeaker;
    }
  }, [isSpeaker, activeCallSid]);

  return { micState, error, remoteStream };
};
