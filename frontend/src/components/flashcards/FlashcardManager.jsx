
import React, { useRef, useState, useEffect } from 'react';
import { Trash2, ArrowLeft, Sparkles, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import flashcardServices from '../../services/flashcards.service.js';
import aiServices from '../../services/ai.service.js';
import Spinner from '../common/Spinner.jsx';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import FlashcardViewer from './FlashcardViewer.jsx';

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const hasFetched = useRef(false);

  const fetchFlashcardsSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardServices.getFlashcards(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error(error?.error || error?.message || 'Failed to fetch flashcards sets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    if (documentId) fetchFlashcardsSets();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiServices.generateFlashcards(documentId);
      toast.success('Flashcards generated');
      fetchFlashcardsSets();
    } catch (error) {
      toast.error(error?.error || error?.message || 'Failed to generate flashcards');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await flashcardServices.deleteFlashcard(setToDelete._id);
      toast.success('Deleted');
      setIsDeleteModalOpen(false);
      fetchFlashcardsSets();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardServices.starFlashcard(cardId);
      const updatedSets = flashcardSets.map((set) => {
        if (set._id === selectedSet._id) {
          return {
            ...set,
            cards: set.cards.map((card) =>
              card._id === cardId
                ? { ...card, isStarred: !card.isStarred }
                : card
            ),
          };
        }
        return set;
      });

      setFlashcardSets(updatedSets);
      setSelectedSet(updatedSets.find((s) => s._id === selectedSet._id));
    } catch {
      toast.error('Failed');
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  /* ================= UI ================= */

  const renderFlashcardViewer = () => (
    <div className="space-y-6">
      <button
        onClick={() => setSelectedSet(null)}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to Sets
      </button>

      <FlashcardViewer
        selectedSet={selectedSet}
        currentCardIndex={currentCardIndex}
        setCurrentCardIndex={setCurrentCardIndex}
        handleToggleStar={handleToggleStar}
      />
    </div>
  );

  const renderSetList = () => {
    if (loading) return <Spinner />;

    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          onClickAction={handleGenerateFlashcards}
          title="No Flashcards yet"
          description="Generate flashcards from your document to start learning"
          buttonText="Generate Flashcards"
          loading={generating}
        />
      );
    }

    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Flashcard Sets
            </h3>
            <p className="text-sm text-gray-500">
              {flashcardSets.length} sets available
            </p>
          </div>

          <Button onClick={handleGenerateFlashcards} disabled={generating}>
            {generating ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer relative"
            >
              {/* Delete */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>

              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>

              {/* Content */}
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Flashcard Set
              </h4>

              <p className="text-xs text-gray-500 mb-3">
                {moment(set.createdAt).format('MMM D, YYYY')}
              </p>

              <span className="text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                {set.cards.length} cards
              </span>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="bg-gray-50 p-6 rounded-2xl">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;