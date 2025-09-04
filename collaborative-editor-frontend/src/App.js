import React from 'react';
import DocumentEditor from './DocumentEditor';

function App() {
  const docId = 'my-collab-doc';

  return (
    <div className="App">
      <DocumentEditor docId={docId} />
    </div>
  );
}


export default App;