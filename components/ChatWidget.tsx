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

  // Start conversation on mount
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
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setMessages([{ role: 'assistant', content: 'Welcome to Prestige Properties. I\'m here to help match you with your perfect home. May I start with your full name?' }]);
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
        setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, I\'m having trouble connecting. Please try again in a moment.' }]);
        return;
      }

      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages(prev => [...prev, assistantMessage]);

      if (data.intakeComplete && data.intakeData) {
        setIsComplete(true);
        // Send to intake API for scoring and email
        await fetch('/api/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.intakeData),
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, I\'m having trouble connecting. Please try again in a moment.' }]);
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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '520px',
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
      background: '#fff',
    }}>
      {/* Header */}
      <div style={{
        background: '#0A1628',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#C9A84C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-playfair)',
          color: '#0A1628',
          fontWeight: 700,
          fontSize: '16px',
        }}>P</div>
        <div>
          <div style={{ color: '#F8F6F1', fontWeight: 600, fontSize: '15px' }}>Prestige Concierge</div>
          <div style={{ color: '#C9A84C', fontSize: '12px' }}>
            {isComplete ? 'Intake complete' : isLoading ? 'Typing...' : 'Online — typically replies instantly'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: '#F8F6F1',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? '#0A1628' : '#fff',
              color: msg.role === 'user' ? '#F8F6F1' : '#0A1628',
              fontSize: '15px',
              lineHeight: '1.5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 20px',
              borderRadius: '18px 18px 18px 4px',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '20px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#C9A84C',
                    animation: 'bounce 1.2s infinite',
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 20px',
        background: '#fff',
        borderTop: '1px solid #E8E6E1',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || isComplete}
          placeholder={isComplete ? 'Chat complete — an agent will be in touch shortly' : 'Type your message...'}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: '1px solid #E8E6E1',
            fontSize: '15px',
            outline: 'none',
            background: isComplete ? '#f5f5f5' : '#fff',
            color: '#0A1628',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || isComplete || !input.trim()}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: (isLoading || isComplete || !input.trim()) ? '#E8E6E1' : '#C9A84C',
            border: 'none',
            cursor: (isLoading || isComplete || !input.trim()) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isLoading || isComplete || !input.trim() ? '#999' : '#0A1628'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}
