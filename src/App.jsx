import { useEffect, useState } from "react";
import Login from "./Login";
import lessons from "./lessons"; // keep your existing lessons import

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [currentLesson, setCurrentLesson] = useState(lessons[0]);

  useEffect(() => {
    const saved = localStorage.getItem("zn_user");
    if (saved) {
      setUser(JSON.parse(saved));
      setView("ide");
    }
  }, []);

  if (view === "login") {
    return (
      <Login
        onLogin={(data) => {
          const userData = {
            email: data.email,
            username: data.username,
            password: data.password, // temp (Firebase later)
            joined: new Date().toISOString(),
            streak: 1,
            points: 0
          };

          localStorage.setItem("zn_user", JSON.stringify(userData));
          setUser(userData);
          setView("ide");
        }}
      />
    );
  }

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col">
      {/* NAVBAR */}
      <nav className="h-14 flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-6">
          <div className="font-black italic text-red-500">
            ZENINLABS
          </div>

          {["PYTHON", "SQL", "HTML", "CSS", "GO", "C", "CPP", "R"].map(lang => (
            <button
              key={lang}
              className="text-[10px] font-black hover:text-red-400"
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[10px] font-black text-orange-400">
            STREAK: {user.streak}
          </div>
          <div className="text-[10px] font-black text-blue-400">
            @{user.username}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* LESSON LIST */}
        <aside className="w-64 border-r border-white/10 overflow-y-auto">
          {lessons.map((lesson, i) => (
            <div
              key={i}
              onClick={() => setCurrentLesson(lesson)}
              className={`p-4 cursor-pointer text-xs font-black ${
                currentLesson.title === lesson.title
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              MODULE {i + 1}
              <div className="text-white/70 font-normal">
                {lesson.title}
              </div>
            </div>
          ))}
        </aside>

        {/* LESSON + EDITOR */}
        <main className="flex-1 flex">
          {/* LESSON CONTENT */}
          <section className="w-1/2 p-6 overflow-y-auto">
            <h1 className="text-xl font-black mb-4">
              {currentLesson.title}
            </h1>
            <pre className="text-sm whitespace-pre-wrap text-white/80">
              {currentLesson.content}
            </pre>
          </section>

          {/* CODE EDITOR */}
          <section className="w-1/2 p-6 border-l border-white/10">
            <textarea
              className="w-full h-full bg-black/50 p-4 rounded-xl outline-none text-sm font-mono"
              placeholder="Write your code here..."
            />
          </section>
        </main>
      </div>
    </div>
  );
}

