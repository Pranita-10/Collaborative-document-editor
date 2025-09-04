import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function DocumentEditor({ docId }) {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    socket.emit('join-document', docId);

    socket.on('load-document', (data) => {
      setContent(data);
    });

    socket.on('receive-changes', (newContent) => {
      setContent(newContent);
    });

    return () => {
      socket.off('load-document');
      socket.off('receive-changes');
    };
  }, [docId]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit('send-changes', docId, newContent);
  };

  const saveDocument = () => {
    socket.emit('save-document', docId, content);
    alert('Document saved!');
  };

  return (
    <div>
      <h2>Collaborative Document Editor</h2>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        rows={20}
        cols={80}
        placeholder="Start typing..."
      />
      <br />
      <button onClick={saveDocument}>Save Document</button>
    </div>
  );
}

export default DocumentEditor;