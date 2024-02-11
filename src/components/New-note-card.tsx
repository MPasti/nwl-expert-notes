import * as Dialog from "@radix-ui/react-dialog";
import { Keyboard, Mic, X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
  onNoteDeleted: (id: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [formContent, setFormContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);

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
    if (formContent === "") {
      return;
    }

    onNoteCreated(formContent);

    setFormContent("");
    setShouldShowOnBoarding(true);

    toast.success("Nota criada com sucesso!!");
  }

  function handleRecording() {
    //para verificar caso o navegador suporta, ver pelo can I Use
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("Seu navegador não suporta a gravação de áudio!");
      return;
    }

    setIsRecording(true);
    setShouldShowOnBoarding(false);
    //para outros navegadores/chrome
    //precisa baixar um pacote para o TS não dar pau
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    //para ele continuar gravando até pedir para parar
    speechRecognition.continuous = true;
    //para trazer apenas uma alternativa de uma palavra dificil que você falou
    speechRecognition.maxAlternatives = 1;
    //para as alternativas aparecerem na hora e não quando acabar
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (e) => {
      //para quando terminar de falar
      //e.results é um array de todas as palavras reconhecidas desde o começo, então para ter todo o texto precisamos formatar
      //Array converte qualquer listagem para um array, para podermos usar suas funções
      const transcription = Array.from(e.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setFormContent(transcription);
    };

    speechRecognition.onerror = (e) => {
      console.error(e);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover: ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Comece{" "}
          <span className="font-medium text-lime-400">
            gravando uma nota <Mic className="inline" />
          </span>{" "}
          em áudio ou{" "}
          <span className="font-medium text-lime-400">
            utilize apenas texto <Keyboard className="inline" />
          </span>
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                Adicionar nota
              </span>
              {shouldShowOnBoarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    type="button"
                    onClick={handleRecording}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando uma nota <Mic className="inline" />
                  </button>{" "}
                  em áudio ou{" "}
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto <Keyboard className="inline" />
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

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique para interromper)
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
