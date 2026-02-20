import type { ParticipantId, ExpenseSplit } from '../types';
import { roundCents } from './currency';

/**
 * Compute equal splits for a given total amount among participants.
 * Handles cent rounding by distributing the remainder to the first participant.
 */
export function computeEqualSplits(
  amount: number,
  participantIds: ParticipantId[]
): ExpenseSplit[] {
  if (participantIds.length === 0) return [];

  const perPerson = Math.floor((amount * 100) / participantIds.length) / 100;
  const remainder = roundCents(amount - perPerson * participantIds.length);

  return participantIds.map((participantId, i) => ({
    participantId,
    amount: i === 0 ? roundCents(perPerson + remainder) : perPerson,
  }));
}
