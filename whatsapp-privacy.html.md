# WhatsApp Assistant Privacy Policy

Source: https://www.soance.com/whatsapp-privacy.html

Effective date: October 19, 2026

This policy describes the WhatsApp business messaging assistant operated by Soance Innovations LLP, India. The assistant receives messages sent to an authorized, connected WhatsApp business account and uses AI to help answer business enquiries.

## Current availability and who is responsible

The current prototype uses Soance's Meta test account. Connecting Soance's existing WhatsApp Business App number and onboarding client businesses are planned and depend on Meta approval and successful account onboarding. This policy does not mean every Soance or client phone number is connected.

For Soance's own business conversations, Soance Innovations LLP decides how and why the assistant processes information. If an authorized client business is connected in the future, that business will decide the purposes of its customer conversations and Soance will process those conversations on its behalf. The applicable business identity, instructions and privacy information must be provided for that connection.

## Information the assistant handles

- Your WhatsApp sender identifier or phone number, message text, message identifiers and timestamps.

- AI-generated replies and a limited history of earlier messages and replies used to keep the conversation relevant.

- Connected WhatsApp Business Account and business phone identifiers, account authorization information and webhook configuration needed to operate the authorized connection.

- Message queue and duplicate-processing records, send attempts, returned message identifiers, processing errors and other send-result metadata.

- Conversation pause preferences and requests you send to a human operator or to our privacy contact.

The current assistant processes text messages. It does not use voice notes, photos or other attachments to generate answers. Please avoid sending passwords, payment credentials or other sensitive information that is unnecessary for your enquiry.

## Why we use this information

We use this information to receive and answer enquiries, provide relevant conversation context, queue work reliably, avoid replying twice to the same message, handle failures, pause automated conversations and support authorized business account connections. The assistant replies to incoming messages; it does not independently complete bookings, payments or other actions outside the conversation.

## Meta, Cloudflare and OpenAI

Meta / WhatsApp: WhatsApp delivers messages and sends replies through its business messaging platform. WhatsApp also handles information under its own terms and privacy practices.

Cloudflare: The assistant runs on Cloudflare Workers. Its Durable Object database stores the message queue, conversation records, reply results and pause settings. Cloudflare also processes the network and operational information needed to host the service.

OpenAI: We send the text of your enquiry, relevant earlier conversation text and the business's approved assistant instructions to OpenAI's API to generate a reply. The current configuration uses GPT-6 Luna. Our requests set store: false to disable storage of retrievable Responses API response objects. This is not a promise of zero provider retention: security and abuse-monitoring logs, prompt caching and other applicable provider controls can still involve retention. See OpenAI's API data controls .

The connected business and its authorized operators can access conversations to provide service and operate the assistant. If a client business is connected, the relevant client business will also have access to its conversations.

## Storage, retention and deletion

The deployed assistant uses a seven-day retention setting for conversation records. Completed and held message records older than that are removed when the queue processes a message. Cleanup is triggered by message processing rather than a daily schedule, so an idle account can retain records for longer. Pending queue records can remain until processing resolves them.

Pause preferences, account configuration and authorization settings can remain until an operator changes or removes them. Records supplied directly to us for a privacy or support request are handled separately from the conversation queue.

Cloudflare, OpenAI and Meta may retain information under their applicable service terms, settings and policies. Removing a record from the assistant does not remove messages from your WhatsApp app, the business's inbox, or provider records outside our control.

## Request access, correction or data deletion

Email info@soance.com with the subject WhatsApp assistant privacy request . Say whether you want access, correction or deletion. Include the WhatsApp number used for the conversation, with its country code, the business you contacted and an approximate conversation date so we can identify the relevant records. Do not send passwords or government identity documents.

We may ask you to confirm control of the WhatsApp number before providing or removing personal information. We will review the request and explain any information we cannot remove. For a future client business connection, we may need that business's instructions to handle its conversation records. There is no automatic deletion command in the chat. A request to Soance does not itself delete copies in WhatsApp or records controlled independently by providers.

## Human help and stopping automated replies

When the assistant is enabled, sending the English word human asks it to pause automated replies for that conversation. An operator can also pause a conversation manually. The pause acknowledgment does not mean a person has been notified or has read the message. For human help, contact the business directly or email info@soance.com .

## Processing locations and security

Meta, Cloudflare and OpenAI operate international infrastructure. Information may be processed in India and other countries. The current prototype does not promise processing only in India.

The assistant uses HTTPS connections, verifies Meta webhook signatures and restricts its operator endpoints with authentication. These measures do not eliminate all security risks. You should send only information needed for your business enquiry.

## Changes and contact

We will update this page when the assistant's features or data handling change. The effective date above identifies this version.

For privacy questions or requests, contact Soance Innovations LLP, India, at info@soance.com .
