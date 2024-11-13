import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Playlist from "./pages/Playlist"

function App() {

  return (
    <>
      <div>
        <Routes>
            <Route path="/" element={<Playlist/>} />
        </Routes>
      </div>
    </>
  )
}

export default App
