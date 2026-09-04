import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faHeadset,
  faCheckCircle,
  faClock,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { getHelpSocket } from "../../services/helpSocket";

const HelpSupport = () => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("fixnearToken");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const loadConversation = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/help/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversation(response.data.conversation);
      setMessages(response.data.messages || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load Help & Support."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = getHelpSocket();

    if (!socket) {
      return;
    }

    const handleHelpMessage = (data) => {
      if (!data?.message) {
        return;
      }

      setMessages((previousMessages) => {
        const exists = previousMessages.some(
          (item) => item._id === data.message._id
        );

        if (exists) {
          return previousMessages;
        }

        return [...previousMessages, data.message];
      });

      if (data.conversationId) {
        setConversation((previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            lastMessage: data.message.message,
            lastMessageAt: data.message.createdAt,
            unreadForUser:
              data.senderRole === "admin"
                ? 0
                : previous.unreadForUser,
          };
        });
      }

      if (data.senderRole === "admin") {
        window.dispatchEvent(
          new Event("help-unread-updated")
        );
      }
    };

    const handleConversationUpdate = (data) => {
      if (
        conversation?._id &&
        data?.conversationId === conversation._id
      ) {
        setConversation((previous) => ({
          ...previous,
          status: data.status,
        }));
      }
    };

    socket.on("help-message", handleHelpMessage);
    socket.on(
      "new-help-message",
      handleHelpMessage
    );
    socket.on(
      "help-conversation-updated",
      handleConversationUpdate
    );

    if (conversation?._id) {
      socket.emit(
        "join-conversation",
        conversation._id
      );
    }

    return () => {
      socket.off(
        "help-message",
        handleHelpMessage
      );
      socket.off(
        "new-help-message",
        handleHelpMessage
      );
      socket.off(
        "help-conversation-updated",
        handleConversationUpdate
      );

      if (conversation?._id) {
        socket.emit(
          "leave-conversation",
          conversation._id
        );
      }
    };
  }, [conversation?._id]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending || !token) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/help/message`,
        {
          message: trimmedMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

      setConversation(response.data.conversation);
      setMessage("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = () => {
    if (conversation?.status === "resolved") {
      return faCheckCircle;
    }

    if (conversation?.status === "in-progress") {
      return faClock;
    }

    return faCircle;
  };

  const getStatusText = () => {
    if (conversation?.status === "resolved") {
      return "Resolved";
    }

    if (conversation?.status === "in-progress") {
      return "Admin is responding";
    }

    return "Waiting for support";
  };

  const getStatusClass = () => {
    if (conversation?.status === "resolved") {
      return "text-green-600 bg-green-50";
    }

    if (conversation?.status === "in-progress") {
      return "text-blue-600 bg-blue-50";
    }

    return "text-orange-600 bg-orange-50";
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-gray-500">
            Loading support chat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FontAwesomeIcon
              icon={faHeadset}
              className="text-xl"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Help & Support
            </h1>

            <p className="text-xs sm:text-sm text-gray-500">
              Tell us your problem and our admin team will help you.
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
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-800">
              Chat with FixNear Support
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Conversation history is saved automatically.
            </p>
          </div>

          {conversation && (
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusClass()}`}
            >
              <FontAwesomeIcon
                icon={getStatusIcon()}
                className="text-[9px]"
              />
              {getStatusText()}
            </div>
          )}
        </div>

        <div className="h-[55vh] min-h-[380px] max-h-[600px] overflow-y-auto bg-gray-50 px-3 sm:px-5 py-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faHeadset}
                    className="text-2xl"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-gray-800">
                  How can we help?
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Describe your issue below. Our support team will respond as soon as possible.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((item) => {
                const isAdmin =
                  item.senderRole === "admin";

                return (
                  <div
                    key={item._id}
                    className={`flex ${
                      isAdmin
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] ${
                        isAdmin
                          ? "items-start"
                          : "items-end"
                      } flex flex-col`}
                    >
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isAdmin
                            ? "bg-white border border-gray-200 text-gray-700 rounded-tl-sm"
                            : "bg-blue-600 text-white rounded-tr-sm"
                        }`}
                      >
                        {item.message}
                      </div>

                      <div
                        className={`mt-1 flex items-center gap-2 text-[10px] text-gray-400 ${
                          isAdmin
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <span>
                          {isAdmin
                            ? "Support"
                            : "You"}
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
          className="p-3 sm:p-4 border-t border-gray-200 bg-white"
        >
          {conversation?.status === "resolved" && (
            <div className="mb-3 rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-xs sm:text-sm text-green-700">
              This conversation has been resolved. You can still send a new message if you need further assistance.
            </div>
          )}

          <div className="flex items-end gap-2">
            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
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
              placeholder="Describe your problem..."
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
              disabled={!message.trim() || sending}
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
            <span>Press Enter to send</span>
            <span>{message.length}/2000</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpSupport;