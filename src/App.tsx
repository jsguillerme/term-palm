import { Toaster } from "sonner"
import { GenerateTermForm } from "./components/terms-palm-form/generate-term-form"

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-nunito">
      <span className="flex flex-col items-center justify-center">
        <img
          src="/alvoar.png"
          alt="Logo"
          className="w-16 h-16 mb-4"
        />
        <h1 className="text-2xl font-extrabold mb-4 text-2xl text-white">Gerador de Termo de Responsabilidade</h1>
      </span>
      <GenerateTermForm />
      <Toaster />
    </div>
  )
}

export default App
