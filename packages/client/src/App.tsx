import React, { useState, useEffect } from 'react';
import { GameRoomState, CardCategory } from '@boshpana/shared';
import { useTelegram } from './hooks/useTelegram';
import { LocalGameEngine } from './services/localGameEngine';
import { JoinCreateView } from './components/lobby/JoinCreateView';
import { LobbyView } from './components/lobby/LobbyView';
import { GameBoardView } from './components/game/GameBoardView';
import { DeckPrintView } from './components/export/DeckPrintView';
import { PassAndPlayView } from './components/passandplay/PassAndPlayView';
import { DeckStudioView } from './components/studio/DeckStudioView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { BrandIdentityView } from './components/studio/BrandIdentityView';

export const App: React.FC = () => {
  const { tgUser, startParam, triggerHaptic } = useTelegram();
  const [engine, setEngine] = useState<LocalGameEngine | null>(null);
  const [roomState, setRoomState] = useState<GameRoomState | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [initialRoomCode, setInitialRoomCode] = useState<string>('');
  const [isPrintViewOpen, setIsPrintViewOpen] = useState<boolean>(false);
  const [isPassAndPlayOpen, setIsPassAndPlayOpen] = useState<boolean>(false);
  const [isDeckStudioOpen, setIsDeckStudioOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isBrandIdentityOpen, setIsBrandIdentityOpen] = useState<boolean>(false);

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

  const handleSkipCurrent = () => {
    triggerHaptic('medium');
    engine?.skipCurrent();
  };

  const handleAcknowledgeEvent = () => {
    triggerHaptic('medium');
    engine?.acknowledgeEvent();
  };

  const handlePlayAgain = () => {
    triggerHaptic('success');
    if (roomState) {
      handleCreateRoom(roomState.players[myPlayerId]?.displayName || 'Omon Qoluvchi');
    }
  };

  if (isPrintViewOpen) {
    return <DeckPrintView onBack={() => setIsPrintViewOpen(false)} />;
  }

  if (isPassAndPlayOpen) {
    return <PassAndPlayView onExit={() => setIsPassAndPlayOpen(false)} />;
  }

  if (isDeckStudioOpen) {
    return <DeckStudioView onBack={() => setIsDeckStudioOpen(false)} />;
  }

  if (isLeaderboardOpen) {
    return <LeaderboardView playerName={tgUser.displayName} onBack={() => setIsLeaderboardOpen(false)} />;
  }

  if (isBrandIdentityOpen) {
    return <BrandIdentityView onBack={() => setIsBrandIdentityOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-bunker-950 text-slate-100 bunker-grid relative scanlines">
      {!roomState ? (
        <JoinCreateView
          initialName={tgUser.displayName}
          initialRoomCode={initialRoomCode}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onOpenPrintView={() => setIsPrintViewOpen(true)}
          onOpenPassAndPlay={() => setIsPassAndPlayOpen(true)}
          onOpenDeckStudio={() => setIsDeckStudioOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenBrandIdentity={() => setIsBrandIdentityOpen(true)}
        />
      ) : roomState.phase === 'LOBBY' ? (
        <LobbyView
          roomState={roomState}
          myPlayerId={myPlayerId}
          onUpdateSettings={(s) => engine?.updateSettings(s)}
          onToggleCardExclusion={(id) => engine?.toggleCardExclusion(id)}
          onAddDemoBot={() => engine?.addDemoBot()}
          onRemoveDemoBot={(botId) => engine?.removeDemoBot(botId)}
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
          onSkipCurrent={handleSkipCurrent}
          onStartRounds={handleStartRounds}
          onAcknowledgeEvent={handleAcknowledgeEvent}
          onContinueFromVoteResults={() => engine?.continueFromVoteResults()}
          onPlayAgain={handlePlayAgain}
          onLeaveGame={handleLeaveRoom}
        />
      )}
    </div>
  );
};
export default App;
