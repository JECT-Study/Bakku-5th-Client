import { ArrowUpIcon } from 'phosphor-react-native/src/icons/ArrowUp';
import { PlusIcon } from 'phosphor-react-native/src/icons/Plus';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/shared/components';

import { WIRE } from './wire';

type ChatInputProps = {
  onSend: (text: string) => void;
  onPlusPress: () => void;
};

// 채팅방 하단 입력창: 회색 둥근 칸 안에 [+] [메시지 16 (최대 4줄)] [보내기], 버튼은 흰 원 32
export function ChatInput({ onSend, onPlusPress }: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View className="bg-white px-2 pt-2" style={{ paddingBottom: insets.bottom + 8 }}>
      <View className="flex-row items-end gap-2 rounded-max bg-gray-50 p-1.5">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="사진, 약속 잡기 등 더보기"
          onPress={onPlusPress}
          className="size-8 items-center justify-center rounded-full bg-white"
        >
          <Icon icon={PlusIcon} size="lg" color={WIRE.strong} />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          placeholder="메세지를 입력하세요."
          placeholderTextColor={WIRE.alternative}
          accessibilityLabel="메시지 입력"
          className="max-h-[88px] min-h-8 flex-1 py-1 font-sans text-label-lg text-gray-900"
          style={{ textAlignVertical: 'center' }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="보내기"
          accessibilityState={{ disabled: !canSend }}
          disabled={!canSend}
          onPress={send}
          className={`size-8 items-center justify-center rounded-full ${canSend ? 'bg-gray-600' : 'bg-white'}`}
        >
          <Icon icon={ArrowUpIcon} size="lg" color={canSend ? WIRE.white : WIRE.assistive} />
        </Pressable>
      </View>
    </View>
  );
}
