import React, { useEffect, useRef, useState } from 'react';
import { Bot, RotateCcw, Send, Sparkles, Upload, User as UserIcon } from 'lucide-react';

function createConversationId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `conversation-${Date.now()}`;
}

export default function AiChatView({ user, initialPrompt = '' }) {
  const conversationStorageKey = `deadlineiq_conversation_${user?.email || user?.id || 'anonymous'}`;
  const [conversationId, setConversationId] = useState(() => {
    try {
      const id = localStorage.getItem(conversationStorageKey);
      if (id) return id;
      const newId = createConversationId();
      localStorage.setItem(conversationStorageKey, newId);
      return newId;
    } catch {
      return createConversationId();
    }
  });
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [ragActive, setRagActive] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) setInputValue(initialPrompt);
  }, [initialPrompt]);

  const addAssistantMessage = (text) => {
    setMessages((current) => [
      ...current,
      { id: createConversationId(), role: 'assistant', text },
    ]);
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const message = inputValue.trim();
    if (!message || isLoading) return;

    setMessages((current) => [
      ...current,
      { id: createConversationId(), role: 'user', text: message },
    ]);
    setInputValue('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(ragActive ? '/api/rag/chat' : '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationId }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || `Chat request failed (${response.status}).`);
      }

      const contentType = response.headers.get('content-type') || '';
      const answer = contentType.includes('application/json')
        ? (await response.json()).response
        : await response.text();

      if (typeof answer !== 'string' || !answer.trim()) {
        throw new Error('The chat service returned an empty response.');
      }

      addAssistantMessage(answer);
    } catch (requestError) {
      console.error('Chat request failed:', requestError);
      setError(requestError.message || 'Unable to reach the chat service.');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile) {
      setUploadStatus('Choose a PDF file first.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await fetch('/api/rag/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.text();
      if (!response.ok) throw new Error(result || `PDF upload failed (${response.status}).`);

      setRagActive(true);
      setUploadStatus(result);
      addAssistantMessage(`PDF added to document search. ${result}`);
    } catch (uploadError) {
      console.error('PDF upload failed:', uploadError);
      setUploadStatus(uploadError.message || 'Unable to upload the PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  const startNewConversation = () => {
    const newId = createConversationId();
    setConversationId(newId);
    setMessages([]);
    setError('');
    setInputValue('');
    try {
      localStorage.setItem(conversationStorageKey, newId);
    } catch (storageError) {
      console.error('Unable to save the new conversation ID:', storageError);
    }
  };

  return (
    <section className="chat-app animate-fade-in" aria-labelledby="chat-title">
      <header className="chat-app-header">
        <div className="chat-app-brand">
          <div className="chat-app-icon" aria-hidden="true"><Sparkles size={21} /></div>
          <div>
            <h1 id="chat-title">AI Chatbot</h1>
            <p>Ask a question and continue the conversation anytime.</p>
          </div>
        </div>
        <button className="chat-reset-button" type="button" onClick={startNewConversation}>
          <RotateCcw size={16} />
          New chat
        </button>
      </header>

      <div className="chat-app-card">
        <div className="chat-message-list" aria-live="polite">
          {messages.length === 0 && (
            <div className="chat-empty-state">
              <div className="chat-empty-icon"><Bot size={25} /></div>
              <h2>Hi{user?.name ? `, ${user.name}` : ''}. What can I help with?</h2>
              <p>Your conversation is saved so the assistant can use earlier messages as context.</p>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <article
                className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-assistant'}`}
                key={message.id}
              >
                <span className="chat-message-avatar" aria-hidden="true">
                  {isUser ? <UserIcon size={16} /> : <Bot size={17} />}
                </span>
                <div className="chat-message-content">
                  <span className="chat-message-author">{isUser ? user?.name || 'You' : 'AI assistant'}</span>
                  <p>{message.text}</p>
                </div>
              </article>
            );
          })}

          {isLoading && (
            <div className="chat-progress" role="status">
              <span className="chat-spinner" />
              Thinking…
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <p className="chat-error" role="alert">{error}</p>}

        <form className="chat-compose" onSubmit={sendMessage}>
          <label className="visually-hidden" htmlFor="chat-message">Your message</label>
          <textarea
            id="chat-message"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Ask something…"
            rows={3}
            disabled={isLoading}
          />
          <div className="chat-compose-actions">
            <span>Enter to send · Shift+Enter for a new line</span>
            <button type="submit" disabled={isLoading || !inputValue.trim()}>
              <Send size={16} />
              {isLoading ? 'Thinking…' : 'Send'}
            </button>
          </div>
        </form>
      </div>

      <details className="chat-document-panel">
        <summary>{ragActive ? 'PDF search is active' : 'Optional: ask questions about a PDF'}</summary>
        <div className="chat-document-controls">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            aria-label="Choose a PDF"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setSelectedFile(file);
              setUploadStatus(file ? `Selected: ${file.name}` : '');
            }}
          />
          <button type="button" onClick={uploadDocument} disabled={!selectedFile || isUploading}>
            <Upload size={15} />
            {isUploading ? 'Uploading…' : 'Upload PDF'}
          </button>
          {uploadStatus && <p role="status">{uploadStatus}</p>}
        </div>
      </details>

      <style>{`
        .chat-app {
          --chat-ink: #14253d;
          --chat-muted: #62748b;
          --chat-border: #dce5ef;
          --chat-primary: #155eef;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: min(100%, 900px);
          min-height: calc(100vh - 150px);
          margin: 0 auto;
          padding: 1.5rem 0 2rem;
          color: var(--chat-ink);
        }
        .chat-app-header, .chat-app-brand, .chat-reset-button, .chat-compose-actions,
        .chat-document-controls, .chat-document-controls button {
          display: flex;
          align-items: center;
        }
        .chat-app-header { justify-content: space-between; gap: 1rem; }
        .chat-app-brand { gap: .85rem; }
        .chat-app-icon, .chat-empty-icon {
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(135deg, #155eef, #7c3aed);
          border-radius: 13px;
        }
        .chat-app-icon { width: 44px; height: 44px; }
        .chat-app-header h1 { font-size: 1.35rem; }
        .chat-app-header p, .chat-empty-state p { color: var(--chat-muted); font-size: .88rem; }
        .chat-reset-button {
          gap: .45rem;
          padding: .65rem .85rem;
          color: var(--chat-ink);
          background: white;
          border: 1px solid var(--chat-border);
          border-radius: 9px;
          cursor: pointer;
        }
        .chat-app-card {
          display: flex;
          flex: 1;
          min-height: 460px;
          flex-direction: column;
          overflow: hidden;
          background: white;
          border: 1px solid var(--chat-border);
          border-radius: 16px;
          box-shadow: 0 14px 40px rgba(15, 35, 65, .07);
        }
        .chat-message-list {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 1.1rem;
          overflow-y: auto;
          padding: 1.5rem;
        }
        .chat-empty-state { margin: auto; max-width: 440px; text-align: center; }
        .chat-empty-icon { width: 50px; height: 50px; margin: 0 auto 1rem; }
        .chat-empty-state h2 { margin-bottom: .45rem; font-size: 1.15rem; }
        .chat-message { display: flex; align-items: flex-start; gap: .7rem; max-width: 85%; }
        .chat-message-user { align-self: flex-end; flex-direction: row-reverse; }
        .chat-message-avatar {
          display: grid;
          flex: 0 0 32px;
          width: 32px;
          height: 32px;
          place-items: center;
          color: #155eef;
          background: #edf4ff;
          border-radius: 50%;
        }
        .chat-message-assistant .chat-message-avatar { color: white; background: #155eef; }
        .chat-message-content { padding: .75rem .9rem; background: #f4f7fb; border-radius: 12px; }
        .chat-message-assistant .chat-message-content { background: #f8fafc; }
        .chat-message-author { display: block; margin-bottom: .25rem; color: var(--chat-muted); font-size: .72rem; font-weight: 700; }
        .chat-message-content p { color: var(--chat-ink); white-space: pre-wrap; overflow-wrap: anywhere; }
        .chat-progress { display: flex; align-items: center; gap: .55rem; color: var(--chat-muted); font-size: .85rem; }
        .chat-spinner { width: 15px; height: 15px; border: 2px solid #d5dfec; border-top-color: var(--chat-primary); border-radius: 50%; animation: chat-spin .8s linear infinite; }
        .chat-error { margin: 0 1.25rem .75rem; padding: .7rem .85rem; color: #9a3412; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 9px; font-size: .85rem; }
        .chat-compose { padding: 1rem 1.15rem; border-top: 1px solid var(--chat-border); }
        .chat-compose textarea {
          display: block;
          width: 100%;
          min-height: 82px;
          padding: .8rem .9rem;
          resize: vertical;
          color: var(--chat-ink);
          background: #fbfcfe;
          border: 1px solid var(--chat-border);
          border-radius: 10px;
          outline: none;
        }
        .chat-compose textarea:focus { border-color: var(--chat-primary); box-shadow: 0 0 0 3px rgba(21, 94, 239, .12); }
        .chat-compose-actions { justify-content: space-between; gap: .75rem; margin-top: .7rem; }
        .chat-compose-actions span { color: var(--chat-muted); font-size: .75rem; }
        .chat-compose-actions button, .chat-document-controls button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .45rem;
          padding: .65rem 1rem;
          color: white;
          background: #111827;
          border: 0;
          border-radius: 9px;
          cursor: pointer;
        }
        .chat-compose-actions button:disabled, .chat-document-controls button:disabled { opacity: .55; cursor: not-allowed; }
        .chat-document-panel { padding: .9rem 1rem; color: var(--chat-muted); background: white; border: 1px solid var(--chat-border); border-radius: 12px; font-size: .85rem; }
        .chat-document-panel summary { cursor: pointer; font-weight: 600; color: var(--chat-ink); }
        .chat-document-controls { flex-wrap: wrap; gap: .7rem; margin-top: .9rem; }
        .chat-document-controls input { max-width: 100%; }
        .chat-document-controls button { padding: .55rem .8rem; }
        .chat-document-controls p { flex-basis: 100%; color: var(--chat-muted); overflow-wrap: anywhere; }
        .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
        @keyframes chat-spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .chat-app { min-height: calc(100vh - 115px); padding-top: .75rem; }
          .chat-app-header { align-items: flex-start; }
          .chat-app-header p { max-width: 230px; }
          .chat-reset-button { flex-shrink: 0; }
          .chat-message { max-width: 100%; }
          .chat-message-list { padding: 1rem; }
          .chat-compose-actions span { max-width: 170px; }
        }
      `}</style>
    </section>
  );
}
