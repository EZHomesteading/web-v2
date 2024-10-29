import { FieldErrors, FieldValues, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

export type Category = 'unprocessed-produce' | 'homemade' | 'durables' | 'dairy-meat' | '';
export type SubCategory = string;
export type QuantityTypeValue = string | undefined;

export interface StepProps {
  step: number;
  category: Category;
  setCategory: (category: Category) => void;
  subCategory: SubCategory;
  setSubCategory: (subCategory: SubCategory) => void;
}

export interface CommonInputProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  disabled: boolean;
}
export interface InputProps {
  id: string;
  label: string;
  type: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  disabled: boolean;
  formatPrice?: boolean;
  required?: boolean;
  maxlength?: number;
  step?: string;
}