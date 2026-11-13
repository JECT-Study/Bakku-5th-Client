import type { ExchangeStatus, ItemCondition } from '../types';
import { WireTag } from './wire';

const CONDITION_LABEL: Record<ItemCondition, string> = {
  sealed: '미개봉',
  opened: '개봉',
};

export function ItemConditionBadge({ condition }: { condition: ItemCondition }) {
  return <WireTag>{CONDITION_LABEL[condition]}</WireTag>;
}

const STATUS_LABEL: Record<ExchangeStatus, string> = {
  available: '교환 가능',
  reserved: '예약중',
  completed: '교환 완료',
};

/** 교환글 상태. 채팅 목록에서는 진행 중(available)일 때 표시하지 않는다 */
export function ExchangeStatusBadge({
  status,
  hideAvailable = false,
  emphasized = false,
}: {
  status: ExchangeStatus;
  hideAvailable?: boolean;
  /** 채팅방 상단처럼 눈에 띄어야 하는 곳: 예약중을 진하게 */
  emphasized?: boolean;
}) {
  if (status === 'available' && hideAvailable) return null;
  return (
    <WireTag tone={emphasized && status === 'reserved' ? 'dark' : 'neutral'}>
      {STATUS_LABEL[status]}
    </WireTag>
  );
}
