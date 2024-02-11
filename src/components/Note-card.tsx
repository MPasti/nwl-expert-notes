import * as Dialog from "@radix-ui/react-dialog";

//isso faz com que a gente export tudo do react-dialog e colocamos num objeto chamado dialog
//assim podemos escrever Dialog.root para chamar o componente do react-dialog (ajuda a localizar)

import { formatDistanceToNow } from "date-fns";
//para pegar o horário salvo e subtrair pelo atual
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

//vamos mudar o button para Dialog.Trigger, que ao clicar nele vai abrir um elemento, ao clicar dnv vai fechar
//Dialog.Portal faz com que o elemento seja mostrado em outro lugar que quisermos
//Dialog.Overlay coloca o fundo preto para o
//inset no css coloca left/right/top/botton ao mesmo tempo quando queremos preencher a tela inteira com algo
//flex é um conjunto de 3 parametros, flex-grow, flex-shrink, flex-basis
//indica se um elemento pode crescer ou nao, indica se pode reduzir o tamanho ou nao, e o tamanho de base dele
//flex-grow 1 ocupa o maximo possivel, flex-shrink 1 mas se outro elemento precisar de espaço ele reduz
interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
}

//posso tirar o props, desestruturar o note e passar ele
export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  return (
    //usa um box-shadow (esse ring) para fazer os efeitos de hover
    //virar um button para dar tab e mudar de focus
    //o focus aplica o css quando clicamos no elemento, já o focus visible aplica apenas se tiver navegando pelo teclado (tab)
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 outline-none hover: ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>
        <p className="text-sm leading-6 text-slate-400">{note.content}</p>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none"></div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
            <p className="text-sm leading-6 text-slate-400">{note.content}</p>
          </div>

          <button
            type="button"
            onClick={
              () => onNoteDeleted(note.id)

              //se passamos uma função com parametros, precisamos de uma arrow function, pq esses eventos nativos esperam
              //a declaração de uma função e não a execução de uma
            }
            className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
          >
            Deseja{" "}
            <span className="text-red-400 group-hover:underline">
              apagar essa nota
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
