import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ActionArea, EmptyState, TopNavigation } from '@/shared/components';

import { getMockChatRoom } from '../api/mockChats';
import { useAppointmentDraftStore } from '../store/useAppointmentDraftStore';
import { ItemCheckCard } from './SelectableCards';

// E 채팅·약속-4: 약속 잡기 > 교환할 물건 편집

export function ItemSelectScreen({ roomId }: { roomId: string }) {
  const room = getMockChatRoom(roomId);
  const storedItemIds = useAppointmentDraftStore((state) => state.selectedItemIds[roomId]);
  const setStoredItemIds = useAppointmentDraftStore((state) => state.setSelectedItemIds);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => storedItemIds ?? room?.requestItems.map((item) => item.id) ?? [],
  );

  const toggle = (itemId: string) =>
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );

  return (
    <View className="flex-1 bg-surface-deep">
      <TopNavigation
        type="screen"
        title="교환할 물건"
        onBack={() => router.back()}
        trailingLabel="새로 작성"
        onTrailingPress={() => router.push('/write')}
      />
      {room ? (
        <ScrollView contentContainerClassName="gap-2 p-4">
          {room.requestItems.map((item) => (
            <ItemCheckCard
              key={item.id}
              item={item}
              variant="elevated"
              showThumbnail
              checked={selectedIds.includes(item.id)}
              onPress={() => toggle(item.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center">
          <EmptyState title="채팅방을 찾을 수 없어요." />
        </View>
      )}
      <ActionArea
        main={{
          label: '확인',
          disabled: !room || selectedIds.length === 0,
          onPress: () => {
            setStoredItemIds(roomId, selectedIds);
            router.back();
          },
        }}
      />
    </View>
  );
}
