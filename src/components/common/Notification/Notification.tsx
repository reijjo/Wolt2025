import "./Notification.css";

export interface NotificationProps {
  message?: string;
  type?: "error" | "success";
}

export const Notification = ({ message, type }: NotificationProps) => {
  return (
    <div className={`notification-${type} notification-base`}>
      <p className="notification-text">{message}</p>
    </div>
  );
};
