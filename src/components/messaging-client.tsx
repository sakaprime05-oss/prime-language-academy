"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Loader2, MessageCircle, Search, Send, UserRound } from "lucide-react";
import { sendMessage, getConversations, getMessages, getAvailableContacts } from "@/app/actions/messages";

type Contact = {
  id: string;
  name: string | null;
  role: string | null;
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date | string;
};

type Conversation = {
  partner: Contact;
  lastMessage: Message | null;
  unreadCount: number;
};

export function MessagingClient({ currentUserId }: { currentUserId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    const [convs, availableContacts] = await Promise.all([
      getConversations(),
      getAvailableContacts(),
    ]);
    setConversations(convs as Conversation[]);
    setContacts(availableContacts as Contact[]);
    setIsLoading(false);
  }, []);

  const loadMessages = useCallback(async (partnerId: string, background = false) => {
    if (!background) setIsLoadingMessages(true);
    const msgs = await getMessages(partnerId);
    setMessages(msgs as Message[]);
    if (!background) setIsLoadingMessages(false);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!activeContact) return;

    loadMessages(activeContact.id);
    const interval = window.setInterval(() => {
      loadMessages(activeContact.id, true);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [activeContact, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, activeContact?.id]);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    setIsSending(true);
    const result = await sendMessage(activeContact.id, newMessage.trim());
    if ("success" in result && result.success) {
      setNewMessage("");
      await loadMessages(activeContact.id);
      const convs = await getConversations();
      setConversations(convs as Conversation[]);
    }
    setIsSending(false);
  }

  const sidebarItems = useMemo(() => {
    const items = [...conversations];

    contacts.forEach((contact) => {
      if (!items.find((conversation) => conversation.partner.id === contact.id)) {
        items.push({
          partner: contact,
          lastMessage: null,
          unreadCount: 0,
        });
      }
    });

    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      `${item.partner.name || "Utilisateur"} ${roleLabel(item.partner.role)}`
        .toLowerCase()
        .includes(query)
    );
  }, [contacts, conversations, searchQuery]);

  if (isLoading && !activeContact) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm font-semibold text-[var(--muted-foreground)] shadow-sm">
        Chargement de la messagerie...
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-[var(--glass-shadow)]">
      <div className="grid min-h-[calc(100vh-220px)] md:min-h-[620px] lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside
          className={`border-[var(--border)] bg-[var(--muted)]/45 lg:border-r ${
            activeContact ? "hidden lg:flex" : "flex"
          } flex-col`}
        >
          <div className="border-b border-[var(--border)] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--primary)]">
                  Boîte interne
                </p>
                <h3 className="mt-1 text-lg font-black text-[var(--foreground)]">
                  Conversations
                </h3>
              </div>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-black text-[var(--muted-foreground)]">
                {sidebarItems.length}
              </span>
            </div>

            <label className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-[var(--muted-foreground)]">
              <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Rechercher un contact"
                className="h-10 w-full bg-transparent text-sm font-semibold text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
              />
            </label>
          </div>

          <div className="flex-1 overflow-y-auto p-2 sm:p-3">
            {sidebarItems.length === 0 ? (
              <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] p-6 text-center">
                <UserRound className="mb-3 h-8 w-8 text-[var(--muted-foreground)]" aria-hidden="true" />
                <p className="text-sm font-bold text-[var(--foreground)]">Aucun contact trouvé</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Essayez avec un autre nom ou rôle.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {sidebarItems.map((item) => {
                  const selected = activeContact?.id === item.partner.id;

                  return (
                    <button
                      key={item.partner.id}
                      type="button"
                      onClick={() => setActiveContact(item.partner)}
                      className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        selected
                          ? "border-[var(--primary)]/35 bg-[var(--primary)]/10 shadow-sm"
                          : "border-transparent hover:border-[var(--border)] hover:bg-[var(--card)]"
                      }`}
                    >
                      <Avatar contact={item.partner} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="truncate text-sm font-black text-[var(--foreground)]">
                            {item.partner.name || "Utilisateur"}
                          </span>
                          {item.unreadCount > 0 && (
                            <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[10px] font-black text-white">
                              {item.unreadCount}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-black uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                          {roleLabel(item.partner.role)}
                        </span>
                        <span className="mt-1 block truncate text-xs text-[var(--muted-foreground)]">
                          {item.lastMessage?.content || "Nouvelle conversation"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        <main className={`${!activeContact ? "hidden lg:flex" : "flex"} min-w-0 flex-col bg-[var(--background)]/55`}>
          {activeContact ? (
            <>
              <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--card)]/95 p-4 backdrop-blur sm:p-5">
                <button
                  type="button"
                  onClick={() => setActiveContact(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)] lg:hidden"
                  aria-label="Retour aux conversations"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <Avatar contact={activeContact} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-black text-[var(--foreground)]">
                    {activeContact.name || "Utilisateur"}
                  </h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                    {roleLabel(activeContact.role)}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {isLoadingMessages ? (
                  <div className="flex h-full min-h-72 items-center justify-center text-[var(--muted-foreground)]">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    <span className="text-sm font-semibold">Chargement des messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <EmptyChat name={activeContact.name || "ce contact"} />
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const isMe = message.senderId === currentUserId;

                      return (
                        <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[68%] ${
                              isMe
                                ? "rounded-br-md bg-[var(--primary)] text-white"
                                : "rounded-bl-md border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
                            }`}
                          >
                            <p className="text-sm leading-6">{message.content}</p>
                            <time
                              className={`mt-1 block text-[10px] font-bold ${
                                isMe ? "text-white/70" : "text-[var(--muted-foreground)]"
                              }`}
                            >
                              {formatMessageTime(message.createdAt)}
                            </time>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSend}
                className="border-t border-[var(--border)] bg-[var(--card)] p-3 sm:p-4"
              >
                <div className="flex items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-2">
                  <textarea
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="Écrivez votre message..."
                    rows={1}
                    className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2 text-sm font-semibold leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-[var(--primary)] px-4 text-sm font-black text-white transition-all hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
                    aria-label="Envoyer le message"
                  >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Envoyer</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] shadow-sm">
                <MessageCircle className="h-9 w-9" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-black text-[var(--foreground)]">Messagerie interne</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
                Sélectionnez une conversation pour lire l'historique et répondre rapidement.
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

function Avatar({ contact }: { contact: Contact }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[#7f1d1d] text-sm font-black uppercase text-white shadow-sm shadow-red-950/10">
      {contact.name?.trim()?.[0] || "?"}
    </span>
  );
}

function EmptyChat({ name }: { name: string }) {
  return (
    <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]/55 p-8 text-center">
      <MessageCircle className="mb-4 h-10 w-10 text-[var(--muted-foreground)]" aria-hidden="true" />
      <p className="text-base font-black text-[var(--foreground)]">Démarrer la conversation</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted-foreground)]">
        Aucun message avec {name} pour le moment. Envoyez une première réponse claire et concise.
      </p>
    </div>
  );
}

function roleLabel(role: string | null) {
  if (role === "TEACHER") return "Professeur";
  if (role === "STUDENT") return "Étudiant";
  if (role === "ADMIN") return "Administration";
  return "Contact";
}

function formatMessageTime(value: Date | string) {
  return new Date(value).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
