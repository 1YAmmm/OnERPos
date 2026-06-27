// src/hooks/useAppToast.js
import { useToast } from '../components/common/Toast';

export function useAppToast() {
  const toast = useToast();

  return {
    // ── Employees ──────────────────────────────────────────────────────────
    employee: {
      created: (name) =>
        toast.success('Employee added', {
          message: `${name} has been registered.`,
        }),
      updated: (name) =>
        toast.success('Employee updated', {
          message: `${name}'s details have been saved.`,
        }),
      deleted: (name, onUndo) =>
        toast.error('Employee deleted', {
          message: `${name} has been removed.`,
          action: onUndo ? { label: 'Undo', onClick: onUndo } : undefined,
        }),
      fetchFailed: () =>
        toast.error('Failed to load employees', {
          message: 'Check your connection and refresh.',
        }),
      saveFailed: (err) =>
        toast.error('Failed to save', {
          message: err ?? 'Something went wrong.',
        }),
    },

    // ── Auth ───────────────────────────────────────────────────────────────
    auth: {
      loggedIn: (name) =>
        toast.success(`Welcome back${name ? `, ${name}` : ''}!`),
      loggedOut: () => toast.info('Signed out'),
      sessionExpiring: () =>
        toast.warning('Session expiring', {
          message: "You'll be signed out in 5 minutes.",
        }),
      unauthorized: () =>
        toast.error('Access denied', {
          message: "You don't have permission to do that.",
        }),
    },

    // ── Generic ────────────────────────────────────────────────────────────
    saved: () => toast.success('Changes saved'),
    networkError: () =>
      toast.error('Connection error', {
        message: 'Check your network and try again.',
      }),
    exportStarted: () =>
      toast.info('Export running', {
        message: "We'll notify you when it's done.",
        duration: 0,
      }),
    copied: () => toast.success('Copied to clipboard'),
  };
}
