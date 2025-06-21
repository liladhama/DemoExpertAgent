import { useEffect } from 'react';
import DrevsOnboardingDialog from './components/DrevsOnboardingDialog';

function App() {
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.expand) {
      window.Telegram.WebApp.expand();
    }
  }, []);

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