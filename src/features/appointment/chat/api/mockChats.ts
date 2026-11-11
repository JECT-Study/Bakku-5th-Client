import type { ChatMessage, ChatRoomDetail, ChatRoomSummary, ExchangeItem } from '../types';

// 서버 API 가 붙기 전까지 쓰는 화면 확인용 더미 데이터 (와이어프레임 E. 채팅·약속 기준)

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString();
const daysAgo = (days: number, hour: number, minute: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const MOCK_CHAT_ROOMS: ChatRoomSummary[] = [
  {
    id: '1',
    nickname: '하치와레좋아',
    lastMessage: '교환 요청이 왔어요',
    lastMessageAt: minutesAgo(0),
    unreadCount: 1,
    muted: false,
    status: 'available',
    direction: 'received',
  },
  {
    id: '2',
    nickname: '우사기 수집가',
    lastMessage: '안녕하세요! 혹시 오늘 6시 전에 홍대입구역에서 교환 가능할까요?',
    lastMessageAt: minutesAgo(0),
    unreadCount: 13,
    muted: false,
    status: 'available',
    direction: 'received',
  },
  {
    id: '3',
    nickname: '모몽가',
    lastMessage: '교환 요청을 보냈어요',
    lastMessageAt: minutesAgo(12),
    unreadCount: 0,
    muted: false,
    status: 'available',
    direction: 'sent',
  },
  {
    id: '4',
    nickname: '가챠 러버',
    lastMessage: '네 그럼 토요일 3시에 봬요',
    lastMessageAt: minutesAgo(60),
    unreadCount: 0,
    muted: true,
    status: 'reserved',
    direction: 'sent',
  },
  {
    id: '5',
    nickname: '키링부자',
    lastMessage: '사진',
    lastMessageAt: minutesAgo(4 * 60),
    unreadCount: 120,
    muted: true,
    status: 'available',
    direction: 'received',
  },
  {
    id: '6',
    nickname: '굿즈왕',
    lastMessage: '교환 잘 했어요 감사합니다',
    lastMessageAt: daysAgo(16, 14, 0),
    unreadCount: 0,
    muted: false,
    status: 'completed',
    direction: 'received',
  },
  {
    id: '7',
    nickname: '치이카와팬',
    lastMessage: '상대가 나갔어요',
    lastMessageAt: daysAgo(20, 11, 30),
    unreadCount: 0,
    muted: false,
    status: 'completed',
    direction: 'sent',
  },
];

const REQUEST_ITEMS: ExchangeItem[] = [
  { id: 'i1', name: '우사기 키링', condition: 'sealed' },
  { id: 'i2', name: '하치와레 아크릴 키링', condition: 'opened' },
  { id: 'i3', name: '한교동 봉제인형', condition: 'sealed' },
  { id: 'i4', name: '마이멜로디 미니 피규어 세트', condition: 'sealed' },
];

function buildMessages(room: ChatRoomSummary): ChatMessage[] {
  const start = new Date(new Date(room.lastMessageAt).getTime() - 20 * 60 * 1000).toISOString();
  const request: ChatMessage = {
    id: `${room.id}-m1`,
    type: 'request',
    sender: room.direction === 'received' ? 'other' : 'me',
    sentAt: start,
    items: REQUEST_ITEMS,
  };
  const intro: ChatMessage = {
    id: `${room.id}-m2`,
    type: 'text',
    sender: request.sender,
    sentAt: start,
    text: '치이카와 피규어랑 꼭 바꾸고 싶어요!',
  };
  if (room.id === '1') return [request, intro];
  return [
    request,
    intro,
    {
      id: `${room.id}-m3`,
      type: 'text',
      sender: room.direction === 'received' ? 'me' : 'other',
      sentAt: room.lastMessageAt,
      text: '안녕하세요! 지금 홍대에 계세요?',
    },
    {
      id: `${room.id}-m4`,
      type: 'text',
      sender: room.direction === 'received' ? 'other' : 'me',
      sentAt: room.lastMessageAt,
      text: '네 9번 출구 쪽이에요',
    },
  ];
}

export function getMockChatRoom(id: string): ChatRoomDetail | undefined {
  const room = MOCK_CHAT_ROOMS.find((candidate) => candidate.id === id);
  if (!room) return undefined;

  return {
    id: room.id,
    partner: { nickname: room.nickname, exchangeCount: 12 },
    post: {
      title: '치이카와 미니 피규어',
      offerSummary: '우사기 키링 외 3개',
      status: room.status,
      // 2번 방은 '지금 바로' 교환글로 두어 약속 잡기의 두 가지 화면을 모두 볼 수 있게 한다
      timing: room.id === '2' ? 'now' : 'scheduled',
      place: '홍대입구역 9번 출구',
    },
    requestItems: room.id === '2' ? REQUEST_ITEMS.slice(0, 1) : REQUEST_ITEMS.slice(0, 3),
    messages: buildMessages(room),
  };
}
