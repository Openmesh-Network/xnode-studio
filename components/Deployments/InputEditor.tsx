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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/75">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl"> Enter your SSH keys separated by newlines </h2>
                <textarea
                    value={localInputValue}
                    onChange={(e) => setLocalInputValue(e.target.value)}
                    className="mb-4 h-32 w-full resize-none text-nowrap rounded border border-gray-300 p-2"
                    placeholder="Enter ssh key..."
                />
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextInputPopup;
