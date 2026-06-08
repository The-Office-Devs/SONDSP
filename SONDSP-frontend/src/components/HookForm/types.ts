import type { ReactNode } from "react"
import type { FieldPath, FieldValues } from "react-hook-form"

export type Ui = 'desktop' | 'mobile';

export interface BaseFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  label: string
  id?: string
  placeholder?: string
  ui?: Ui
}

export interface TextFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  hasWhiteBackground?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
}

export interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: { value: string; label: string }[]
}

export interface TextAreaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  rows?: number
}

export interface InputGroupFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel'
  prefix?: ReactNode
  suffix?: {
    type: 'text'
    content: ReactNode
  } | {
    type: 'button'
    label: ReactNode
    onClick: () => void
  }
}
