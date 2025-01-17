import "./Notification.css";

interface NotificationProps {
  message?: string;
  type?: string;
}

export const Notification = ({ message, type }: NotificationProps) => {
  return (
    <div className={`notification-${type} notification-base`}>
      <p className="notification-text">{message}</p>
    </div>
  );
};
