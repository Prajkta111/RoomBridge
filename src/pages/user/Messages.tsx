import UserDashboardLayout from "@/components/UserDashboardLayout";

const conversations = [
  { id: 1, name: "Priya S.", lastMsg: "Is the room still available?", time: "2m ago", unread: 2, avatar: "P" },
  { id: 2, name: "Rahul K.", lastMsg: "I can visit tomorrow", time: "1h ago", unread: 0, avatar: "R" },
  { id: 3, name: "Sneha M.", lastMsg: "Thanks! I'll confirm by evening", time: "3h ago", unread: 1, avatar: "S" },
  { id: 4, name: "Amit D.", lastMsg: "What about the deposit?", time: "1d ago", unread: 0, avatar: "A" },
];

const Messages = () => {
  return (
    <UserDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-3 py-2 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left ${
                    conv.id === 1 ? "bg-accent" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground">{conv.name}</span>
                      <span className="text-[10px] text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMsg}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-secondary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-primary-foreground text-sm font-bold">P</div>
              <div>
                <span className="font-display font-bold text-sm text-foreground">Priya S.</span>
                <span className="text-[10px] text-muted-foreground block">✔ Student Verified • Online</span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-2 max-w-[70%]">
                  <p className="text-sm text-foreground">Hi! Is the room near IIT Gate still available?</p>
                  <span className="text-[10px] text-muted-foreground">10:30 AM</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary rounded-xl rounded-tr-sm px-4 py-2 max-w-[70%]">
                  <p className="text-sm text-primary-foreground">Yes, it is! Would you like to schedule a visit?</p>
                  <span className="text-[10px] text-primary-foreground/70">10:32 AM</span>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-2 max-w-[70%]">
                  <p className="text-sm text-foreground">Is the room still available?</p>
                  <span className="text-[10px] text-muted-foreground">10:34 AM</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="px-5 py-2.5 rounded-lg bg-gradient-action text-primary-foreground text-sm font-semibold shadow-action">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default Messages;
