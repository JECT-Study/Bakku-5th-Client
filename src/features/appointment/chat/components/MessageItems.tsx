import { semantic } from '@/design-tokens';
import { Image } from 'expo-image';
import { CaretRightIcon } from 'phosphor-react-native/src/icons/CaretRight';
import { Pressable, Text, View } from 'react-native';

import { Icon, InteractionLayer } from '@/shared/components';

import type { ChatMessage, ExchangeItem } from '../types';
import { formatClock, formatDateDivider } from '../utils/formatTime';
import { ItemConditionBadge } from './StatusBadges';

export function DateDivider({ date }: { date: string }) {
  return (
    <Text className="py-3 text-center font-sans text-label-sm text-object-assistive">
      {formatDateDivider(date)}
    </Text>
  );
}

/** 말풍선 옆 시각. 내 메시지는 왼쪽, 상대 메시지는 오른쪽에 붙는다 */
function Row({
  mine,
  sentAt,
  children,
}: {
  mine: boolean;
  sentAt: string;
  children: React.ReactNode;
}) {
  const time = (
    <Text className="pb-0.5 font-sans text-label-2xs text-object-assistive">
      {formatClock(sentAt)}
    </Text>
  );
  return (
    <View className={`flex-row items-end gap-1.5 ${mine ? 'justify-end' : 'justify-start'}`}>
      {mine ? time : null}
      <View className="max-w-[72%] shrink">{children}</View>
      {mine ? null : time}
    </View>
  );
}

function RequestCard({
  mine,
  items,
  onItemPress,
}: {
  mine: boolean;
  items: ExchangeItem[];
  onItemPress?: (item: ExchangeItem) => void;
}) {
  return (
    <View className="overflow-hidden rounded-2xl bg-surface-standard">
      <Text className="border-b border-stroke-alpha-subtler px-3.5 py-3 font-sans text-label-lg font-semibold text-object-boldest">
        {mine ? '교환 요청을 보냈어요' : '교환 요청이 왔어요'}
      </Text>
      <View className="py-1.5">
        {items.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            onPress={() => onItemPress?.(item)}
            className="flex-row items-center gap-2 px-3.5 py-2.5"
          >
            {({ pressed }) => (
              <>
                <Text
                  numberOfLines={1}
                  className="shrink font-sans text-body-sm text-object-normal"
                >
                  {item.name}
                </Text>
                <ItemConditionBadge condition={item.condition} />
                <View className="ml-auto">
                  <Icon icon={CaretRightIcon} size="md" color={semantic.object.subtle} />
                </View>
                <InteractionLayer pressed={pressed} color={semantic.fill.boldest} />
              </>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

type MessageItemProps = {
  message: ChatMessage;
  onRequestItemPress?: (item: ExchangeItem) => void;
};

export function MessageItem({ message, onRequestItemPress }: MessageItemProps) {
  const mine = message.sender === 'me';

  if (message.type === 'request') {
    return (
      <View className={`w-[248px] ${mine ? 'self-end' : 'self-start'}`}>
        <RequestCard mine={mine} items={message.items} onItemPress={onRequestItemPress} />
      </View>
    );
  }

  if (message.type === 'image') {
    return (
      <Row mine={mine} sentAt={message.sentAt}>
        <Image
          source={message.uri}
          contentFit="cover"
          accessibilityLabel="보낸 사진"
          style={{ width: 200, height: 200, borderRadius: 16 }}
        />
      </Row>
    );
  }

  return (
    <Row mine={mine} sentAt={message.sentAt}>
      <View className={`rounded-2xl px-3 py-2 ${mine ? 'bg-fill-bolder' : 'bg-surface-standard'}`}>
        <Text
          className={`font-sans text-body-sm ${mine ? 'text-object-inverse-boldest' : 'text-object-bolder'}`}
        >
          {message.text}
        </Text>
      </View>
    </Row>
  );
}
