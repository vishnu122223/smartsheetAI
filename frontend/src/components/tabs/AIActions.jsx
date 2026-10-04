
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import aiServices from '../../services/ai.service';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../common/MarkdownRenderer';
import Modal from '../common/Modal.jsx';

const AIActions = () => {
  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [concept, setConcept] = useState('');

  const handleGenerateSummary = async () => {
    setLoadingAction('summary');
    try {
      const response = await aiServices.generateSummary(documentId);
      setModalTitle('Generated Summary');
      setModalContent(response.data.summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error?.error || error?.message || 'Failed to generate summary');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error('Enter a concept');
      return;
    }

    setLoadingAction('explain');
    try {
      const response = await aiServices.explainConcept(documentId, concept);
      setModalTitle(`Explanation of ${concept}`);
      setModalContent(response.data.explanation);
      setIsModalOpen(true);
      setConcept('');
    } catch (error) {
      toast.error(error?.error || error?.message || 'Failed to explain concept');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      {/* MAIN CARD */}
      <div className="bg-white border border-gray-300 rounded-2xl shadow-sm">

        {/* Header */}
        <div className="px-6 py-5 border-b bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Smart Sheet AI
              </h3>
              <p className="text-sm text-gray-500">
                AI Powered Tools
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* SUMMARY */}
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center gap-4">

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={18} className="text-blue-600" />
                  <h4 className="font-semibold text-gray-900">
                    Generate Summary
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Get a short summary of your document
                </p>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === 'summary'}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition"
              >
                {loadingAction === 'summary' ? 'Loading...' : 'Summarize'}
              </button>
            </div>
          </div>

          {/* EXPLAIN */}
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex flex-col gap-4">

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={18} className="text-yellow-500" />
                  <h4 className="font-semibold text-gray-900">
                    Explain Concept
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Enter any topic to get explanation
                </p>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="e.g. React Hooks"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
                  text-gray-900 placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={handleExplainConcept}
                  disabled={loadingAction === 'explain'}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500"
                >
                  {loadingAction === 'explain' ? 'Loading...' : 'Explain'}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className="max-h-[70vh] overflow-y-auto prose prose-sm text-foreground">
          <MarkdownRenderer content={modalContent} />
        </div>
      </Modal>
    </>
  );
};

export default AIActions;