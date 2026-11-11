import { create } from 'zustand';

// 약속 잡기 화면과 '교환할 물건' 편집 화면이 함께 쓰는 선택 상태 (채팅방별)
type AppointmentDraftState = {
  selectedItemIds: Record<string, string[]>;
  setSelectedItemIds: (roomId: string, itemIds: string[]) => void;
};

export const useAppointmentDraftStore = create<AppointmentDraftState>((set) => ({
  selectedItemIds: {},
  setSelectedItemIds: (roomId, itemIds) =>
    set((state) => ({ selectedItemIds: { ...state.selectedItemIds, [roomId]: itemIds } })),
}));
