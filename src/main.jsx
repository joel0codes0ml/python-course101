import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./Login.jsx";
import "./index.css";

function Root() {
  const [user, setUser] = useState(null);

  // onLogin callback to set the user after login/register
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  // If no user, show Login page
  if (!user) return <Login onLogin={handleLogin} />;

  // If user exists, show main App
  return <App user={user} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);




