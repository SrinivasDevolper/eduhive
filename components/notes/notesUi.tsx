import {
  Edit,
  FolderArchive,
  Minimize2,
  Trash2,
  Sparkles,
  Star,
  Quote,
  UserPlus,
  Loader2,
  Download,
  Save,
} from "lucide-react";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useNotesContext } from "@/context/NotesContext";
import { useDB } from "@/hooks/use-db";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// For Markdown
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm"; // GitHub Flavored Markdown
// import remarkBreaks from "remark-breaks";
// import rehypeHighlight from "rehype-highlight";

const NotesPageHeader = () => {
  return (
    <section className="w-full max-w-3xl text-center mb-2">
      <h1 className="text-3xl font-extrabold text-primary">Notes Page</h1>
      <p className="text-muted-foreground">
        Create, view, and manage your notes with ease.
      </p>
    </section>
  );
};

const NotesLoading = () => {
  return (
    <div className="flex-1 flex items-center content-center">
      <Loader2 className="animate-spin" />

      <p className="text-muted-foreground w-full max-w-3xl">
        Retrieving Your Data...
      </p>
    </div>
  );
};

const ToolBar = ({
  editing,
  setEditing,
  handleEdit,
  handleUpdateNote,
}: {
  editing: boolean;
  setEditing: (value: boolean) => void;
  handleEdit: () => void;
  handleUpdateNote: () => void;
}) => {
  const router = useRouter();
  const { selectedNote, setSelectedNote } = useNotesContext();
  const { handleDeleteNote, fetchNotes } = useDB();
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  const handleDelete = async () => {
    if (!selectedNote) {
      toast.error("No note selected to delete.");
      return;
    }

    if (!currentUserId) {
      toast.error("No User ID is being captured.");
      return;
    }

    try {
      await handleDeleteNote({
        noteId: selectedNote.id,
        userId: currentUserId,
      }); // Delete the note
      toast.success("Note deleted successfully.");
      setSelectedNote(null); // Clear the selected note from context
      fetchNotes({ userId: currentUserId }); // Refresh the notes list
      router.back(); // Navigate back to the notes page
    } catch (error) {
      toast.error("Failed to delete the note. Please try again.");
    }
  };
  if (!selectedNote) return;

  return (
    <div
      className="w-[80%] sticky top-0 z-10 flex flex-1 justify-between content-center bg-white p-4"
      // style={{ backgroundColor: "white" }}
    >
      <h2 className="text-xl font-bold text-primary">{selectedNote.title}</h2>
      <div className="flex flex-row gap-2 items-center justify-center ">
        <Button className="bg-gray-300 hover:bg-gray-100">
          <FolderArchive color="black" strokeWidth={3} size={35} />
        </Button>
        <Button className="bg-gray-300 hover:bg-gray-100">
          <UserPlus color="black" strokeWidth={3} size={35} />
        </Button>
        <Button className="bg-black">
          <Star color="yellow" strokeWidth={3} />
        </Button>
        <Button className="bg-blue-500">
          <Sparkles color="white" strokeWidth={2} />
          <span className="text-white text-sm font-mono tracking-wider ">
            Summarizer
          </span>
        </Button>
        <Button className="bg-red-500">
          <Quote color="white" strokeWidth={3} />

          <Sparkles color="#fb2c36" />
        </Button>
        {editing ? (
          <Button onClick={handleUpdateNote}>
            <Save />
          </Button>
        ) : (
          <Button onClick={handleEdit}>
            <Edit />
          </Button>
        )}
        <Button onClick={handleDelete}>
          <Trash2 />
        </Button>
        <Button
          onClick={() => {
            router.back();
          }}
        >
          <Minimize2 />
        </Button>
      </div>
    </div>
  );
};

const Archieve = ({
  handleArchieveOpen,
}: {
  handleArchieveOpen: () => void;
}) => {
  return (
    <div
      className=" flex flex-col w-full h-40 bg-black rounded-lg items-center justify-center transition-all duration-250 hover:border-4 hover:border-white"
      onClick={handleArchieveOpen}
    >
      <FolderArchive size={28} color="white" />
      <h4 className="font-mono text-md text-white">Archieve</h4>
    </div>
  );
};

export {
  NotesPageHeader,
  NotesLoading,
  ToolBar,
  Archieve,
  // DownloadAsPDF,
};

{
  /*
  import { toast } from 'react-hot-toast';
import { useRef } from 'react';

function useDeleteWithUndo() {
  // Keep a ref to the timeout ID so we can cancel it.
  const timeoutRef = useRef(null);

  const deleteWithUndo = (noteId) => {
    // 1) Show a toast that never auto‑dismisses (duration: Infinity)
    const toastId = toast.loading('Deleting note...', {
      duration: Infinity,
      // 2) Add an Undo button
      action: {
        label: 'Undo',
        // If clicked, clear the timer and dismiss the toast
        onClick: () => {
          clearTimeout(timeoutRef.current);
          toast.dismiss(toastId);
          toast('Deletion canceled');
        }
      }
    });

    // 3) Start a 3-second timer to actually delete
    timeoutRef.current = setTimeout(() => {
      // TODO: call your delete function here, e.g.
      // deleteNote(noteId);

      // 4) Clean up the toast:
      toast.dismiss(toastId);
      toast.success('Note deleted');
    }, 3000);
  };

  return deleteWithUndo;
}
 const deleteWithUndo = useDeleteWithUndo();
  
  */
}
