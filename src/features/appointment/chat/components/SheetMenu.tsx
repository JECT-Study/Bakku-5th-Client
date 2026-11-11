import { semantic } from '@/design-tokens';
import { CheckIcon } from 'phosphor-react-native/src/icons/Check';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconComponent, InteractionLayer } from '@/shared/components';

export type SheetMenuOption = {
  key: string;
  label: string;
  icon?: IconComponent;
  disabled?: boolean;
};

type SheetMenuProps = {
  visible: boolean;
  options: SheetMenuOption[];
  onSelect: (key: string) => void;
  onClose: () => void;
  title?: string;
  /** 선택된 항목 오른쪽에 체크 표시 */
  selectedKey?: string;
};

// 아래에서 올라오는 선택 메뉴 (채팅방 + 버튼, 날짜·시간 고르기 등)
export function SheetMenu({
  visible,
  options,
  onSelect,
  onClose,
  title,
  selectedKey,
}: SheetMenuProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="닫기"
          onPress={onClose}
          className="absolute inset-0 bg-curtain-dim"
        />
        <View
          className="mx-2 max-h-[70%] rounded-3xl bg-surface-standard pb-2"
          style={{ marginBottom: insets.bottom + 8 }}
        >
          <View className="items-center pb-1 pt-2">
            <View className="h-1 w-10 rounded-full bg-fill-subtle" />
          </View>
          {title ? (
            <Text className="px-5 pb-2 pt-3 font-sans text-label-lg font-semibold text-object-bolder">
              {title}
            </Text>
          ) : null}
          <ScrollView bounces={false}>
            {options.map((option) => {
              const selected = option.key === selectedKey;
              const color = option.disabled ? semantic.object.subtle : semantic.object.normal;
              return (
                <Pressable
                  key={option.key}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !!option.disabled, selected }}
                  disabled={option.disabled}
                  onPress={() => onSelect(option.key)}
                  className="h-12 flex-row items-center gap-3 px-5"
                >
                  {({ pressed }) => (
                    <>
                      {option.icon ? <Icon icon={option.icon} size="lg" color={color} /> : null}
                      <Text
                        className={`flex-1 font-sans text-body-md ${option.disabled ? 'text-object-subtle' : selected ? 'font-semibold text-object-boldest' : 'text-object-normal'}`}
                      >
                        {option.label}
                      </Text>
                      {selected ? (
                        <Icon icon={CheckIcon} size="lg" color={semantic.object.boldest} />
                      ) : null}
                      <InteractionLayer pressed={pressed} color={semantic.fill.boldest} />
                    </>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
