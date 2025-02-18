"use client";

import { Button } from "@/components/ui/button";
import { sendNotification } from "@/lib/notifications";

export default function TestNotification() {
  const handleClick = async () => {
    try {
      await sendNotification(
        "This is a test notification!",
        "Test Notification"
      );
      console.log("Notification sent successfully!");
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  return (
    <Button onClick={handleClick}>
      Send Test Notification
    </Button>
  );
} 