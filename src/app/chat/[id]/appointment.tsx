import { Stack, useLocalSearchParams } from 'expo-router';

import { AppointmentScreen } from '@/features/appointment/chat';

export default function AppointmentRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'slide_from_bottom' }} />
      <AppointmentScreen roomId={id} />
    </>
  );
}
