import { useState, useRef, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import DashboardOverview from "./components/DashboardOverview";
import DeadlinesView from "./components/DeadlinesView";
import OpportunitiesView from "./components/OpportunitiesView";
import CalendarView from "./components/CalendarView";
import AddDeadlineModal from "./components/AddDeadlineModal";
import AddOpportunityModal from "./components/AddOpportunityModal";
import ProfileModal from "./components/ProfileModal";
import SystemWorkflowModal from "./components/SystemWorkflowModal";
import AuthModal from "./components/AuthModal";
import FacultyView from "./components/FacultyView";
import CoordinatorView from "./components/CoordinatorView";
import DeanView from "./components/DeanView";
import AdminView from "./components/AdminView";
import { DEMO_USERS } from "./data/mockData";

// Helper for resilient API calls with fallback to direct localhost:8080
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, options);
    return res;
  } catch (err) {
    if (!endpoint.startsWith("http")) {
      return await fetch(`http://localhost:8080${endpoint}`, options);
    }
    throw err;
  }
}

function App() {
  // =========================================================
  // VIEW MODE: "chat" (AI RAG Studio) vs "dashboard" (Academic Command Center)
  // =========================================================
  const [currentView, setCurrentView] = useState("chat");

  // =========================================================
  // CONVERSATION ID (Stored in localStorage across browser reloads)
  // =========================================================
  const [conversationId, setConversationId] = useState(() => {
    let id = localStorage.getItem("conversationId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("conversationId", id);
    }
    return id;
  });

  // =========================================================
  // CHAT STATE
  // =========================================================
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ragActive, setRagActive] = useState(false);

  // =========================================================
  // PDF STATE
  // =========================================================
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // =========================================================
  // DEADLINEIQ COMMAND CENTER STATE
  // =========================================================
  const [activeTab, setActiveTab] = useState("overview");
  const [currentUser, setCurrentUser] = useState(DEMO_USERS.STUDENT);
  const [showAddDeadlineModal, setShowAddDeadlineModal] = useState(false);
  const [showAddOpportunityModal, setShowAddOpportunityModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Operating Systems Assignment 2 Due", time: "Tomorrow, 11:59 PM", unread: true },
    { id: 2, title: "Google Summer Internship Drive Open", time: "Oct 15, 2026", unread: true }
  ]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Check RAG status on startup
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await apiFetch("/api/rag/status");
        if (res.ok) {
          const data = await res.json();
          if (data.ragEnabled) {
            setRagActive(true);
          }
        }
      } catch (e) {
        // Backend might still be starting
      }
    };
    checkStatus();
  }, []);

  // Load conversation history from MySQL memory on startup
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!conversationId) return;
      try {
        const res = await apiFetch(`/api/chat/history/${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setMessages(
              data.map((m) => ({
                role: m.role?.toLowerCase() === "user" ? "user" : "ai",
                content: m.content,
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Could not load stored conversation history from database:", err);
      }
    };

    loadConversationHistory();
  }, [conversationId]);

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  // =========================================================
  // START NEW CHAT CONVERSATION
  // =========================================================
  const startNewConversation = () => {
    const newId = crypto.randomUUID();
    localStorage.setItem("conversationId", newId);
    setConversationId(newId);
    setMessages([]);
    setMessage("");
    setSelectedFile(null);
    setUploadStatus("");
  };

  // =========================================================
  // SEND MESSAGE (Spring AI + Gemini + MySQL Memory + RAG)
  // =========================================================
  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    // Show user message immediately
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    // Clear input
    setMessage("");

    // Start loading
    setLoading(true);

    try {
      // Use RAG chat endpoint (which handles normal chat + RAG + memory persistence)
      const res = await apiFetch("/api/rag/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId: conversationId,
        }),
      });

      // Backend returns String
      const data = await res.text();

      if (!res.ok) {
        throw new Error(data);
      }

      // Add AI response
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "ai",
          content: data,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "ai",
          content:
            error.message ||
            "Something went wrong. Please check whether the Spring Boot server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ENTER TO SEND, SHIFT + ENTER = NEW LINE
  // =========================================================
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // =========================================================
  // PDF UPLOAD (Spring AI + PDFBox + Chunks + Pinecone)
  // =========================================================
  const uploadDocument = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a PDF.");
      return;
    }

    // Check PDF
    if (selectedFile.type !== "application/pdf") {
      setUploadStatus("Only PDF files are allowed.");
      return;
    }

    setUploading(true);
    setUploadStatus("Uploading PDF...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // =====================================================
      // SPRING BOOT PDF UPLOAD ENDPOINT
      // =====================================================
      const res = await apiFetch("/api/rag/upload", {
        method: "POST",
        body: formData,
      });

      // Backend returns String
      const data = await res.text();

      if (!res.ok) {
        throw new Error(data);
      }

      setUploadStatus(data);
      setRagActive(true);
    } catch (error) {
      console.error(error);

      setUploadStatus(
        error.message || "Upload failed. Please check the backend."
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // RENDER: ACADEMIC COMMAND CENTER VIEW
  // =========================================================
  if (currentView === "dashboard") {
    return (
      <div className="deadlineiq-root">
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === "ai-studio") {
              setCurrentView("chat");
            } else {
              setActiveTab(tab);
            }
          }}
          onOpenAddModal={() => setShowAddDeadlineModal(true)}
          notifications={notifications}
          onMarkNotificationRead={(id) => {
            setNotifications(notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)));
          }}
          user={currentUser}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenWorkflowModal={() => setShowWorkflowModal(true)}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onLogout={() => setCurrentUser(DEMO_USERS.STUDENT)}
          onNavigate={(view) => setCurrentView(view)}
        />

        <div className="dashboard-view-switcher-bar">
          <div className="container view-switcher-inner">
            <span className="view-mode-badge">
              Active Mode: <strong>Academic Command Center</strong>
            </span>
            <button
              className="switch-to-rag-btn"
              onClick={() => setCurrentView("chat")}
            >
              🤖 Switch to AI Chatbot + RAG Studio
            </button>
          </div>
        </div>

        <main className="main-content-area container">
          {currentUser.role === "FACULTY" && <FacultyView user={currentUser} />}
          {currentUser.role === "COORDINATOR" && <CoordinatorView user={currentUser} />}
          {currentUser.role === "DEAN" && <DeanView user={currentUser} />}
          {currentUser.role === "ADMINISTRATOR" && <AdminView user={currentUser} />}
          {currentUser.role === "STUDENT" && (
            <>
              {activeTab === "overview" && (
                <DashboardOverview
                  user={currentUser}
                  onNavigateTab={(tab) => {
                    if (tab === "ai-studio") setCurrentView("chat");
                    else setActiveTab(tab);
                  }}
                  onOpenAddModal={() => setShowAddDeadlineModal(true)}
                />
              )}
              {activeTab === "deadlines" && (
                <DeadlinesView
                  user={currentUser}
                  onOpenAddModal={() => setShowAddDeadlineModal(true)}
                />
              )}
              {activeTab === "opportunities" && (
                <OpportunitiesView
                  user={currentUser}
                  onOpenAddModal={() => setShowAddOpportunityModal(true)}
                />
              )}
              {activeTab === "calendar" && <CalendarView user={currentUser} />}
            </>
          )}
        </main>

        {showAddDeadlineModal && (
          <AddDeadlineModal onClose={() => setShowAddDeadlineModal(false)} />
        )}
        {showAddOpportunityModal && (
          <AddOpportunityModal onClose={() => setShowAddOpportunityModal(false)} />
        )}
        {showProfileModal && (
          <ProfileModal
            user={currentUser}
            onClose={() => setShowProfileModal(false)}
            onSaveProfile={(updated) => setCurrentUser(updated)}
          />
        )}
        {showWorkflowModal && (
          <SystemWorkflowModal onClose={() => setShowWorkflowModal(false)} />
        )}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={(loggedUser) => {
              setCurrentUser(loggedUser);
              setShowAuthModal(false);
            }}
          />
        )}
      </div>
    );
  }

  // =========================================================
  // RENDER: AI CHATBOT + MEMORY + RAG STUDIO VIEW (Default)
  // Exact UI and Architecture from Spring AI + Chatbot + RAG
  // =========================================================
  return (
    <div className="app">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">AI</div>
          <div>
            <h2>AI Chatbot</h2>
            <span>Gemini Assistant</span>
          </div>
        </div>

        {/* View Switcher: Easy toggle between AI Chatbot and DeadlineIQ Academic Portal */}
        <div className="portal-switch-card">
          <span className="portal-label">PROJECT WORKSPACE</span>
          <button
            type="button"
            className="portal-nav-button"
            onClick={() => setCurrentView("dashboard")}
            title="Open DeadlineIQ Academic Command Center"
          >
            📊 Open Academic Command Center
          </button>
        </div>

        <div className="sidebar-section">
          <div className="section-title-row">
            <p className="section-title">CONVERSATION</p>
            <button
              type="button"
              className="new-chat-pill-btn"
              onClick={startNewConversation}
              title="Start a new conversation"
            >
              + New Chat
            </button>
          </div>

          <div className="conversation-card">
            <div className="conversation-icon">💬</div>
            <div className="conversation-info">
              <strong>Current Chat</strong>
              <span>
                {messages.length} message
                {messages.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="sidebar-section conversation-details">
          <p className="section-title">MEMORY</p>
          <div className="memory-box">
            <div className="memory-status">
              <span className="status-dot"></span>
              Memory Active
            </div>
            <p>
              This conversation is stored using your Spring Boot + MySQL memory.
            </p>
          </div>
        </div>

        {ragActive && (
          <div className="sidebar-section">
            <p className="section-title">RAG STATUS</p>
            <div className="rag-active-box">
              <span className="rag-dot"></span>
              <span>Pinecone RAG Active</span>
            </div>
          </div>
        )}

        <div className="sidebar-bottom">
          <p>Spring Boot</p>
          <p>Spring AI + Gemini</p>
          <p>MySQL Memory</p>
          <p>Pinecone RAG</p>
        </div>
      </aside>

      {/* =====================================================
          MAIN CHAT
      ====================================================== */}
      <main className="chat-panel">
        {/* HEADER */}
        <header className="chat-header">
          <div>
            <h1>AI Assistant</h1>
            <p>Ask anything and continue your conversation</p>
          </div>

          <div className="header-status-group">
            {ragActive && (
              <div className="rag-badge">
                <span>📚</span> PDF Document Ready
              </div>
            )}
            <div className="online-status">
              <span></span>
              Online
            </div>
          </div>
        </header>

        {/* ===================================================
            MESSAGES
        ==================================================== */}
        <div className="messages-container">
          {messages.length === 0 && !loading ? (
            <div className="welcome">
              <div className="welcome-icon">✨</div>
              <h2>How can I help you?</h2>
              <p>Start a conversation with your AI assistant.</p>

              <div className="example-prompts">
                <button
                  type="button"
                  onClick={() => setMessage("Explain Spring Boot in simple words")}
                >
                  Explain Spring Boot
                </button>

                <button
                  type="button"
                  onClick={() => setMessage("What is dependency injection?")}
                >
                  Explain Dependency Injection
                </button>

                <button
                  type="button"
                  onClick={() => setMessage("Teach me Java 21")}
                >
                  Teach me Java 21
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMessage("What are the key deadlines and internship opportunities tracked in DeadlineIQ?")
                  }
                >
                  Review Academic Deadlines
                </button>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-row ${
                    msg.role === "user" ? "user-row" : "ai-row"
                  }`}
                >
                  <div
                    className={`message-avatar ${
                      msg.role === "user" ? "user-avatar" : "ai-avatar"
                    }`}
                  >
                    {msg.role === "user" ? "You" : "AI"}
                  </div>

                  <div
                    className={`message-content ${
                      msg.role === "user" ? "user-message" : "ai-message"
                    }`}
                  >
                    <div className="message-label">
                      {msg.role === "user" ? "You" : "AI"}
                    </div>
                    <div className="message-text">{msg.content}</div>
                  </div>
                </div>
              ))}

              {/* AI THINKING */}
              {loading && (
                <div className="message-row ai-row">
                  <div className="message-avatar ai-avatar">AI</div>
                  <div className="message-content ai-message">
                    <div className="message-label">AI</div>
                    <div className="typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ===================================================
            INPUT AREA
        ==================================================== */}
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              rows={1}
              disabled={loading}
            />

            <div className="action-buttons">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setSelectedFile(file || null);
                  setUploadStatus("");
                }}
                className="hidden-file-input"
              />

              <button
                type="button"
                className="upload-button"
                onClick={selectedFile ? uploadDocument : triggerFilePicker}
                disabled={uploading}
                title={selectedFile ? "Click to upload selected PDF" : "Choose a PDF to index into Pinecone"}
              >
                {uploading
                  ? "Uploading..."
                  : selectedFile
                  ? "Upload PDF"
                  : "Upload"}
              </button>

              <button
                type="button"
                className="send-button"
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                title="Send message (Enter)"
              >
                {loading ? <span className="button-loader"></span> : "➤"}
              </button>
            </div>
          </div>

          <div className="upload-feedback-row">
            {selectedFile && !uploadStatus && (
              <span className="selected-file-pill">
                Selected: {selectedFile.name}
              </span>
            )}

            {uploadStatus && (
              <span
                className={`upload-status ${
                  uploading ? "uploading" : "success"
                }`}
              >
                {uploadStatus}
              </span>
            )}
          </div>

          <p className="input-hint">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
