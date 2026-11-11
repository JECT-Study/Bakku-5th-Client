import { semantic } from '@/design-tokens';
import { ArrowUpIcon } from 'phosphor-react-native/src/icons/ArrowUp';
import { PlusIcon } from 'phosphor-react-native/src/icons/Plus';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/shared/components';

type ChatInputProps = {
  onSend: (text: string) => void;
  onPlusPress: () => void;
};

// 채팅방 하단 입력창: [+] [메시지 입력 (최대 4줄)] [보내기]
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
    <View className="bg-surface-standard px-2 pt-2" style={{ paddingBottom: insets.bottom + 8 }}>
      <View className="flex-row items-end gap-2 rounded-[22px] bg-fill-subtlest p-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="사진, 약속 잡기 등 더보기"
          onPress={onPlusPress}
          className="size-9 items-center justify-center rounded-full bg-surface-standard"
        >
          <Icon icon={PlusIcon} size="lg" color={semantic.object.boldest} />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          placeholder="메세지를 입력하세요."
          placeholderTextColor={semantic.object.assistive}
          accessibilityLabel="메시지 입력"
          className="max-h-[88px] min-h-9 flex-1 py-2 font-sans text-body-sm text-object-bolder"
          style={{ textAlignVertical: 'center' }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="보내기"
          accessibilityState={{ disabled: !canSend }}
          disabled={!canSend}
          onPress={send}
          className={`size-9 items-center justify-center rounded-full ${canSend ? 'bg-fill-bolder' : 'bg-surface-standard'}`}
        >
          <Icon
            icon={ArrowUpIcon}
            size="lg"
            color={canSend ? semantic.object.inverse.boldest : semantic.object.subtle}
          />
        </Pressable>
      </View>
    </View>
  );
}
