import React, { useState } from "react";
import SoftwareIdeaForm from "./SoftwareIdeaForm";
import "./styles.css";
import ShareButton from "./ShareButton";

function App() {
    return (
        <div className="app-root">
            <SoftwareIdeaForm />
            <ShareButton />
        </div>
    );
}

export default App;
