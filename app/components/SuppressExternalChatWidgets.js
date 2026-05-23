"use client";

import { useEffect } from "react";

/** Legacy LeadConnector / GHL web chat (removed from layout; may still inject via GHL domain settings). */
const LEGACY_CHAT_SCRIPT_MARKERS = [
  "widgets.leadconnectorhq.com/loader.js",
  "widgets.leadconnectorhq.com/chat-widget"
];

const LEGACY_CHAT_ROOT_SELECTORS = [
  "#lc_chat_widget",
  "#lc_text-widget",
  "[id^='lc_'][class*='widget']",
  "[data-widget-id='69dfa8070c3ae50a478f21f3']",
  "iframe[src*='leadconnectorhq.com']",
  "iframe[src*='msgsndr.com']"
];

function isFaithNode(node) {
  return node?.closest?.(".faith-chat");
}

function removeLegacyChatArtifacts() {
  for (const marker of LEGACY_CHAT_SCRIPT_MARKERS) {
    document
      .querySelectorAll(`script[src*="${marker}"]`)
      .forEach((script) => script.remove());
  }

  for (const selector of LEGACY_CHAT_ROOT_SELECTORS) {
    document.querySelectorAll(selector).forEach((node) => {
      if (!isFaithNode(node)) node.remove();
    });
  }
}

export default function SuppressExternalChatWidgets() {
  useEffect(() => {
    removeLegacyChatArtifacts();

    const observer = new MutationObserver(() => {
      removeLegacyChatArtifacts();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
