import { semantic } from '@/design-tokens';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ArrowsLeftRightIcon } from 'phosphor-react-native/src/icons/ArrowsLeftRight';
import { CalendarCheckIcon } from 'phosphor-react-native/src/icons/CalendarCheck';
import { DotsThreeVerticalIcon } from 'phosphor-react-native/src/icons/DotsThreeVertical';
import { ImageIcon } from 'phosphor-react-native/src/icons/Image';
import { MapPinIcon } from 'phosphor-react-native/src/icons/MapPin';
import { Fragment, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewInstance,
  Text,
  View,
} from 'react-native';

import { EmptyState, Icon, Thumbnail, TopNavigation } from '@/shared/components';

import { getMockChatRoom } from '../api/mockChats';
import type { ChatMessage, ChatRoomDetail } from '../types';
import { isDifferentDay } from '../utils/formatTime';
import { ChatInput } from './ChatInput';
import { DateDivider, MessageItem } from './MessageItems';
import { SheetMenu } from './SheetMenu';
import { ExchangeStatusBadge } from './StatusBadges';

// E 채팅·약속-2 ~ 3: 1:1 채팅방, + 버튼 메뉴

const PLUS_MENU = [
  { key: 'photo', label: '사진', icon: ImageIcon },
  { key: 'appointment', label: '약속 잡기', icon: CalendarCheckIcon },
  { key: 'place', label: '장소 보내기 (2차)', icon: MapPinIcon, disabled: true },
];

function PostSummary({ post }: { post: ChatRoomDetail['post'] }) {
  return (
    <View className="flex-row items-center gap-3 border-b border-stroke-alpha-subtler bg-surface-standard px-4 py-3">
      <Thumbnail source={post.thumbnailUrl} size={48} cornerStyle="curved" variant="hollow" />
      <View className="flex-1 gap-0.5">
        <Text
          numberOfLines={1}
          className="font-sans text-label-lg font-semibold text-object-boldest"
        >
          {post.title}
        </Text>
        <View className="flex-row items-center gap-1">
          <Icon icon={ArrowsLeftRightIcon} size="xs" color={semantic.object.assistive} />
          <Text numberOfLines={1} className="font-sans text-label-sm text-object-alternative">
            {post.offerSummary}
          </Text>
        </View>
      </View>
      <ExchangeStatusBadge status={post.status} />
    </View>
  );
}

/** 내가 새로 보내는 메시지 (id·보낸 사람·시각은 보낼 때 채운다) */
type NewMessage = ChatMessage extends infer Message
  ? Message extends ChatMessage
    ? Omit<Message, 'id' | 'sender' | 'sentAt'>
    : never
  : never;

export function ChatRoomScreen({ roomId }: { roomId: string }) {
  const room = getMockChatRoom(roomId);
  const [messages, setMessages] = useState<ChatMessage[]>(room?.messages ?? []);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<ScrollViewInstance>(null);

  if (!room) {
    return (
      <View className="flex-1 bg-surface-standard">
        <TopNavigation type="screen" onBack={() => router.back()} />
        <View className="flex-1 justify-center">
          <EmptyState title="채팅방을 찾을 수 없어요." />
        </View>
      </View>
    );
  }

  const append = (message: NewMessage) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: `local-${Date.now()}`, sender: 'me', sentAt: new Date().toISOString() },
    ]);
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      append({ type: 'image', uri: result.assets[0].uri });
    }
  };

  const selectMenu = (key: string) => {
    setMenuOpen(false);
    if (key === 'photo') {
      pickPhoto();
    } else if (key === 'appointment') {
      router.push({ pathname: '/chat/[id]/appointment', params: { id: room.id } });
    }
  };

  return (
    <View className="flex-1 bg-surface-deep">
      <TopNavigation
        type="screen"
        title={room.partner.nickname}
        description={`교환 ${room.partner.exchangeCount}회`}
        onBack={() => router.back()}
        actions={[
          { icon: DotsThreeVerticalIcon, accessibilityLabel: '채팅방 메뉴', onPress: () => {} },
        ]}
      />
      <PostSummary post={room.post} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="gap-2 px-3 pb-4"
          keyboardDismissMode="interactive"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((message, index) => {
            const previous = messages[index - 1];
            const showDate = !previous || isDifferentDay(previous.sentAt, message.sentAt);
            return (
              <Fragment key={message.id}>
                {showDate ? <DateDivider date={message.sentAt} /> : null}
                <MessageItem message={message} />
              </Fragment>
            );
          })}
        </ScrollView>
        <ChatInput
          onSend={(text) => append({ type: 'text', text })}
          onPlusPress={() => setMenuOpen(true)}
        />
      </KeyboardAvoidingView>
      <SheetMenu
        visible={menuOpen}
        options={PLUS_MENU}
        onSelect={selectMenu}
        onClose={() => setMenuOpen(false)}
      />
    </View>
  );
}
