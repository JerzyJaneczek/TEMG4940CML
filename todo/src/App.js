import "./App.css";
import Home from "./routes/Home";
import { Route, Routes } from "react-router-dom";

import { createTheme, colors, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Roboto",
      "Nunito",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  palette: {
    main: {
      main: "#285943",
      light: "#77AF9C",
      calm: "#8CD790",
      lightest: "#D7FFF1",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
