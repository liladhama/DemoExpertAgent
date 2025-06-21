import DrevsOnboardingDialog from './components/DrevsOnboardingDialog';

function App() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <div className="App">
        <DrevsOnboardingDialog />
      </div>
    </div>
  );
}

export default App;