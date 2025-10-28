import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import CustomAlert, { type AlertAction } from './CustomAlert';

type AlertState = {
  visible: boolean;
  title?: string;
  message?: string;
  actions?: AlertAction[];
};

type ShowParams = {
  title?: string;
  message?: string;
  actions?: AlertAction[];
};

type AlertContextValue = {
  showAlert: (params: ShowParams) => Promise<void>;
  alert: (title: string, message?: string) => Promise<void>;
  hide: () => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertState>({ visible: false });
  const resolverRef = useRef<(() => void) | null>(null);

  const hide = useCallback(() => {
    setState((s) => ({ ...s, visible: false }));
    const r = resolverRef.current;
    if (r) {
      r();
      resolverRef.current = null;
    }
  }, []);

  const showAlert = useCallback((params: ShowParams) => {
    return new Promise<void>((resolve) => {
      // Ensure hide always has access to the latest resolver(was blocking the whole form for this)
      resolverRef.current = resolve;

      const wiredActions: AlertAction[] | undefined = params.actions?.map((a) => ({
        ...a,
        onPress: () => {
          a.onPress?.();
          hide();
        },
      })) ?? [
        { text: 'OK', variant: 'primary', onPress: hide },
      ];

      setState({ visible: true, title: params.title, message: params.message, actions: wiredActions });
    });
  }, [hide]);

  const alert = useCallback((title: string, message?: string) => showAlert({ title, message }), [showAlert]);

  const value = useMemo<AlertContextValue>(() => ({ showAlert, alert, hide }), [showAlert, alert, hide]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <CustomAlert
        visible={state.visible}
        title={state.title}
        message={state.message}
        actions={state.actions}
        onRequestClose={hide}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within an AlertProvider');
  return ctx;
}
