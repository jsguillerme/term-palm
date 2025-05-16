import { Toaster } from "sonner"
import { GenerateTermForm } from "./components/terms-palm-form/generate-term-form"

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-nunito">
      <h1 className="text-2xl font-extrabold mb-4">Gerador de Termo de Responsabilidade</h1>
      <GenerateTermForm />
      <Toaster />
    </div>
  )
}

export default App
