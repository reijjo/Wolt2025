import "./Notification.css";

import { HTMLAttributes } from "react";

export interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  type?: "error" | "success";
}

export const Notification = ({
  message,
  type,
  ...props
}: NotificationProps) => {
  return (
    <div className={`notification-${type} notification-base`} {...props}>
      <p className="notification-text">{message}</p>
    </div>
  );
};
