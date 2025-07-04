import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {

  const mainContainerStyle = {
    minHeight: '100vh',
    background: '#f5f5f5',
    padding: '20px'
  };

  return (
    <div style={mainContainerStyle}>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
