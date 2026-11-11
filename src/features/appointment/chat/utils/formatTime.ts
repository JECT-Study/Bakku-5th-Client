const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** 오후 7:32 */
export function formatClock(value: string | Date) {
  const date = new Date(value);
  const hours = date.getHours();
  const meridiem = hours < 12 ? '오전' : '오후';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${meridiem} ${hour12}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** 10월 29일(목) */
export function formatMonthDay(value: string | Date) {
  const date = new Date(value);
  return `${date.getMonth() + 1}월 ${date.getDate()}일(${WEEKDAYS[date.getDay()]})`;
}

/** 채팅방 안 날짜 구분선: 10월 29일 (수) */
export function formatDateDivider(value: string | Date) {
  const date = new Date(value);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
}

export function isDifferentDay(a: string, b: string) {
  return !isSameDay(new Date(a), new Date(b));
}

/** 채팅 목록 시각: 방금 / 12분 전 / 1시간 전 / 오후 7:32 / 10월 24일 / 2025.3.2 */
export function formatListTime(value: string, now = new Date()) {
  const date = new Date(value);
  const diff = now.getTime() - date.getTime();

  if (diff < MINUTE) return '방금';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;
  if (isSameDay(date, now)) {
    return diff < 3 * HOUR ? `${Math.floor(diff / HOUR)}시간 전` : formatClock(date);
  }
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}
