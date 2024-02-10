import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [formContent, setFormContent] = useState("");

  function handleEdit() {
    setShouldShowOnBoarding(false);
  }

  //como é ts precisamos tipar o evento
  //ao clicar no onChange do js podemos ver sua tipagem e coloca-la aqui para o ts ajudar
  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setFormContent(e.target.value);

    if (e.target.value === "") {
      setShouldShowOnBoarding(true);
    }
  }

  function handleSubmit(e: FormEvent) {
    //para ele não fechar a modal
    e.preventDefault();
    onNoteCreated(formContent);
    formContent.length > 0 ? toast.success("Nota criada com sucesso!") : null;
    setFormContent("");
    setShouldShowOnBoarding(true);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover: ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Comece{" "}
          <span className="font-medium text-lime-400">gravando uma nota</span>{" "}
          em áudio ou{" "}
          <span className="font-medium text-lime-400">
            utilize apenas texto
          </span>
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                Adicionar nota
              </span>
              {shouldShowOnBoarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button className="font-medium text-lime-400 hover:underline">
                    gravando uma nota
                  </button>{" "}
                  em áudio ou{" "}
                  <button
                    onClick={handleEdit}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                </p>
              ) : (
                <textarea
                  value={formContent}
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleChange}
                  placeholder="Digite sua nota aqui"
                ></textarea>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
            >
              Salvar nota
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
