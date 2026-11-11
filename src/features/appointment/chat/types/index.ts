/** 교환글 진행 상태 */
export type ExchangeStatus = 'available' | 'reserved' | 'completed';

/** 물건 상태 */
export type ItemCondition = 'sealed' | 'opened';

/** 교환 시기: 지금 바로 / 약속 잡고 */
export type ExchangeTiming = 'now' | 'scheduled';

/** 내가 보낸 요청인지, 받은 요청인지 */
export type RequestDirection = 'received' | 'sent';

export type ExchangeItem = {
  id: string;
  name: string;
  condition: ItemCondition;
  imageUrl?: string;
};

export type ChatRoomSummary = {
  id: string;
  nickname: string;
  thumbnailUrl?: string;
  lastMessage: string;
  /** ISO 시각 */
  lastMessageAt: string;
  unreadCount: number;
  /** 알림 끔 */
  muted: boolean;
  status: ExchangeStatus;
  direction: RequestDirection;
};

type MessageBase = {
  id: string;
  sender: 'me' | 'other';
  /** ISO 시각 */
  sentAt: string;
};

export type ChatMessage =
  | (MessageBase & { type: 'text'; text: string })
  | (MessageBase & { type: 'image'; uri: string })
  | (MessageBase & { type: 'request'; items: ExchangeItem[] });

export type ChatRoomDetail = {
  id: string;
  partner: { nickname: string; exchangeCount: number };
  post: {
    title: string;
    thumbnailUrl?: string;
    /** 내놓은 물건 요약 (예: 우사기 키링 외 3개) */
    offerSummary: string;
    status: ExchangeStatus;
    timing: ExchangeTiming;
    /** 교환글에 적힌 희망 장소 */
    place: string;
  };
  /** 이번 교환에서 오가는 물건 (약속 잡기의 교환할 물건 후보) */
  requestItems: ExchangeItem[];
  messages: ChatMessage[];
};
