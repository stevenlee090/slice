import type { Expense, ParticipantId } from '../types';
import { roundCents } from './currency';

export interface Transaction {
  fromId: ParticipantId;
  toId: ParticipantId;
  amount: number;
}

export interface NetBalance {
  participantId: ParticipantId;
  net: number; // positive = owed money, negative = owes money
}

/**
 * Compute net balances for all participants across all expenses.
 * net = total_paid - total_owed
 */
export function computeNetBalances(expenses: Expense[]): NetBalance[] {
  const balances = new Map<ParticipantId, number>();

  for (const expense of expenses) {
    // Payer gets credit for the full amount
    balances.set(
      expense.payerId,
      (balances.get(expense.payerId) ?? 0) + expense.amount
    );

    // Each participant owes their split amount
    for (const split of expense.splits) {
      balances.set(
        split.participantId,
        (balances.get(split.participantId) ?? 0) - split.amount
      );
    }
  }

  return Array.from(balances.entries()).map(([participantId, net]) => ({
    participantId,
    net: roundCents(net),
  }));
}

/**
 * Greedy debt minimization algorithm.
 * Matches largest debtor with largest creditor until all debts settled.
 * Returns minimum number of transactions to settle all debts.
 */
export function minimizeTransactions(balances: NetBalance[]): Transaction[] {
  const transactions: Transaction[] = [];

  // Separate into creditors (positive net) and debtors (negative net)
  const creditors = balances
    .filter((b) => b.net > 0.001)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.net - a.net);

  const debtors = balances
    .filter((b) => b.net < -0.001)
    .map((b) => ({ ...b }))
    .sort((a, b) => a.net - b.net); // most negative first

  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];

    const amount = roundCents(Math.min(creditor.net, -debtor.net));

    if (amount > 0.001) {
      transactions.push({
        fromId: debtor.participantId,
        toId: creditor.participantId,
        amount,
      });
    }

    creditor.net = roundCents(creditor.net - amount);
    debtor.net = roundCents(debtor.net + amount);

    if (creditor.net < 0.001) ci++;
    if (debtor.net > -0.001) di++;
  }

  return transactions;
}

/**
 * Full settlement computation: balances + minimized transactions.
 */
export function computeSettlement(expenses: Expense[]): {
  balances: NetBalance[];
  transactions: Transaction[];
} {
  const balances = computeNetBalances(expenses);
  const transactions = minimizeTransactions(balances);
  return { balances, transactions };
}
