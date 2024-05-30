import React, { useState } from 'react';

const download = (downloadId, clientId, fileName, setProgress) => {

    console.log(`DownloafdId : ${downloadId}`)

    fetch(`/get?downloadId=${downloadId}&clientId=${clientId}&fileName=${fileName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/octet-stream' // Assuming binary file download
        },
        // Set credentials to 'include' if your API requires authentication
        // credentials: 'include',
        // Add other necessary options like headers, credentials, etc.
    })
        .then(response => {
            const total = parseInt(response.headers.get('Content-Length'));
            let loaded = 0;

            const reader = response.body.getReader();
            return new ReadableStream({
                start(controller) {
                    // Read chunks of data and update the progress
                    function read() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            loaded += value.byteLength;
                            const progress = Math.round((loaded / total) * 100);
                            setProgress(progress);
                            controller.enqueue(value);
                            read();
                        });
                    }
                    read();
                }
            });
        })
        .then(stream => new Response(stream))
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            setProgress(0); // Reset progress after download completes
        })
        .catch(e => console.error(e));
}

const FileList = ({ files, downloadId }) => {
    const [progressMap, setProgressMap] = useState({});

    const updateProgress = (downloadId, progress) => {
        setProgressMap(prevMap => ({
            ...prevMap,
            [downloadId]: progress
        }));
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg w-100 w-2/5">
            <h2 className="text-xl font-bold mb-4">Files</h2>
            <ul>
                {files.map((file, index) => {
                    const fileDownloadId = `${downloadId}_${index}`; // Unique download ID for each file
                    return (
                        <li key={index} className="flex items-center py-2">
                            {/*<span className="material-symbols-outlined">download</span>*/}
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                 className="bi bi-cloud-download-fill text-black" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.5a.5.5 0 0 1 1 0V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0m-.354 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V11h-1v3.293l-2.146-2.147a.5.5 0 0 0-.708.708z"/>
                            </svg>
                            <a
                                href={'#'}
                                onClick={() => {
                                    download(downloadId, localStorage.getItem('clientId'), file, progress => updateProgress(fileDownloadId, progress));
                                }}
                                className="text-blue-500 hover:text-blue-700 ml-2"
                            >
                                {file}
                            </a>
                            {progressMap[fileDownloadId] !== undefined && (
                                <div className="relative pt-1 w-full">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span
                                                className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                {progressMap[fileDownloadId]}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                        <div
                                            style={{width: `${progressMap[fileDownloadId]}%`}}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default FileList;
