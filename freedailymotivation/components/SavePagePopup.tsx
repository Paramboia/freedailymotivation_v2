import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SavePagePopupProps {
  onClose: () => void;
}

const SavePagePopup: React.FC<SavePagePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Having fun? Save this page so you can find us anytime! ⭐</h2>
        <p className="mb-4">Since you are still here, go ahead and share some motivation with your loved ones!</p>
        <Button onClick={onClose} className="w-full">Close</Button>
      </Card>
    </div>
  );
};

export default SavePagePopup;
