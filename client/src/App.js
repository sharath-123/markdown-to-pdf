import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './App.css';

function App() {
    const [markdown, setMarkdown] = useState('');

    const handleDownload = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/convert',
                { markdown },
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'markdown.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('❌ Error downloading PDF:', error);
        }
    };

    return (
        <div className="app">
            <div className="editor">
                <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Write your markdown here..."
                />
                <button onClick={handleDownload}>Download as PDF</button>
            </div>
            <div className="preview">
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
        </div>
    );
}

export default App;
