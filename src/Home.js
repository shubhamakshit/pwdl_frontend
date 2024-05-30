import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import CollapsibleConsole from "./CollapsibleConsole";
import Download from "./Download";
import Convert from "ansi-to-html";
import CodeOutput from "./CodeOutput";
import Toast from "./Toast";
import FileList from "./FileList";

const Home = () => {
    const [logs, setLogs] = useState([]);
    const [names, setNames] = useState([]);
    const [IDs, setIDs] = useState([]);
    const [downloadStarted, setDownloadStarted] = useState(false);
    const [sendDownloadRequest, setSendDownloadRequest] = useState(false);
    const [progress, setProgress] = useState([]);
    const [showFileToast, setShowFileToast] = useState(false);
    const [showFileDownloadedToast, setShowFileDownloadedToast] = useState(false);
    const [nameOfFileBeingProcessed, setNameOfFileBeingProcessed] = useState("");
    const [downloadedFiles, setDownloadedFiles] = useState([]);
    const [downloadId, setDownloadId] = useState(null);

    const socket = useRef(null);
    const clientId = localStorage.getItem('clientId');

    const addToLogs = (log) => {
        log = `[${new Date().toLocaleString()}] - ${log}`;
        setLogs((prevLogs) => [...prevLogs, log]);
    };

    const handleDownloads = () => {
        console.log("handleDownloads called ");
        setDownloadStarted(true);
        setSendDownloadRequest(true);
    };

    const handleDownloadFinished = () => {
        setDownloadStarted(false);
    };

    const handleIDChange = (arrIDs) => {
        setIDs([...arrIDs]);
    };

    const handleNameChange = (arrNames) => {
        setNames([...arrNames]);
    };

    const existingDownloadsHandler = (data) => {
        addToLogs(data.message);
        handleDownloads();

    }

    // instantiate socket connection
    useEffect(() => {
        if (!socket.current) {
            socket.current = io();
            socket.current.connect();
        }

        socket.current.emit("connect-with-client-Id", { clientId });

        socket.current.on(`successful-${clientId}`, (data) => {
            addToLogs(`Connected: ${data.connected}`);
        });

        socket.current.on(`exists-running-downloads-${clientId}`, existingDownloadsHandler);


        return () => {
            // if (socket.current) {
            //     socket.current.disconnect();
            //     socket.current = null;
            // }
        };
    }, []);

    // send download request to server
    useEffect(() => {
        if (downloadStarted) {
            addToLogs(`Downloading ${names.length} files`);
            socket.current.emit('test-pwdl', { names, IDs, clientId });
        }
    }, [downloadStarted]);


    // start listening for download response
    useEffect(() => {
        if (sendDownloadRequest) {
            socket.current.on(`download-complete-${clientId}`, (data) => {
                addToLogs(data.message);
                data.done.map((file) => {
                    addToLogs(file);
                });
                handleDownloadFinished(); // Reset downloadStarted to false
                setDownloadedFiles(data.done);
                setDownloadId(data.downloadId);
            });
        }

        return () => {
            if (sendDownloadRequest) {
                setSendDownloadRequest(false);
            }
        };
    }, [sendDownloadRequest]);



    useEffect(() => {
        const progressHandler = (data) => {

            // this is a fix for any existing open sessions
            if (!downloadStarted) setDownloadStarted(true);

            setProgress((prevProgress) => [...prevProgress, data.message]);
        };

        const nameHandler = (data) => {

            // this is a fix for any existing open sessions
            if (!downloadStarted) setDownloadStarted(true);

            setProgress([]);
            setShowFileToast(true);
            setNameOfFileBeingProcessed(data.name);
        };

        const partialCancelHandler = (data) => {
            addToLogs(`${data.name} with id ${data.id} of download_id ${data.download_id} has been cancelled`)
        };

        const partialDownloadDoneHandler = (data) => {
            addToLogs(`${data.name} with id ${data.id} of download_id ${data.download_id} has been downloaded`);
            setNameOfFileBeingProcessed(data.name);
            setShowFileDownloadedToast(true);
        }


        socket.current.on(`progress-${clientId}`, progressHandler);
        socket.current.on(`started-download-${clientId}`, nameHandler);
        socket.current.on(`partial-cancel-download-${clientId}`, partialCancelHandler);
        socket.current.on(`partial-complete-download-${clientId}`, partialDownloadDoneHandler);

        return () => {
            // socket.current.off(`progress-${clientId}`, progressHandler);
            // socket.current.off(`started-download-${clientId}`, nameHandler);
            // socket.current.off(`exists-running-downloads-${clientId}`);
        };
    }, []);

    return (
        <div>
            {downloadStarted ? <progress className="progress w-100"></progress> : null}
            <CollapsibleConsole data={logs}></CollapsibleConsole>
            <Download
                onDownloadClicked={handleDownloads}
                onIDsTyped={handleIDChange}
                onNamesTyped={handleNameChange}
                downloadInProgress={downloadStarted}
            ></Download>
            {downloadStarted ?
                <div className="w-100 rounded-lg flex justify-center items-center h-screen mb-20 ">
                    <CodeOutput
                        logs={progress}
                        nameOfFileBeingProcessed={nameOfFileBeingProcessed}
                    ></CodeOutput>

                </div>
                : null
            }

            {downloadedFiles.length > 0 ?
                <div className="space-y-4 w-100 rounded-lg flex justify-center items-center mb-20">
                    <FileList files={downloadedFiles} downloadId={downloadId}></FileList>
                </div>
                : null
                }


            {showFileToast ?
                (<Toast message={`Now Processing ${nameOfFileBeingProcessed ? nameOfFileBeingProcessed : null} `} duration={3000} onClose={() => {setShowFileToast(false)}}></Toast>)
                : null}

            {showFileDownloadedToast ?
                (<Toast message={`File ${nameOfFileBeingProcessed ? nameOfFileBeingProcessed : null} has been downloaded`} duration={3000} onClose={() => {setShowFileDownloadedToast(false)}}></Toast>)
                : null
            }


        </div>
    );
};

export default Home;
