export const DIALOG_SELECTOR = '.modal-overlay';

/**
 * Dialogs that open within this window after a success toast first shows
 * belong to the same action (issue 1129: the delivery-challan preview
 * mounts one render after the toast, about 15 ms later) and must not clear
 * it. A dialog the user opens after the toast has been visible a moment
 * still dismisses it (issue 1110). Well below the 5 s toast lifetime.
 */
export const DIALOG_GRACE_MS = 500;

export type DialogOpenInput = {
  /** Which toast is being judged. Only a success toast is ever cleared by a dialog opening. */
  kind?: 'success' | 'error';
  /** The toast was already showing before the dialog count rose. */
  successShownBeforeOpen: boolean;
  dialogCountBefore: number;
  dialogCountAfter: number;
  /** Milliseconds the toast had been visible when the dialog count rose. */
  toastVisibleMs?: number;
};

/**
 * A success toast that was already visible when a dialog opens is dismissed (issue 1110), so it
 * does not cover the dialog's last fields. A success that arrives after the dialog opened stays,
 * and an error toast is never touched. A dialog that opens within DIALOG_GRACE_MS of the toast
 * first showing is part of the same action (issue 1129) and leaves the toast alone.
 */
export function shouldDismissOnDialogOpen({
  kind = 'success',
  successShownBeforeOpen,
  dialogCountBefore,
  dialogCountAfter,
  toastVisibleMs,
}: DialogOpenInput): boolean {
  if (kind !== 'success' || !successShownBeforeOpen) {
    return false;
  }
  if (dialogCountAfter <= dialogCountBefore) {
    return false;
  }
  if (toastVisibleMs !== undefined && toastVisibleMs < DIALOG_GRACE_MS) {
    return false;
  }
  return true;
}
