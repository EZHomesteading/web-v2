import { toast } from "sonner";
import { ReactNode } from "react";
import { OutfitFont } from "../fonts";

interface ToastProps {
  message: string;
  details?: React.ReactNode;
  type?: "error" | "success" | "info" | "warning";
  icon?: ReactNode;
  subtitleClassName?: string;
  messageClassName?: string;
}

const Toast = ({
  message,
  details,
  type = "error",
  icon,
  messageClassName,
  subtitleClassName,
}: ToastProps) => {
  const toastContent = (
    <div className={`${OutfitFont.className} flex items-center gap-2`}>
      {icon && <span className="icon">{icon}</span>}
      <div>
        <p className={`${messageClassName}`}>{message}</p>
        {details && (
          <p className={`text-sm text-gray-400 ${subtitleClassName}`}>
            {details}
          </p>
        )}
      </div>
    </div>
  );

  switch (type) {
    case "success":
      toast.success(toastContent, { duration: 4000 });
      break;
    case "info":
      toast.info(toastContent, { duration: 4000 });
      break;
    case "warning":
      toast.warning(toastContent, { duration: 4000 });
      break;
    default:
      toast.error(toastContent, { duration: 4000 });
      break;
  }
};

export default Toast;
