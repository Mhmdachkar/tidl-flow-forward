import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { GoalId } from "@/types/quiz";

export interface QuizModalOptions {
  product?: string;
  goal?: GoalId;
}

interface QuizModalContextValue {
  isOpen: boolean;
  options: QuizModalOptions;
  openModal: (opts?: QuizModalOptions) => void;
  closeModal: () => void;
}

const QuizModalContext = createContext<QuizModalContextValue>({
  isOpen: false,
  options: {},
  openModal: () => {},
  closeModal: () => {},
});

export function QuizModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<QuizModalOptions>({});

  const openModal = useCallback((opts?: QuizModalOptions) => {
    setOptions(opts ?? {});
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <QuizModalContext.Provider value={{ isOpen, options, openModal, closeModal }}>
      {children}
    </QuizModalContext.Provider>
  );
}

export function useQuizModal() {
  return useContext(QuizModalContext);
}
