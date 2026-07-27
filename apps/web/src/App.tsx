import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import CrawlPage from "./pages/CrawlPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/crawl" element={<CrawlPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;