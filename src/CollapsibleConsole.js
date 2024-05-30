import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const CollapsibleConsole = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleConsole = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-black bg-opacity-80 overflow-hidden">
            <div
                className="bg-gray-800 p-3 cursor-pointer text-gray-300"
                onClick={toggleConsole}
            >
                Console <FontAwesomeIcon icon={isOpen ? faAngleDown : faAngleRight} />
            </div>
            {isOpen && (
                <div className="max-h-[30vh] overflow-y-auto">
                    {data.map((log, index) => (
                        <div key={index} className="p-1 m-1 border-b text-yellow-400">
                            {log}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollapsibleConsole;
