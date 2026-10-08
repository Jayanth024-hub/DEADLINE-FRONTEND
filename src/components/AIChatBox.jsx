import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Trash2 } from 'lucide-react';
import { chatService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AIChatBox({ compact = false }) {
  const { user } = useAuth();
  const userId = user?.id || null;
  const conversationId = userId ? `conv-user-${userId}` : 'conv-guest';
  const storageKey = userId ? `deadlineiq_chat_user_${userId}` : 'deadlineiq_chat_guest';

  const defaultGreeting = {
    role: 'ai',
    content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am your personal DeadlineIQ AI Assistant. I can help analyze your course deadlines, project milestones, study schedules, and career drives.`
  };

  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [defaultGreeting];
    } catch {
      return [defaultGreeting];
    }
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatScrollRef = useRef(null);

  // When user changes, reload user-specific chat history
  useEffect(() => {
    let isCurrent = true;

    async function loadUserHistory() {
      // 1. Try local storage for this user first
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          } else {
            setMessages([defaultGreeting]);
          }
        } else {
          setMessages([defaultGreeting]);
        }
      } catch {
        setMessages([defaultGreeting]);
      }

      // 2. Fetch persisted conversation history from Spring Boot backend MySQL
      if (userId) {
        try {
          const history = await chatService.getConversationHistory(conversationId, userId);
          if (isCurrent && Array.isArray(history) && history.length > 0) {
            const formatted = history.map(item => ({
              role: (item.sender === 'USER' || item.role === 'user') ? 'user' : 'ai',
              content: item.messageText || item.content || item.message || ''
            }));
            setMessages(formatted);
            localStorage.setItem(storageKey, JSON.stringify(formatted));
          }
        } catch (e) {
          // Backend or network error, fallback to local storage
        }
      }
    }

    loadUserHistory();

    return () => {
      isCurrent = false;
    };
  }, [userId, conversationId, storageKey]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, storageKey, loading]);

  const handleSend = async (textToSend) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    const userMsg = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await chatService.sendMessage(prompt, conversationId, userId);
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: err.message?.includes('Authentication') 
          ? 'Session expired. Please log in to continue using your AI assistant.'
          : 'I could not reach the server right now, but your academic deadlines are saved and on track!' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = async () => {
    const initial = [
      {
        role: 'ai',
        content: `Chat history cleared for ${user?.name || 'your account'}. How can I assist you today?`
      }
    ];
    setMessages(initial);
    localStorage.setItem(storageKey, JSON.stringify(initial));

    if (userId) {
      await chatService.clearConversation(conversationId, userId);
    }
  };

  const promptSuggestions = [
    'What deadlines do I have this week?',
    'Show top internship opportunities',
    'Generate an optimized study schedule'
  ];

  return (
    <div className="ai-chat-main" style={{ height: compact ? '420px' : '100%' }}>
      <div className="ai-chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #0284c7, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>
              DeadlineIQ AI Copilot
            </h4>
            <div style={{ fontSize: '11px', color: 'var(--emerald-green)', fontWeight: 600 }}>
              • User Isolated ({user?.name || 'Active Session'})
            </div>
          </div>
        </div>

        <button 
          className="saas-btn saas-btn-secondary saas-btn-sm" 
          onClick={clearChat}
          title="Clear Conversation for this Account"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="ai-messages-scroll" ref={chatScrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-msg-row ${msg.role}`}>
            <div className={`ai-msg-avatar ${msg.role}`}>
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="ai-msg-bubble" style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="ai-msg-row ai">
            <div className="ai-msg-avatar ai"><Bot size={16} /></div>
            <div className="ai-msg-bubble" style={{ color: 'var(--text-muted)' }}>
              Analyzing academic records with Gemini...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-input-bar-wrap">
        <div className="ai-suggestions-row">
          {promptSuggestions.map((s, idx) => (
            <button key={idx} className="ai-suggestion-chip" onClick={() => handleSend(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="ai-input-form">
          <input
            type="text"
            className="saas-input"
            placeholder="Ask about deadlines, exams, internships, or courses..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button 
            className="saas-btn saas-btn-primary" 
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
