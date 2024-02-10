import { useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import "./index.css";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>();

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    //para as novas ficarem primeiro
    setNotes([newNote, ...notes]);
  }

  return (
    //as margens são tudo multiplicos de 4 para ter uma consistencia (algo de design)
    //form não tem display block, então é legal usar esse w-full
    //esse space faz com que todos os elementos filhos da div tenham espaçamento entre eles
    //div para separar embaixo
    //podemos passar  valores específicos dentro do colchete
    // /depois de uma cor no tailwind permite manipular a opacidade
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="NWL Expert" />
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {notes?.map((note) => {
          return <NoteCard key={note.id} note={note} />;
        })}
      </div>
    </div>
  );
}
