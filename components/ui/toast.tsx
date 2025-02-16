import { toast, type ExternalToast, type ToastT } from "sonner";
import { ReactNode } from "react";
import { OutfitFont } from "../fonts";

type ToastTypes =
  | "normal"
  | "action"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "loading"
  | "default";

interface CustomToastProps extends Omit<ExternalToast, "type"> {
  message?: ReactNode;
  details?: ReactNode;
  type?: ToastTypes;
  icon?: ReactNode;
  subtitleClassName?: string;
  messageClassName?: string;
  iconClassName?: string;
  children?: ReactNode;
}

const createToastContent = ({
  message,
  details,
  icon,
  messageClassName = "",
  subtitleClassName = "",
  iconClassName = "",
  children,
}: CustomToastProps) => (
  <div className={`${OutfitFont.className} flex items-center gap-2`}>
    {icon && <span className={iconClassName}>{icon}</span>}
    {children}
    {(message || details) && (
      <div className="flex flex-col">
        {message && <p className={messageClassName}>{message}</p>}
        {details && (
          <p className={`text-sm text-gray-400 ${subtitleClassName}`}>
            {details}
          </p>
        )}
      </div>
    )}
  </div>
);

const Toast = ({
  type = "default",
  duration = 4000,
  position = "bottom-right",
  ...props
}: CustomToastProps) => {
  const toastContent = createToastContent(props);
  const toastOptions: ExternalToast = {
    duration,
    position,
    ...props,
  };

  switch (type) {
    case "success":
      return toast.success(toastContent, toastOptions);
    case "info":
      return toast.info(toastContent, toastOptions);
    case "warning":
      return toast.warning(toastContent, toastOptions);
    case "error":
      return toast.error(toastContent, toastOptions);
    case "loading":
      return toast.loading(toastContent, toastOptions);
    default:
      return toast(toastContent, toastOptions);
  }
};

export const successToast = (props: Omit<CustomToastProps, "type">) =>
  Toast({ ...props, type: "success" });

export const errorToast = (props: Omit<CustomToastProps, "type">) =>
  Toast({ ...props, type: "error" });

export const infoToast = (props: Omit<CustomToastProps, "type">) =>
  Toast({ ...props, type: "info" });

export const warningToast = (props: Omit<CustomToastProps, "type">) =>
  Toast({ ...props, type: "warning" });

export const loadingToast = (props: Omit<CustomToastProps, "type">) =>
  Toast({ ...props, type: "loading" });

export const promiseToast = <T,>({
  promise,
  loading,
  success,
  error,
  ...props
}: Omit<CustomToastProps, "type"> & {
  promise: Promise<T>;
  loading?: ReactNode;
  success?: ReactNode | ((data: T) => ReactNode);
  error?: ReactNode | ((error: any) => ReactNode);
}) => {
  return toast.promise(promise, {
    loading: createToastContent({ ...props, message: loading }),
    success: (data) =>
      createToastContent({
        ...props,
        message: typeof success === "function" ? success(data) : success,
      }),
    error: (err) =>
      createToastContent({
        ...props,
        message: typeof error === "function" ? error(err) : error,
      }),
    ...props,
  });
};

export default Toast;
