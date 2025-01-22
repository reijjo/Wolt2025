import "./Notification.css";

import { HTMLAttributes } from "react";

export interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  type?: "error" | "success";
  extraClass?: string;
}

export const Notification = ({
  message,
  type,
  extraClass,
  ...props
}: NotificationProps) => {
  return (
    <div
      className={`notification-${type} notification-base ${extraClass} `}
      {...props}
    >
      <p className="notification-text">{message}</p>
    </div>
  );
};
