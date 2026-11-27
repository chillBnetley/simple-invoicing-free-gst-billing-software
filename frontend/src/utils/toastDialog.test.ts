import { describe, expect, test } from 'vitest';
import { DIALOG_GRACE_MS, shouldDismissOnDialogOpen } from './toastDialog';

describe('shouldDismissOnDialogOpen', () => {
  test('a success shown before a dialog opens is dismissed', () => {
    expect(shouldDismissOnDialogOpen({ successShownBeforeOpen: true, dialogCountBefore: 0, dialogCountAfter: 1 })).toBe(true);
  });

  test('a dialog opening over an already open one also dismisses', () => {
    expect(shouldDismissOnDialogOpen({ successShownBeforeOpen: true, dialogCountBefore: 1, dialogCountAfter: 2 })).toBe(true);
  });

  test('a dialog opening within the grace window after the toast shows is ignored (issue 1129)', () => {
    // The delivery-challan preview mounts about 15 ms after the toast.
    expect(
      shouldDismissOnDialogOpen({ successShownBeforeOpen: true, dialogCountBefore: 0, dialogCountAfter: 1, toastVisibleMs: 15 }),
    ).toBe(false);
    expect(
      shouldDismissOnDialogOpen({ successShownBeforeOpen: true, dialogCountBefore: 0, dialogCountAfter: 1, toastVisibleMs: DIALOG_GRACE_MS - 1 }),
    ).toBe(false);
  });

  test('a dialog opening after the grace window still dismisses the toast (issue 1110)', () => {
    expect(
      shouldDismissOnDialogOpen({ successShownBeforeOpen: true, dialogCountBefore: 0, dialogCountAfter: 1, toastVisibleMs: DIALOG_GRACE_MS }),
    ).toBe(true);
    expect(
      shouldDismissOnDialogOpen({ successShownBeforeOpen: true, dialogCountBefore: 0, dialogCountAfter: 1, toastVisibleMs: 2000 }),
    ).toBe(true);
  });

  test('a success that arrived after the dialog opened is kept', () => {
    expect(shouldDismissOnDialogOpen({ successShownBeforeOpen: false, dialogCountBefore: 0, dialogCountAfter: 1 })).toBe(false);
  });

  test('an error toast is never dismissed', () => {
    expect(
      shouldDismissOnDialogOpen({ kind: 'error', successShownBeforeOpen: true, dialogCountBefore: 0, dialogCountAfter: 1 }),
    ).toBe(false);
  });

  test('no increase in dialogs keeps the toast', () => {
    expect(shouldDismissOnDialogOpen({ successShownBeforeOpen: true, dialogCountBefore: 1, dialogCountAfter: 1 })).toBe(false);
    expect(shouldDismissOnDialogOpen({ successShownBeforeOpen: true, dialogCountBefore: 1, dialogCountAfter: 0 })).toBe(false);
  });
});
