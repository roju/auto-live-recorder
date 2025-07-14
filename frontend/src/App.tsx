import { Button } from "@/components/ui/button"
import React from "react"

function App() {
  const [count, setCount] = React.useState(0)
  const [isDarkMode, setIsDarkMode] = React.useState(
    localStorage.getItem('theme') === 'dark'
  );
  
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 grid place-items-center mx-auto py-8">
      <div className="text-blue-900 dark:text-white text-2xl font-bold flex flex-col items-center space-y-4">
        <h1>Vite + React + TS + Tailwind + shadcn/ui</h1>
        <Button onClick={() => setCount(count + 1)}>Count up ({count})</Button>
        <Button onClick={toggleDarkMode}>
          Toggle Dark Mode
        </Button>
      </div>
    </div>
  )
}

export default App
