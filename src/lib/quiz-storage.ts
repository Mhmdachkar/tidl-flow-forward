import {
  QUIZ_STORAGE_KEY,
  QUIZ_STORAGE_VERSION,
  createDefaultQuizData,
  type QuizFormData,
  type StoredQuizState,
} from "@/types/quiz";

function isBrowser() {
  return typeof window !== "undefined";
}

function isValidStep(step: number) {
  return Number.isInteger(step) && step >= 1 && step <= 8;
}

function mergeQuizData(partial: Partial<QuizFormData>): QuizFormData {
  return {
    ...createDefaultQuizData(),
    ...partial,
    healthConditions: partial.healthConditions ?? [],
  };
}

export function loadQuizState(): StoredQuizState | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredQuizState;
    if (parsed.version !== QUIZ_STORAGE_VERSION) return null;
    if (!isValidStep(parsed.currentStep)) return null;

    return {
      version: QUIZ_STORAGE_VERSION,
      currentStep: parsed.currentStep,
      data: mergeQuizData(parsed.data),
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

export function saveQuizState(currentStep: number, data: QuizFormData) {
  if (!isBrowser()) return;

  const payload: StoredQuizState = {
    version: QUIZ_STORAGE_VERSION,
    currentStep,
    data,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(payload));
}

export function clearQuizState() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(QUIZ_STORAGE_KEY);
}

export function getResumeStepFromSearch(searchStep?: number) {
  if (searchStep && isValidStep(searchStep)) {
    return searchStep;
  }
  return null;
}
