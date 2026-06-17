export interface ReservationInput {
  itemId: unknown;
  guestName: unknown;
}

export interface ValidationResult {
  valid: boolean;
  parsedItemId?: number;
  trimmedName?: string;
  error?: { error: string; detail: string };
}

export function validateReservation(input: ReservationInput): ValidationResult {
  const { itemId, guestName } = input;

  // Validate itemId: must be a positive integer
  if (itemId === undefined || itemId === null) {
    return {
      valid: false,
      error: {
        error: 'Validation failed',
        detail: 'itemId is required',
      },
    };
  }

  const parsedItemId = Number(itemId);
  if (!Number.isInteger(parsedItemId) || parsedItemId <= 0) {
    return {
      valid: false,
      error: {
        error: 'Validation failed',
        detail: 'itemId must be a positive integer',
      },
    };
  }

  // Validate guestName: must be a non-empty string after trimming
  if (guestName === undefined || guestName === null || typeof guestName !== 'string') {
    return {
      valid: false,
      error: {
        error: 'Validation failed',
        detail: 'guestName is required and must be a string',
      },
    };
  }

  const trimmedName = guestName.trim();
  if (trimmedName.length === 0) {
    return {
      valid: false,
      error: {
        error: 'Validation failed',
        detail: 'guestName must not be empty',
      },
    };
  }

  if (trimmedName.length > 100) {
    return {
      valid: false,
      error: {
        error: 'Validation failed',
        detail: 'guestName must not exceed 100 characters',
      },
    };
  }

  return { valid: true, parsedItemId, trimmedName };
}
