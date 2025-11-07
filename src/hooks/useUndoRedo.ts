import { useState, useCallback } from 'react';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const maxHistorySize = 50;

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const setValue = useCallback((newState: T) => {
    setState(currentState => {
      const newHistory = [...currentState.past, currentState.present];

      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }

      return {
        past: newHistory,
        present: newState,
        future: []
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(currentState => {
      const { past, present, future } = currentState;

      if (past.length === 0) return currentState;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(currentState => {
      const { past, present, future } = currentState;

      if (future.length === 0) return currentState;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const reset = useCallback((newState: T) => {
    setState({
      past: [],
      present: newState,
      future: []
    });
  }, []);

  return {
    state: state.present,
    setValue,
    undo,
    redo,
    canUndo,
    canRedo,
    reset
  };
}
