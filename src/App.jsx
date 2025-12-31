import Login from "./Login";
import lessons from "./lessons";
import Mascot from "./components/Mascot";
import CodeEditor from "./components/CodeEditor";
import { useUser } from "./context/UserContext";

export default function App() {
  const { user, completeLesson } = useUser();
  const [current, setCurrent] = useState(lessons[0]);

  if (!user) return <Login />;

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col">
      <nav className="h-14 flex items-center px-6 gap-4 border-b">
        <Mascot />
        <span className="font-black italic">ZENINLABS</span>
        <span className="ml-auto text-xs">XP {user.xp}</span>
      </nav>

      <div className="flex flex-1">
        <aside className="w-64 border-r overflow-y-auto">
          {lessons.map(l => (
            <div
              key={l.id}
              onClick={() => setCurrent(l)}
              className="p-4 hover:bg-white/5 cursor-pointer"
            >
              {l.title}
            </div>
          ))}
        </aside>

        <main className="flex flex-1">
          <section className="w-1/2 p-6">
            <h1 className="text-xl font-black">{current.title}</h1>
            <pre className="mt-4 text-sm">{current.content}</pre>

            <button
              onClick={() => completeLesson(current.course, current.id)}
              className="mt-6 bg-green-600 px-4 py-2 rounded"
            >
              Mark Complete (+10 XP)
            </button>
          </section>

          <section className="w-1/2 border-l">
            <CodeEditor language={current.language} />
          </section>
        </main>
      </div>
    </div>
  );
}


