import React from "react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded bg-muted text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800"
            onClick={onCancel}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}; 