import type { Expense } from '../../types';
import type { ExpenseCategory } from '../../utils/categories';
import { CATEGORY_META } from '../../utils/categories';
import { formatCurrency } from '../../utils/currency';

interface CategoryBreakdownProps {
  expenses: Expense[];
}

export function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
  if (expenses.length === 0) return null;

  const totals = new Map<ExpenseCategory, number>();
  for (const expense of expenses) {
    const cat = (expense.category ?? 'other') as ExpenseCategory;
    totals.set(cat, (totals.get(cat) ?? 0) + expense.amount);
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const sorted = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-2">
      {sorted.map(([cat, amount]) => {
        const meta = CATEGORY_META[cat];
        const pct = total > 0 ? (amount / total) * 100 : 0;
        return (
          <div key={cat}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1.5 text-gray-700">
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </span>
              <span className="text-gray-600 font-medium">
                {formatCurrency(amount)} · {Math.round(pct)}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${meta.bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
