import { Routes, Route } from "react-router-dom";
import "./App.css";
//import Home from "./routes/Home";
import Home from "./routes/Home2.0";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
        </Routes>
      </DndProvider>
    </div>
  );
}

export default App;
