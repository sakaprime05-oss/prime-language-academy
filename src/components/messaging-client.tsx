"use client";

import { useCallback, useEffect, useState } from "react";
import { sendMessage, getConversations, getMessages, getAvailableContacts } from "@/app/actions/messages";

export function MessagingClient({ currentUserId }: { currentUserId: string }) {
    const [conversations, setConversations] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [activeContact, setActiveContact] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        const [convs, availableContacts] = await Promise.all([
            getConversations(),
            getAvailableContacts()
        ]);
        setConversations(convs);
        setContacts(availableContacts);
        setIsLoading(false);
    }, []);

    const loadMessages = useCallback(async (partnerId: string, background = false) => {
        if (!background) setIsLoading(true);
        const msgs = await getMessages(partnerId);
        setMessages(msgs);
        if (!background) setIsLoading(false);
    }, []);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    useEffect(() => {
        if (activeContact) {
            loadMessages(activeContact.id);
            // Simple polling
            const interval = setInterval(() => {
                loadMessages(activeContact.id, true);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [activeContact, loadMessages]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!newMessage.trim() || !activeContact) return;

        setIsSending(true);
        const result = await sendMessage(activeContact.id, newMessage);
        if (result.success) {
            setNewMessage("");
            await loadMessages(activeContact.id);
            // Refresh conversations list to update last message
            const convs = await getConversations();
            setConversations(convs);
        }
        setIsSending(false);
    }

    // Merge contacts and conversations for the sidebar
    const sidebarItems = [...conversations];
    contacts.forEach(contact => {
        if (!sidebarItems.find(c => c.partner.id === contact.id)) {
            sidebarItems.push({
                partner: contact,
                lastMessage: null,
                unreadCount: 0
            });
        }
    });

    if (isLoading && !activeContact) {
        return <div className="p-8 text-center text-[var(--foreground)]/50">Chargement de la messagerie...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row h-[70vh] min-h-[500px] glass-card overflow-hidden">
            {/* Sidebar */}
            <div className={`w-full md:w-1/3 border-r border-[var(--foreground)]/10 flex flex-col ${activeContact ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-[var(--foreground)]/10">
                    <h3 className="font-black text-[var(--foreground)]">Conversations</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                    {sidebarItems.length === 0 ? (
                        <p className="p-4 text-xs text-center text-[var(--foreground)]/40">Aucun contact disponible.</p>
                    ) : (
                        sidebarItems.map(item => (
                            <button
                                key={item.partner.id}
                                onClick={() => setActiveContact(item.partner)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeContact?.id === item.partner.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-[var(--foreground)]/5 border border-transparent'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold flex-shrink-0">
                                    {item.partner.name?.[0] || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-sm text-[var(--foreground)] truncate">{item.partner.name || "Utilisateur"}</h4>
                                        {item.unreadCount > 0 && (
                                            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.unreadCount}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[var(--foreground)]/50 truncate">
                                        {item.lastMessage ? item.lastMessage.content : <span className="italic text-[var(--foreground)]/30">Nouvelle conversation</span>}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`w-full md:w-2/3 flex flex-col bg-[var(--background)]/50 ${!activeContact ? 'hidden md:flex' : 'flex'}`}>
                {activeContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[var(--foreground)]/10 flex items-center gap-3 bg-[var(--surface)]">
                            <button className="md:hidden p-2 rounded-lg bg-[var(--foreground)]/5 text-[var(--foreground)]/60" onClick={() => setActiveContact(null)}>
                                ←
                            </button>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold">
                                {activeContact.name?.[0] || "?"}
                            </div>
                            <div>
                                <h3 className="font-black text-[var(--foreground)]">{activeContact.name}</h3>
                                <p className="text-[10px] uppercase tracking-widest text-[var(--foreground)]/40 font-bold">{activeContact.role === "TEACHER" ? "Professeur" : "Étudiant"}</p>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                    <div className="text-4xl mb-2">👋</div>
                                    <p className="text-sm font-bold text-[var(--foreground)]">Dites bonjour à {activeContact.name} !</p>
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isMe = msg.senderId === currentUserId;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-[var(--foreground)]/10 text-[var(--foreground)] rounded-bl-sm'}`}>
                                                <p className="text-sm">{msg.content}</p>
                                                <span className={`text-[9px] mt-1 block ${isMe ? 'text-white/60' : 'text-[var(--foreground)]/40'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[var(--surface)] border-t border-[var(--foreground)]/10">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Écrivez votre message..."
                                    className="flex-1 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none text-[var(--foreground)]"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || isSending}
                                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 font-bold disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {isSending ? "..." : "Envoyer"}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                        <div className="w-20 h-20 rounded-full bg-[var(--foreground)]/5 flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-[var(--foreground)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-[var(--foreground)]">Messagerie Interne</h3>
                        <p className="text-sm text-[var(--foreground)]/60 mt-2">Sélectionnez une conversation sur le côté pour commencer à discuter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
