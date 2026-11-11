import { Stack, useLocalSearchParams } from 'expo-router';

import { ChatRoomScreen } from '@/features/appointment/chat';

export default function ChatRoomRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ChatRoomScreen roomId={id} />
    </>
  );
}
