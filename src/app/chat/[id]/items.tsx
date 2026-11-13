import { Stack, useLocalSearchParams } from 'expo-router';

import { ItemSelectScreen } from '@/features/appointment/chat';

export default function ItemSelectRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ItemSelectScreen roomId={id} />
    </>
  );
}
