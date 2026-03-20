'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages([{ role: 'assistant', content: data.message }]);
      }
    } catch {
      setMessages([{ role: 'assistant', content: "Hi there. I'm here to learn a bit about what you're looking for before connecting you with an agent. What's your name?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || isComplete) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong on my end. Give it another try in a moment.' }]);
        return;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);

      if (data.intakeComplete && data.intakeData) {
        setIsComplete(true);
        await fetch('/api/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.intakeData),
        });
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong on my end. Give it another try in a moment.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const canSend = !isLoading && !isComplete && input.trim().length > 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '520px',
      width: '100%',
      background: '#0F2035',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: '#0F2035',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(137,207,240,0.1)',
        flexShrink: 0,
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: '#89CFF0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0A1A2E',
          fontWeight: 700,
          fontSize: '15px',
          flexShrink: 0,
          fontFamily: 'Inter, sans-serif',
        }}>I</div>
        <div>
          <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>
            Intake AI
          </div>
          <div style={{ color: '#89CFF0', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
            {isComplete ? 'Conversation complete' : isLoading ? 'Typing...' : 'Online'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: '#0A1A2E',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '78%',
              padding: '11px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? '#89CFF0' : '#1a2a3a',
              color: msg.role === 'user' ? '#0A1A2E' : '#FFFFFF',
              fontSize: '15px',
              lineHeight: '1.55',
              fontFamily: 'Inter, sans-serif',
              fontWeight: msg.role === 'user' ? 500 : 400,
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && messages.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 18px',
              borderRadius: '18px 18px 18px 4px',
              background: '#1a2a3a',
              display: 'flex',
              gap: '5px',
              alignItems: 'center',
              height: '42px',
            }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#89CFF0',
                  opacity: 0.7,
                  animation: 'widgetBounce 1.2s ease-in-out infinite',
                  animationDelay: `${j * 0.18}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '14px 20px',
        background: '#0F2035',
        borderTop: '1px solid rgba(137,207,240,0.2)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || isComplete}
          placeholder={isComplete ? 'An agent will be in touch shortly' : 'Type a message...'}
          style={{
            flex: 1,
            padding: '11px 16px',
            borderRadius: '24px',
            border: '1px solid rgba(137,207,240,0.2)',
            fontSize: '15px',
            outline: 'none',
            background: '#0A1A2E',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!canSend}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: canSend ? '#89CFF0' : 'rgba(137,207,240,0.15)',
            border: 'none',
            cursor: canSend ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 200ms ease',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={canSend ? '#0A1A2E' : '#4a6a8a'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes widgetBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
