import { Toaster } from "sonner"
import { GenerateTermForm } from "./components/terms-palm-form/generate-term-form"

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-nunito p-8">
      <GenerateTermForm />
      <Toaster />
    </div>
  )
}

export default App
