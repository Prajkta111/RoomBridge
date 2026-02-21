import { useState, useEffect, useRef } from "react";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import { Loader2, Send, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { listUserChats, setupChatListener, sendMessage, getChatSession } from "@/lib/firebase/chats";
import { getUser } from "@/lib/firebase/users";
import { ChatSessionDocument, MessageDocument, UserDocument } from "@/lib/firebase/types";
import { UserProfileModal } from "@/components/UserProfileModal";

interface ChatWithUser extends ChatSessionDocument {
  otherUser?: UserDocument;
  lastMessage?: string;
  unreadCount?: number;
}

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetChatId = searchParams.get("chat");
  const [chats, setChats] = useState<ChatWithUser[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatWithUser | null>(null);
  const [messages, setMessages] = useState<MessageDocument[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user's chats
  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      try {
        const userChats = await listUserChats(user.uid);
        
        // Fetch other user data for each chat
        const chatsWithUsers = await Promise.all(
          userChats.map(async (chat) => {
            const otherUserId = chat.participant_ids.find(id => id !== user.uid);
            if (!otherUserId) return chat;
            
            const otherUser = await getUser(otherUserId);
            return {
              ...chat,
              otherUser: otherUser || undefined,
            };
          })
        );

        setChats(chatsWithUsers);

        // Auto-select chat from URL param
        if (targetChatId) {
          const target = chatsWithUsers.find(c => c.chat_id === targetChatId);
          if (target) {
            setSelectedChat(target);
          } else {
            // Chat exists but isn't listed yet (just created) — fetch it directly
            const freshChat = await getChatSession(targetChatId);
            if (freshChat) {
              const otherUserId = freshChat.participant_ids.find(id => id !== user.uid);
              const otherUser = otherUserId ? await getUser(otherUserId) : undefined;
              const chatWithUser: ChatWithUser = { ...freshChat, otherUser: otherUser || undefined };
              setChats(prev => [chatWithUser, ...prev]);
              setSelectedChat(chatWithUser);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading chats:", error);
        setLoading(false);
      }
    };

    loadChats();
  }, [user]);

  // Set up real-time listener for selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const unsubscribe = setupChatListener(selectedChat.chat_id, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [selectedChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat || !user) return;

    setSending(true);
    try {
      await sendMessage(selectedChat.chat_id, user.uid, messageText.trim());
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const filteredChats = chats.filter(chat => 
    chat.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UserDashboardLayout>
      <div className="h-[calc(100vh-8rem)]">
        <div className="grid lg:grid-cols-[380px_1fr] gap-6 h-full">
          {/* Conversations List */}
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}

              {!loading && filteredChats.length === 0 && (
                <div className="text-center py-12 px-4">
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "No conversations found" : "No messages yet"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start chatting with room owners or seekers
                  </p>
                </div>
              )}

              {!loading && filteredChats.map((chat) => (
                <button
                  key={chat.chat_id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border/50 ${
                    selectedChat?.chat_id === chat.chat_id ? "bg-accent" : ""
                  }`}
                >
                  {chat.otherUser?.selfie_url ? (
                    <img
                      src={chat.otherUser.selfie_url}
                      alt={chat.otherUser.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-base font-bold flex-shrink-0">
                      {chat.otherUser?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {chat.otherUser?.name || "Unknown User"}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                        {getTimeAgo(chat.last_message_at)}
                      </span>
                    </div>
                    {chat.otherUser?.verification_badges && chat.otherUser.verification_badges.length > 0 && (
                      <span className="text-[10px] text-primary">✔ Verified</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden flex flex-col">
            {!selectedChat ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-brand/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a chat from the list to start messaging
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-5 border-b border-border flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setProfileUserId(
                      selectedChat.participant_ids.find((id) => id !== user?.uid) || null
                    )}
                    className="flex-shrink-0 hover:opacity-80 transition-opacity"
                  >
                    {selectedChat.otherUser?.selfie_url ? (
                      <img
                        src={selectedChat.otherUser.selfie_url}
                        alt={selectedChat.otherUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-base font-bold">
                        {selectedChat.otherUser?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </button>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => setProfileUserId(
                        selectedChat.participant_ids.find((id) => id !== user?.uid) || null
                      )}
                      className="font-display font-bold text-base text-foreground hover:text-primary transition-colors text-left"
                    >
                      {selectedChat.otherUser?.name || "Unknown User"}
                    </button>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {selectedChat.otherUser?.verification_badges && selectedChat.otherUser.verification_badges.length > 0 && (
                        <span className="text-primary">✔ Verified</span>
                      )}
                      {selectedChat.otherUser?.profile_type && (
                        <span>• {selectedChat.otherUser.profile_type}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-muted/20">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No messages yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Start the conversation!</p>
                    </div>
                  )}

                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.uid;
                    return (
                      <div key={msg.message_id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] ${isOwn ? "order-2" : "order-1"}`}>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              isOwn
                                ? "bg-gradient-action text-primary-foreground rounded-tr-sm"
                                : "bg-card border border-border text-foreground rounded-tl-sm"
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                          </div>
                          <span
                            className={`text-[10px] text-muted-foreground block mt-1 ${
                              isOwn ? "text-right" : "text-left"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-5 border-t border-border flex gap-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1 px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="px-6 py-3 rounded-xl bg-gradient-action text-primary-foreground text-sm font-semibold shadow-action hover:shadow-action-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <UserProfileModal
        userId={profileUserId}
        open={!!profileUserId}
        onOpenChange={(open) => !open && setProfileUserId(null)}
      />
    </UserDashboardLayout>
  );
};

export default Messages;

