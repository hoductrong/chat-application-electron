export type ConversationMember = {
  userId: string;
};

export type Conversation = {
  id: string;
  members: ConversationMember[];
};
