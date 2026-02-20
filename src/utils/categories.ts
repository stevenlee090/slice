export type ExpenseCategory = 'food' | 'transport' | 'accommodation' | 'activities' | 'entertainment' | 'other';

export const CATEGORY_META: Record<ExpenseCategory, { label: string; emoji: string; bar: string }> = {
  food:          { label: 'Food & Drink',  emoji: '🍜', bar: 'bg-orange-400' },
  transport:     { label: 'Transport',     emoji: '🚗', bar: 'bg-blue-400'   },
  accommodation: { label: 'Accommodation', emoji: '🏨', bar: 'bg-purple-400' },
  activities:    { label: 'Activities',    emoji: '🎿', bar: 'bg-green-400'  },
  entertainment: { label: 'Entertainment', emoji: '🎬', bar: 'bg-pink-400'   },
  other:         { label: 'Other',         emoji: '📌', bar: 'bg-gray-400'   },
};
