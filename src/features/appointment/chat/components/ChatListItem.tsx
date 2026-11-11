import { semantic } from '@/design-tokens';
import { BellSlashIcon } from 'phosphor-react-native/src/icons/BellSlash';
import { Pressable, Text, View } from 'react-native';

import { Icon, InteractionLayer, NotificationBadge, Thumbnail } from '@/shared/components';

import type { ChatRoomSummary } from '../types';
import { formatListTime } from '../utils/formatTime';
import { ExchangeStatusBadge } from './StatusBadges';

type ChatListItemProps = {
  room: ChatRoomSummary;
  onPress: () => void;
};

export function ChatListItem({ room, onPress }: ChatListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${room.nickname} 채팅방${room.unreadCount ? `, 안 읽은 메시지 ${room.unreadCount}개` : ''}`}
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-2.5"
    >
      {({ pressed }) => (
        <>
          <Thumbnail source={room.thumbnailUrl} size={56} cornerStyle="curved" variant="hollow" />
          <View className="flex-1 gap-1">
            <View className="flex-row items-center gap-1.5">
              <Text
                numberOfLines={1}
                className="shrink font-sans text-label-lg font-semibold text-object-boldest"
              >
                {room.nickname}
              </Text>
              <ExchangeStatusBadge status={room.status} hideAvailable />
              {room.muted ? (
                <Icon icon={BellSlashIcon} size="sm" color={semantic.object.subtle} />
              ) : null}
              <Text className="ml-auto pl-2 font-sans text-label-xs text-object-assistive">
                {formatListTime(room.lastMessageAt)}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text
                numberOfLines={1}
                className="flex-1 font-sans text-body-xs text-object-alternative"
              >
                {room.lastMessage}
              </Text>
              {room.unreadCount > 0 ? (
                <NotificationBadge size="md" count={room.unreadCount} />
              ) : null}
            </View>
          </View>
          <InteractionLayer pressed={pressed} color={semantic.fill.boldest} />
        </>
      )}
    </Pressable>
  );
}
