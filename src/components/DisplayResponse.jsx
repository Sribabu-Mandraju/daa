import React from 'react';
import { solarizedDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Import a dark theme
import SyntaxHighlighter from 'react-syntax-highlighter';

const DisplayResponse = ({ response }) => {
    // Extract answer from the response
    const { answer } = response;

    // Split the answer into parts
    const parts = answer.split('\n\n');

    return (
        <div className="p-4">
            {parts.map((part, index) => {
                // Check if the part contains code (indicated by "def" or other keywords)
                const isCode = part.trim().startsWith('def') || part.trim().startsWith('#') || part.includes('```');

                // Heading detection (for example, lines starting with "###")
                const isHeading = part.trim().startsWith('###');

                return (
                    <div key={index} className="mb-4">
                        {isHeading ? (
                            <h3 className="text-lg font-bold text-gray-300 mb-2">{part.replace('### ', '')}</h3>
                        ) : isCode ? (
                            <SyntaxHighlighter language="python" style={solarizedDark}>
                                {part.replace(/```(.*?)```/s, '$1')} {/* Strip out the markdown code fences */}
                            </SyntaxHighlighter>
                        ) : (
                            <p className="text-gray-200 p-2 bg-gray-800 rounded">{part}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DisplayResponse;
