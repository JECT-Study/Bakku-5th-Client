import { semantic } from '@/design-tokens';
import { router } from 'expo-router';
import { CaretRightIcon } from 'phosphor-react-native/src/icons/CaretRight';
import { ClockIcon } from 'phosphor-react-native/src/icons/Clock';
import { MapPinIcon } from 'phosphor-react-native/src/icons/MapPin';
import { type ReactNode, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  ActionArea,
  Chip,
  EmptyState,
  Icon,
  LabelButton,
  Thumbnail,
  TopNavigation,
} from '@/shared/components';

import { getMockChatRoom } from '../api/mockChats';
import { useAppointmentDraftStore } from '../store/useAppointmentDraftStore';
import { formatClock, formatMonthDay } from '../utils/formatTime';
import { ItemCheckCard, OptionCard } from './SelectableCards';
import { SheetMenu } from './SheetMenu';
import { ItemConditionBadge } from './StatusBadges';

// E 채팅·약속-4: 약속 잡기
// - 일반 교환(scheduled): 교환할 물건(편집) · 날짜 · 시간 · 장소 · 약속 전 알림
// - 지금 바로(now): 날짜 · 시간(지금 바로) · 장소 · 교환할 물건(체크) · 안내 문구

const REMINDERS = [
  { key: 'off', label: '끄기' },
  { key: '10', label: '10분 전' },
  { key: '30', label: '30분 전' },
  { key: '60', label: '1시간 전' },
];

type Sheet = 'date' | 'time' | null;

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** 오늘을 뺀 앞으로 14일 */
function upcomingDays(today: Date) {
  return Array.from({ length: 14 }, (_, index) => {
    const date = startOfDay(today);
    date.setDate(date.getDate() + index + 1);
    return date;
  });
}

/** 30분 단위 시간. 오늘이면 지금 이후만 */
function timeSlots(day: Date, now: Date) {
  const slots: Date[] = [];
  for (let minutes = 9 * 60; minutes <= 22 * 60; minutes += 30) {
    const slot = startOfDay(day);
    slot.setMinutes(minutes);
    if (slot > now) slots.push(slot);
  }
  return slots;
}

function Section({
  title,
  trailing,
  children,
}: {
  title: string;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-sans text-label-md font-semibold text-object-bolder">{title}</Text>
        {trailing}
      </View>
      {children}
    </View>
  );
}

function FieldButton({
  label,
  placeholder,
  leading,
  trailing,
  onPress,
}: {
  label?: string;
  placeholder: string;
  leading?: ReactNode;
  trailing: ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-[52px] flex-row items-center gap-2 rounded-xl border border-stroke-alpha-subtler px-4"
    >
      {leading}
      <Text
        className={`flex-1 font-sans text-body-md ${label ? 'text-object-bolder' : 'text-object-assistive'}`}
      >
        {label ?? placeholder}
      </Text>
      {trailing}
    </Pressable>
  );
}

