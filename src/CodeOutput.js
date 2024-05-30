import React, { useEffect, useRef } from "react";
import Convert from "ansi-to-html";

const convert = new Convert();

const CodeOutput = ({nameOfFileBeingProcessed,logs}) => {
    const logsEndRef = useRef(null);

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [logs]);

    return (
<div className=" font-ubutnu overflow-y-auto rounded-lg w-3/4 h-3/4 max-h-100 min-h-90 p-0 m-0">
        <div className="bg-black text-white">
            <div className=" mx-auto ">
                <h1 className="text-2xl font-bold mb-4 p-4">Welcome to the Hell of PW</h1>
                {/* Add more content here */}
                <div className="overflow-y-auto p-4">
                    {logs.map((p, index) => (
                        <div key={index} className="text-m"
                             dangerouslySetInnerHTML={{__html: convert.toHtml(p)}}></div>
                    ))}
                    <div ref={logsEndRef}/>
                </div>
            </div>
        </div>
    <div>
        <h1 className="text-2xl font-bold mb-4 bg-primary p-4 m-0 w-100 text-white rounded-lg">{nameOfFileBeingProcessed}</h1>
    </div>
</div>
    );
};

export default CodeOutput;