import { Badge } from '@/shared/components';

import type { ExchangeStatus, ItemCondition } from '../types';

const CONDITION_LABEL: Record<ItemCondition, string> = {
  sealed: '미개봉',
  opened: '개봉',
};

export function ItemConditionBadge({ condition }: { condition: ItemCondition }) {
  return (
    <Badge hierarchy="tertiary" size="md">
      {CONDITION_LABEL[condition]}
    </Badge>
  );
}

/** 교환글 상태. 채팅 목록에서는 진행 중(available)일 때 표시하지 않는다 */
export function ExchangeStatusBadge({
  status,
  hideAvailable = false,
}: {
  status: ExchangeStatus;
  hideAvailable?: boolean;
}) {
  if (status === 'available') {
    if (hideAvailable) return null;
    return (
      <Badge hierarchy="accent" variant="alpha" size="md">
        교환 가능
      </Badge>
    );
  }
  if (status === 'reserved') {
    return (
      <Badge hierarchy="secondary" variant="alpha" size="md">
        예약중
      </Badge>
    );
  }
  return (
    <Badge hierarchy="tertiary" size="md">
      교환 완료
    </Badge>
  );
}
