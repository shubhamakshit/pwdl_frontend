import React from "react";

const NameIdPair = ({ pair, index, handleNameChange, handleIDChange }) => {
    return (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex flex-col w-full sm:w-1/2 p-2 ">
                {
                    index === 0 ?
                    (
                        <label htmlFor={`name-${index}`} className="text-lg font-semibold">
                            Name
                        </label>
                    )
                    : <foo></foo>
                }
                <input
                    type="text"
                    id={`name-${index}`}
                    value={pair.name}
                    onChange={(event) => handleNameChange(event, index)}
                    className="border border-gray-400 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter name"
                />
            </div>
            <div className="flex flex-col w-full sm:w-1/2 p-2 ">
                {
                    index === 0 ?
                    (
                        <label htmlFor={`id-${index}`} className="text-lg font-semibold">
                            ID
                        </label>
                    )
                    : <foo></foo>
                }
                <input
                    type="text"
                    id={`id-${index}`}
                    value={pair.id}
                    onChange={(event) => handleIDChange(event, index)}
                    className="border border-gray-400 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter ID"
                />
            </div>
        </div>
    );
};

export default NameIdPair;
