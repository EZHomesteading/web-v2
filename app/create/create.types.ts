import { UserInfo } from "@/next-auth";
import { FieldValues, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

export type Category = 'unprocessed-produce' | 'homemade' | 'durables' | 'dairy-meat' | '';
export type SubCategory = string;
export type QuantityTypeValue = string | undefined;

export interface CreateListingProps {
  user: UserInfo;
  index: number;
}

export interface StepProps {
  step: number;
  category: Category;
  setCategory: (category: Category) => void;
  subCategory: SubCategory;
  setSubCategory: (subCategory: SubCategory) => void;
}

export interface InputProps {
  id: string;
  label: string;
  type: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldValues;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  maxlength?: number;
  step?: string;
}