export function AppointmentScreen({ roomId }: { roomId: string }) {
  const room = getMockChatRoom(roomId);
  const [now] = useState(() => new Date());
  const storedItemIds = useAppointmentDraftStore((state) => state.selectedItemIds[roomId]);
  const setStoredItemIds = useAppointmentDraftStore((state) => state.setSelectedItemIds);

  const [dateMode, setDateMode] = useState<'today' | 'pick'>('today');
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const [timeMode, setTimeMode] = useState<'now' | 'pick'>('now');
  const [pickedTime, setPickedTime] = useState<Date | null>(null);
  const [reminder, setReminder] = useState<string | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null);

  const day = dateMode === 'today' ? startOfDay(now) : pickedDate;
  const days = useMemo(() => upcomingDays(now), [now]);
  const slots = useMemo(() => (day ? timeSlots(day, now) : []), [day, now]);

  if (!room) {
    return (
      <View className="flex-1 bg-surface-standard">
        <TopNavigation type="screen" backType="close" onBack={() => router.back()} />
        <View className="flex-1 justify-center">
          <EmptyState title="채팅방을 찾을 수 없어요." />
        </View>
      </View>
    );
  }

  const isNow = room.post.timing === 'now';
  const selectedIds = storedItemIds ?? room.requestItems.map((item) => item.id);
  const selectedItems = room.requestItems.filter((item) => selectedIds.includes(item.id));
  // '지금 바로'는 오늘만 고를 수 있을 때만 의미가 있다
  const showNowOption = isNow && dateMode === 'today';
  const hasTime = showNowOption && timeMode === 'now' ? true : pickedTime !== null;
  const canSubmit = day !== null && hasTime && selectedItems.length > 0;

  const toggleItem = (itemId: string) => {
    const next = selectedIds.includes(itemId)
      ? selectedIds.filter((id) => id !== itemId)
      : [...selectedIds, itemId];
    setStoredItemIds(room.id, next);
  };

  const selectDay = (mode: 'today' | 'pick', date: Date | null) => {
    setDateMode(mode);
    setPickedDate(date);
    // 날짜가 바뀌면 그날 고를 수 없는 시간이 남지 않게 시간을 다시 고르게 한다
    setPickedTime(null);
  };

  const timeSection = showNowOption ? (
    <View className="gap-2">
      <OptionCard
        title="지금 바로"
        subtitle={formatClock(now)}
        selected={timeMode === 'now'}
        onPress={() => setTimeMode('now')}
      />
      <OptionCard
        title={pickedTime && timeMode === 'pick' ? formatClock(pickedTime) : '시간 선택'}
        selected={timeMode === 'pick'}
        onPress={() => {
          setTimeMode('pick');
          setSheet('time');
        }}
      />
    </View>
  ) : (
    <FieldButton
      label={pickedTime ? formatClock(pickedTime) : undefined}
      placeholder="시간 선택"
      onPress={() => setSheet('time')}
      trailing={<Icon icon={ClockIcon} size="lg" color={semantic.object.normal} />}
    />
  );

  return (
    <View className="flex-1 bg-surface-standard">
      <TopNavigation
        type="screen"
        backType="close"
        title={isNow ? '약속 잡기' : '교환 약속'}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerClassName="gap-8 px-4 pb-6 pt-4">
        {isNow ? null : (
          <Section
            title="교환할 물건"
            trailing={
              <LabelButton
                hierarchy="tertiary"
                size="sm"
                onPress={() =>
                  router.push({ pathname: '/chat/[id]/items', params: { id: room.id } })
                }
              >
                편집
              </LabelButton>
            }
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4"
              contentContainerClassName="gap-2 px-4"
            >
              {selectedItems.map((item) => (
                <View key={item.id} className="w-32 gap-1.5">
                  <Thumbnail
                    source={item.imageUrl}
                    size={128}
                    cornerStyle="curved"
                    variant="hollow"
                  />
                  <Text numberOfLines={1} className="font-sans text-body-sm text-object-bolder">
                    {item.name}
                  </Text>
                  <ItemConditionBadge condition={item.condition} />
                </View>
              ))}
            </ScrollView>
            {selectedItems.length === 0 ? (
              <Text className="font-sans text-body-sm text-object-alternative">
                교환할 물건을 골라주세요.
              </Text>
            ) : null}
          </Section>
        )}

        <Section title="날짜">
          <View className="gap-2">
            <OptionCard
              title="오늘"
              subtitle={formatMonthDay(now)}
              selected={dateMode === 'today'}
              onPress={() => selectDay('today', null)}
            />
            <OptionCard
              title="날짜 선택"
              subtitle={pickedDate ? formatMonthDay(pickedDate) : undefined}
              selected={dateMode === 'pick'}
              onPress={() => setSheet('date')}
            />
          </View>
        </Section>

        <Section title="시간">{timeSection}</Section>

        <Section title="장소">
          <FieldButton
            label={room.post.place}
            placeholder="장소 선택"
            leading={
              <Icon icon={MapPinIcon} size="lg" weight="fill" color={semantic.object.normal} />
            }
            trailing={<Icon icon={CaretRightIcon} size="lg" color={semantic.object.subtle} />}
          />
        </Section>

        {isNow ? (
          <Section title="교환할 물건">
            <View className="gap-2">
              {room.requestItems.map((item) => (
                <ItemCheckCard
                  key={item.id}
                  item={item}
                  checked={selectedIds.includes(item.id)}
                  onPress={() => toggleItem(item.id)}
                />
              ))}
            </View>
          </Section>
        ) : (
          <Section title="약속 전 알림">
            <View className="flex-row flex-wrap gap-2">
              {REMINDERS.map((option) => (
                <Chip
                  key={option.key}
                  size="md"
                  hierarchy={reminder === option.key ? 'primary' : 'secondary'}
                  variant={reminder === option.key ? 'solid' : 'outlined'}
                  accessibilityState={{ selected: reminder === option.key }}
                  onPress={() => setReminder(option.key)}
                >
                  {option.label}
                </Chip>
              ))}
            </View>
          </Section>
        )}

        {isNow ? (
          <Text className="font-sans text-body-2xs text-object-assistive">
            약속 1시간 전부터 취소하면 매너 지표에 반영돼요. 그 전에는 자유롭게 취소할 수 있어요.
            약속 30분 뒤 교환했는지 물어봐요.
          </Text>
        ) : null}
      </ScrollView>

      <ActionArea
        main={{
          label: isNow ? '약속 제안하기' : '약속 잡기',
          disabled: !canSubmit,
          // TODO: 약속 제안 API 연결 후 채팅방에 약속 제안 카드(채팅·약속-5)를 보낸다
          onPress: () => router.back(),
        }}
      />

      <SheetMenu
        visible={sheet === 'date'}
        title="날짜 선택"
        options={days.map((date) => ({ key: date.toISOString(), label: formatMonthDay(date) }))}
        selectedKey={pickedDate?.toISOString()}
        onSelect={(key) => {
          selectDay('pick', new Date(key));
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
      <SheetMenu
        visible={sheet === 'time'}
        title="시간 선택"
        options={slots.map((slot) => ({ key: slot.toISOString(), label: formatClock(slot) }))}
        selectedKey={pickedTime?.toISOString()}
        onSelect={(key) => {
          setPickedTime(new Date(key));
          setTimeMode('pick');
          setSheet(null);
        }}
        onClose={() => {
          if (!pickedTime) setTimeMode('now');
          setSheet(null);
        }}
      />
    </View>
  );
}
