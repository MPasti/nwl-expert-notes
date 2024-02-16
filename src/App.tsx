import { ChangeEvent, useState } from "react";
import logo from "./assets/typescript.png";
import react from "./assets/React-icon.svg.png";
import { NewNoteCard } from "./components/New-note-card";
import { NoteCard } from "./components/Note-card";
import "./index.css";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export default function App() {
  const [search, setSearch] = useState("");
  //preciso inicializar o estado
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    //não preciso de um else, caso o de cima não seja favoravel, ele vai retornar vazio aqui
    return [];
  });

  //aqui criamos um array sem o elemento com o id que queremos deletar e filtramos e retornamos sem
  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((e) => {
      return e.id !== id;
    });

    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteUpdate(id: string, content: string) {
    const notesArray = notes.filter((e) => {
      if (id === e.id) {
        e.content = content;
        return e;
      } else {
        return e;
      }
    });

    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };
    const notesArray = [newNote, ...notes];
    //para as novas ficarem primeiro
    setNotes(notesArray);

    //precisamos salvar ele no localStorage (api do browser), e além disso precisamos transformar em JSON
    //pq ele só aceita json
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;

    setSearch(query);
  }

  //o filtro das notas
  const filteredNotes =
    search != ""
      ? notes.filter((note) =>
          //para ficar case sensitive é bom deixar tudo igual
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    //as margens são tudo multiplicos de 4 para ter uma consistencia (algo de design)
    //form não tem display block, então é legal usar esse w-full
    //esse space faz com que todos os elementos filhos da div tenham espaçamento entre eles
    //div para separar embaixo
    //podemos passar  valores específicos dentro do colchete
    // /depois de uma cor no tailwind permite manipular a opacidade
    //facil criar responsivo só usar md: sm: para ser um breakpoint
    // o tailwind é diferente, normalmente criamos o desktop e mudamos para mobile, já aqui criamos os estilos para menores
    //e alteramos para maiores
    <>
      <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0">
        <h1 className="font-bold text-3xl">
          Notes{" "}
          <img
            src={logo}
            alt="ts"
            width={"28px"}
            style={{ display: "inline" }}
          />{" "}
          +{" "}
          <img
            src={react}
            alt="react"
            width={"28px"}
            style={{ display: "inline" }}
          ></img>{" "}
          <p className="font-bold text-2xl text-purple-300">
            {" "}
            Desenvolvido por Matheus Soares Pasti
          </p>
        </h1>

        <form className="w-full">
          <input
            type="text"
            placeholder="Busque em suas notas..."
            onChange={handleSearch}
            className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          />
        </form>
        <div className="h-px bg-slate-700" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          <NewNoteCard onNoteCreated={onNoteCreated} />
          {filteredNotes?.map((note) => {
            return (
              <NoteCard
                onNoteDeleted={onNoteDeleted}
                onNoteUpdate={onNoteUpdate}
                key={note.id}
                note={note}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
