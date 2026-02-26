import { Dispatch, SetStateAction } from 'react';

interface UseLocalStorageOptions {
  encrypt?: boolean;
}

type SetValue<T> = Dispatch<SetStateAction<T>>;
type RemoveValue = () => void;

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions
): [T, SetValue<T>, RemoveValue];

export function useSecureAssessmentStorage(): [
  unknown,
  SetValue<unknown>,
  RemoveValue
];

