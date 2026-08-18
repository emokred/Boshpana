import React, { useState, useEffect } from 'react';
import { GameRoomState, CardCategory } from '@boshpana/shared';
import { useTelegram } from './hooks/useTelegram';
import { LocalGameEngine } from './services/localGameEngine';
import { JoinCreateView } from './components/lobby/JoinCreateView';
import { LobbyView } from './components/lobby/LobbyView';
import { GameBoardView } from './components/game/GameBoardView';

export const App: React.FC = () => {
  const { tgUser, startParam, triggerHaptic } = useTelegram();
  const [engine, setEngine] = useState<LocalGameEngine | null>(null);
  const [roomState, setRoomState] = useState<GameRoomState | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [initialRoomCode, setInitialRoomCode] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room') || startParam || '';
    if (roomFromUrl) {
      setInitialRoomCode(roomFromUrl);
    }
  }, [startParam]);

  const handleCreateRoom = (playerName: string) => {
    triggerHaptic('medium');
    const localEng = new LocalGameEngine(playerName, (newState) => {
      setRoomState(newState);
    });

    const hostId = Object.keys(localEng.getState().players)[0];
    setMyPlayerId(hostId);
    setEngine(localEng);
    setRoomState(localEng.getState());
  };

  const handleJoinRoom = (roomCode: string, playerName: string) => {
    triggerHaptic('medium');
    const localEng = new LocalGameEngine(playerName, (newState) => {
      setRoomState(newState);
    });
    const hostId = Object.keys(localEng.getState().players)[0];
    setMyPlayerId(hostId);
    setEngine(localEng);
    setRoomState(localEng.getState());
  };

  const handleLeaveRoom = () => {
    triggerHaptic('light');
    setEngine(null);
    setRoomState(null);
    setMyPlayerId('');
  };

  const handleStartGame = () => {
    triggerHaptic('heavy');
    engine?.startGame();
  };

  const handleStartRounds = () => {
    triggerHaptic('medium');
    engine?.startRoundsFromIntro();
  };

  const handleRevealCard = (category: CardCategory) => {
    triggerHaptic('success');
    engine?.revealCard(myPlayerId, category);
  };

  const handleEndTurn = () => {
    triggerHaptic('light');
    engine?.nextSpeaker();
  };

  const handleCastVote = (targetPlayerId: string) => {
    triggerHaptic('warning');
    engine?.castVote(myPlayerId, targetPlayerId);
  };

  const handleUseSpecial = (targetPlayerId?: string) => {
    triggerHaptic('heavy');
    alert("Maxsus qobiliyat ishga tushirildi!");
  };

  const handleSendChatMessage = (text: string) => {
    if (!roomState) return;
    const myPlayer = roomState.players[myPlayerId];
    engine?.addChatMessage({
      id: Math.random().toString(),
      senderId: myPlayerId,
      senderName: myPlayer?.displayName || 'Omon Qoluvchi',
      text,
      timestamp: Date.now()
    });
  };

  const handleSkipPhase = () => {
    triggerHaptic('medium');
    engine?.skipCurrentPhase();
  };

  const handlePlayAgain = () => {
    triggerHaptic('success');
    if (roomState) {
      handleCreateRoom(roomState.players[myPlayerId]?.displayName || 'Omon Qoluvchi');
    }
  };

  return (
    <div className="min-h-screen bg-bunker-950 text-slate-100 bunker-grid relative scanlines">
      {!roomState ? (
        <JoinCreateView
          initialName={tgUser.displayName}
          initialRoomCode={initialRoomCode}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      ) : roomState.phase === 'LOBBY' ? (
        <LobbyView
          roomState={roomState}
          myPlayerId={myPlayerId}
          onUpdateSettings={(s) => engine?.updateSettings(s)}
          onSetReady={(r) => engine?.setReady(myPlayerId, r)}
          onStartGame={handleStartGame}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : (
        <GameBoardView
          roomState={roomState}
          myPlayerId={myPlayerId}
          onRevealCard={handleRevealCard}
          onEndTurn={handleEndTurn}
          onCastVote={handleCastVote}
          onUseSpecial={handleUseSpecial}
          onSendChatMessage={handleSendChatMessage}
          onPauseToggle={() => engine?.toggleTimerPause()}
          onAdd30Sec={() => engine?.addTimerSeconds(30)}
          onSkipPhase={handleSkipPhase}
          onStartRounds={handleStartRounds}
          onPlayAgain={handlePlayAgain}
          onLeaveGame={handleLeaveRoom}
        />
      )}
    </div>
  );
};
export default App;
