import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadset,
  faUsers,
  faUserTie,
  faPaperPlane,
  faCheck,
  faClock,
  faCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { getHelpSocket } from "../../services/helpSocket";

const AdminHelp = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] =
    useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] =
    useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("fixnearToken");

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const loadConversations = async (
    role = activeTab
  ) => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/help/admin?role=${role}`,
        getHeaders()
      );

      setConversations(
        response.data.conversations || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load support conversations."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      setMessagesLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/help/admin/${conversationId}`,
        getHeaders()
      );

      setSelectedConversation(
        response.data.conversation
      );
      setMessages(response.data.messages || []);

      setConversations((previous) =>
        previous.map((item) =>
          item._id === conversationId
            ? {
                ...item,
                unreadForAdmin: 0,
              }
            : item
        )
      );

      window.dispatchEvent(
        new Event("help-unread-updated")
      );

      const socket = getHelpSocket();

      if (socket) {
        socket.emit(
          "join-conversation",
          conversationId
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load conversation."
      );
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    loadConversations(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const socket = getHelpSocket();

    if (!socket) {
      return;
    }

    const handleNewHelpMessage = (data) => {
      if (!data?.conversationId || !data?.message) {
        return;
      }

      setConversations((previous) =>
        previous.map((conversation) => {
          if (
            conversation._id !==
            data.conversationId
          ) {
            return conversation;
          }

          const isCurrentConversation =
            selectedConversation?._id ===
            data.conversationId;

          return {
            ...conversation,
            lastMessage:
              data.message.message,
            lastMessageAt:
              data.message.createdAt,
            unreadForAdmin: isCurrentConversation
              ? 0
              : (conversation.unreadForAdmin || 0) + 1,
          };
        })
      );

      if (
        selectedConversation?._id ===
        data.conversationId
      ) {
        setMessages((previousMessages) => {
          const exists = previousMessages.some(
            (item) =>
              item._id === data.message._id
          );

          if (exists) {
            return previousMessages;
          }

          return [
            ...previousMessages,
            data.message,
          ];
        });
      }

      window.dispatchEvent(
        new Event("help-unread-updated")
      );
    };

    const handleConversationUpdate = (data) => {
      if (!data?.conversationId) {
        return;
      }

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation._id ===
          data.conversationId
            ? {
                ...conversation,
                status: data.status,
              }
            : conversation
        )
      );

      if (
        selectedConversation?._id ===
        data.conversationId
      ) {
        setSelectedConversation((previous) => ({
          ...previous,
          status: data.status,
        }));
      }
    };

    socket.on(
      "new-help-message",
      handleNewHelpMessage
    );

    socket.on(
      "help-message",
      handleNewHelpMessage
    );

    socket.on(
      "help-conversation-updated",
      handleConversationUpdate
    );

    socket.emit("join-admin-room");

    return () => {
      socket.off(
        "new-help-message",
        handleNewHelpMessage
      );

      socket.off(
        "help-message",
        handleNewHelpMessage
      );

      socket.off(
        "help-conversation-updated",
        handleConversationUpdate
      );
    };
  }, [selectedConversation?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedConversation(null);
    setMessages([]);
    setMessage("");
  };

  const handleSelectConversation = (
    conversation
  ) => {
    loadConversation(conversation._id);
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (
      !trimmedMessage ||
      sending ||
      !selectedConversation
    ) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/help/admin/${selectedConversation._id}/message`,
        {
          message: trimmedMessage,
        },
        getHeaders()
      );

      const newMessage = response.data.message;

      setMessages((previousMessages) => {
        const exists = previousMessages.some(
          (item) => item._id === newMessage._id
        );

        if (exists) {
          return previousMessages;
        }

        return [...previousMessages, newMessage];
      });

      setSelectedConversation(
        response.data.conversation
      );

      setConversations((previous) =>
        previous.map((item) =>
          item._id ===
          selectedConversation._id
            ? response.data.conversation
            : item
        )
      );

      setMessage("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reply."
      );
    } finally {
      setSending(false);
    }
  };

  const resolveConversation = async () => {
    if (!selectedConversation) {
      return;
    }

    try {
      setError("");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/help/admin/${selectedConversation._id}/resolve`,
        {},
        getHeaders()
      );

      setSelectedConversation(
        response.data.conversation
      );

      setConversations((previous) =>
        previous.map((item) =>
          item._id ===
          selectedConversation._id
            ? response.data.conversation
            : item
        )
      );

      window.dispatchEvent(
        new Event("help-unread-updated")
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to resolve conversation."
      );
    }
  };

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    if (status === "resolved") {
      return "bg-green-50 text-green-600";
    }

    if (status === "in-progress") {
      return "bg-blue-50 text-blue-600";
    }

    return "bg-orange-50 text-orange-600";
  };

  const getStatusIcon = (status) => {
    if (status === "resolved") {
      return faCheck;
    }

    if (status === "in-progress") {
      return faClock;
    }

    return faCircle;
  };

  const getUserName = (conversation) => {
    return (
      conversation.user?.name ||
      "Unknown User"
    );
  };

  const getUserEmail = (conversation) => {
    return conversation.user?.email || "";
  };

  const getRoleLabel = () => {
    return activeTab === "user"
      ? "Users"
      : "Professionals";
  };

  const totalUnread = conversations.reduce(
    (total, conversation) =>
      total +
      (conversation.unreadForAdmin || 0),
    0
  );

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FontAwesomeIcon
              icon={faHeadset}
              className="text-xl"
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Help & Support
            </h1>

            <p className="text-xs sm:text-sm text-gray-500">
              Manage user and professional support conversations.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              type="button"
              onClick={() =>
                handleTabChange("user")
              }
              className={`
                flex-1
                sm:flex-none
                px-4
                sm:px-6
                py-3
                sm:py-4
                flex
                items-center
                justify-center
                gap-2
                text-sm
                font-medium
                border-b-2
                transition
                ${
                  activeTab === "user"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }
              `}
            >
              <FontAwesomeIcon icon={faUsers} />
              Users
            </button>

            <button
              type="button"
              onClick={() =>
                handleTabChange("professional")
              }
              className={`
                flex-1
                sm:flex-none
                px-4
                sm:px-6
                py-3
                sm:py-4
                flex
                items-center
                justify-center
                gap-2
                text-sm
                font-medium
                border-b-2
                transition
                ${
                  activeTab === "professional"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }
              `}
            >
              <FontAwesomeIcon icon={faUserTie} />
              Professionals
            </button>

            {totalUnread > 0 && (
              <div className="hidden sm:flex items-center ml-auto px-5">
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {totalUnread > 99
                    ? "99+"
                    : totalUnread}{" "}
                  unread
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] min-h-[600px]">
          <div
            className={`
              border-r
              border-gray-200
              bg-gray-50
              ${
                selectedConversation
                  ? "hidden lg:block"
                  : "block"
              }
            `}
          >
            <div className="px-4 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {getRoleLabel()}
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {conversations.length}{" "}
                    conversation
                    {conversations.length !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                {totalUnread > 0 && (
                  <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                    {totalUnread > 99
                      ? "99+"
                      : totalUnread}
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
                  <p className="mt-3 text-xs text-gray-500">
                    Loading...
                  </p>
                </div>
              ) : conversations.length ===
                0 ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <FontAwesomeIcon
                      icon={
                        activeTab === "user"
                          ? faUsers
                          : faUserTie
                      }
                    />
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-600">
                    No conversations
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    No {activeTab} support requests yet.
                  </p>
                </div>
              ) : (
                conversations.map(
                  (conversation) => {
                    const isSelected =
                      selectedConversation?._id ===
                      conversation._id;

                    return (
                      <button
                        key={conversation._id}
                        type="button"
                        onClick={() =>
                          handleSelectConversation(
                            conversation
                          )
                        }
                        className={`
                          w-full
                          text-left
                          px-4
                          py-3
                          border-b
                          border-gray-200
                          transition
                          ${
                            isSelected
                              ? "bg-blue-50 border-l-4 border-l-blue-600"
                              : "bg-white hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-semibold">
                            {getUserName(
                              conversation
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {getUserName(
                                  conversation
                                )}
                              </p>

                              {conversation.unreadForAdmin >
                                0 && (
                                <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {conversation.unreadForAdmin >
                                  99
                                    ? "99+"
                                    : conversation.unreadForAdmin}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-gray-500 truncate mt-0.5">
                              {getUserEmail(
                                conversation
                              )}
                            </p>

                            <div className="flex items-center justify-between gap-2 mt-2">
                              <p className="text-xs text-gray-500 truncate flex-1">
                                {conversation.lastMessage ||
                                  "No messages yet"}
                              </p>

                              <span className="text-[10px] text-gray-400 shrink-0">
                                {formatTime(
                                  conversation.lastMessageAt
                                )}
                              </span>
                            </div>

                            <div className="mt-2">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium ${getStatusClass(
                                  conversation.status
                                )}`}
                              >
                                <FontAwesomeIcon
                                  icon={getStatusIcon(
                                    conversation.status
                                  )}
                                  className="text-[7px]"
                                />
                                {conversation.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  }
                )
              )}
            </div>
          </div>

          <div
            className={`
              bg-gray-50
              flex
              flex-col
              ${
                selectedConversation
                  ? "block"
                  : "hidden lg:flex"
              }
            `}
          >
            {!selectedConversation ? (
              <div className="flex-1 min-h-[600px] flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faHeadset}
                      className="text-2xl"
                    />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-gray-800">
                    Select a conversation
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Choose a support request from the list to view the conversation and reply.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-3 sm:px-5 py-3 bg-white border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedConversation(
                          null
                        );
                        setMessages([]);
                      }}
                      className="lg:hidden w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0"
                    >
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                      />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-semibold">
                      {getUserName(
                        selectedConversation
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        {getUserName(
                          selectedConversation
                        )}
                      </h2>

                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                        {getUserEmail(
                          selectedConversation
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${getStatusClass(
                          selectedConversation.status
                        )}`}
                      >
                        <FontAwesomeIcon
                          icon={getStatusIcon(
                            selectedConversation.status
                          )}
                          className="text-[7px]"
                        />
                        {selectedConversation.status}
                      </span>

                      {selectedConversation.status !==
                        "resolved" && (
                        <button
                          type="button"
                          onClick={
                            resolveConversation
                          }
                          className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-green-600 text-white text-[10px] sm:text-xs font-medium hover:bg-green-700 transition"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-h-[380px] max-h-[520px] overflow-y-auto px-3 sm:px-5 py-4">
                  {messagesLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((item) => {
                        const isAdmin =
                          item.senderRole ===
                          "admin";

                        return (
                          <div
                            key={item._id}
                            className={`flex ${
                              isAdmin
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[70%] flex flex-col ${
                                isAdmin
                                  ? "items-end"
                                  : "items-start"
                              }`}
                            >
                              <div
                                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                  isAdmin
                                    ? "bg-blue-600 text-white rounded-tr-sm"
                                    : "bg-white border border-gray-200 text-gray-700 rounded-tl-sm"
                                }`}
                              >
                                {item.message}
                              </div>

                              <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-400">
                                <span>
                                  {isAdmin
                                    ? "You"
                                    : getUserName(
                                        selectedConversation
                                      )}
                                </span>

                                <span>
                                  {formatDate(
                                    item.createdAt
                                  )}
                                </span>

                                <span>
                                  {formatTime(
                                    item.createdAt
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                <form
                  onSubmit={sendMessage}
                  className="p-3 sm:p-4 bg-white border-t border-gray-200"
                >
                  <div className="flex items-end gap-2">
                    <textarea
                      value={message}
                      onChange={(event) =>
                        setMessage(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          !event.shiftKey
                        ) {
                          event.preventDefault();
                          sendMessage(event);
                        }
                      }}
                      rows={2}
                      maxLength={2000}
                      placeholder="Type your reply..."
                      className="
                        flex-1
                        resize-none
                        rounded-xl
                        border
                        border-gray-300
                        px-3
                        sm:px-4
                        py-2.5
                        text-sm
                        text-gray-700
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />

                    <button
                      type="submit"
                      disabled={
                        !message.trim() ||
                        sending
                      }
                      className="
                        w-11
                        h-11
                        sm:w-12
                        sm:h-12
                        shrink-0
                        rounded-xl
                        bg-blue-600
                        text-white
                        flex
                        items-center
                        justify-center
                        hover:bg-blue-700
                        disabled:bg-gray-300
                        disabled:cursor-not-allowed
                        transition
                      "
                    >
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className="text-sm"
                      />
                    </button>
                  </div>

                  <div className="mt-2 flex justify-between text-[10px] text-gray-400">
                    <span>
                      Press Enter to send
                    </span>
                    <span>
                      {message.length}/2000
                    </span>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHelp;