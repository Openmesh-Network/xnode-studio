import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    curValue: string;
}

const TextInputPopup: React.FC<Props> = ({ isOpen, onClose, setInputValue,curValue }) => {
    const [localInputValue, setLocalInputValue] = useState(curValue);

    const handleSave = () => {
        setInputValue(localInputValue);
        setLocalInputValue('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl mb-4">Enter your SSH key</h2>
                <textarea
                    value={localInputValue}
                    onChange={(e) => setLocalInputValue(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full mb-4 h-32 resize-none"
                    placeholder="Enter ssh key..."
                />
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextInputPopup;
