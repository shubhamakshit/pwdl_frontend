import React, { useEffect, useState } from "react";
import NameIdPair from "./NameIdPair";
import $ from "jquery";

const Download = ({ onNamesTyped, onIDsTyped, onDownloadClicked, downloadInProgress }) => {
    const [pairs, setPairs] = useState([{ name: "", id: "" }]);

    // function to toggle the disabled state of the input fields and buttons
    const toggleDisabled = (disable) => {
        if (disable) {
            $('button#add-pair, button#download').prop('disabled', true).addClass(['cursor-not-allowed', 'opacity-50']).removeClass(['hover:bg-blue-600', 'hover:bg-green-600']);
            $('input').prop('disabled', true);
        } else {
            $('button#add-pair, button#download').prop('disabled', false).removeClass(['cursor-not-allowed', 'opacity-50']);
            $('button#add-pair').addClass(['hover:bg-green-600']);
            $('button#download').addClass(['hover:bg-blue-600']);
            $('input').prop('disabled', false);
            // set the input fields to be enabled and clear the field
            setPairs([{ name: "", id: "" }]);
        }
    };


    // useEffect to toggle the disabled state of the input fields and buttons
    useEffect(() => {
        toggleDisabled(downloadInProgress);
    }, [downloadInProgress]);

    const handleNameChange = (event, index) => {
        const newPairs = [...pairs];
        newPairs[index].name = event.target.value;
        setPairs(newPairs);
    };

    const handleIDChange = (event, index) => {
        const newPairs = [...pairs];
        newPairs[index].id = event.target.value;
        setPairs(newPairs);
    };

    const handleAddPair = () => {
        setPairs([...pairs, { name: "", id: "" }]);
    };

    const handleDownload = () => {
        const names = pairs.map((pair) => pair.name);
        const IDs = pairs.map((pair) => pair.id);
        onNamesTyped(names);
        onIDsTyped(IDs);
        onDownloadClicked();
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl mb-4">Download</h1>
            {pairs.map((pair, index) => (
                <NameIdPair
                    key={index}
                    pair={pair}
                    index={index}
                    handleNameChange={handleNameChange}
                    handleIDChange={handleIDChange}
                />
            ))}
            <button
                onClick={handleAddPair}
                className="bg-green-500 text-white p-3 rounded-lg mt-4 hover:bg-green-600 focus:outline-none m-1"
                id="add-pair"
            >
                Add Name-ID Pair
            </button>
            <button
                onClick={handleDownload}
                className="bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none m-1"
                id="download"
            >
                Download
            </button>
        </div>
    );
};

export default Download;
