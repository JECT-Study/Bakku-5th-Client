import { semantic } from '@/design-tokens';
import { Pressable, Text, View } from 'react-native';

import { Checkbox, InteractionLayer, Radio, Thumbnail } from '@/shared/components';

import type { ExchangeItem } from '../types';
import { ItemConditionBadge } from './StatusBadges';

const OUTLINE = {
  selected: 'border-[1.5px] border-stroke-bold',
  idle: 'border border-stroke-alpha-subtler',
};

/** 라디오가 붙은 선택 카드 (예: 오늘 / 날짜 선택) */
export function OptionCard({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      className={`min-h-[52px] flex-row items-center gap-3 rounded-xl px-4 py-3 ${selected ? OUTLINE.selected : OUTLINE.idle}`}
    >
      {({ pressed }) => (
        <>
          <View className="flex-1 gap-0.5">
            <Text className="font-sans text-label-lg font-medium text-object-bolder">{title}</Text>
            {subtitle ? (
              <Text className="font-sans text-label-sm text-object-alternative">{subtitle}</Text>
            ) : null}
          </View>
          <View style={{ pointerEvents: 'none' }}>
            <Radio checked={selected} />
          </View>
          <InteractionLayer pressed={pressed} color={semantic.fill.boldest} radius={12} />
        </>
      )}
    </Pressable>
  );
}

/** 체크박스가 붙은 물건 카드. outlined 는 흰 화면, elevated 는 회색 배경 위에서 쓴다 */
export function ItemCheckCard({
  item,
  checked,
  onPress,
  variant = 'outlined',
  showThumbnail = false,
}: {
  item: ExchangeItem;
  checked: boolean;
  onPress: () => void;
  variant?: 'outlined' | 'elevated';
  showThumbnail?: boolean;
}) {
  const container =
    variant === 'elevated'
      ? 'rounded-2xl bg-surface-standard p-3'
      : `rounded-xl px-4 py-3 ${checked ? OUTLINE.selected : OUTLINE.idle}`;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={item.name}
      onPress={onPress}
      className={`flex-row items-center gap-3 ${container}`}
    >
      {({ pressed }) => (
        <>
          {showThumbnail ? (
            <Thumbnail source={item.imageUrl} size={64} cornerStyle="curved" variant="hollow" />
          ) : null}
          <View
            className={`flex-1 ${showThumbnail ? 'items-start gap-1' : 'flex-row items-center gap-1.5'}`}
          >
            <Text numberOfLines={1} className="shrink font-sans text-body-md text-object-bolder">
              {item.name}
            </Text>
            <ItemConditionBadge condition={item.condition} />
          </View>
          <View style={{ pointerEvents: 'none' }}>
            <Checkbox status={checked ? 'checked' : 'unchecked'} />
          </View>
          <InteractionLayer
            pressed={pressed}
            color={semantic.fill.boldest}
            radius={variant === 'elevated' ? 16 : 12}
          />
        </>
      )}
    </Pressable>
  );
}
