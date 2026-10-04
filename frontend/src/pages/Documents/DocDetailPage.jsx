import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../../components/common/Spinner.jsx';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import documentServices from '../../services/document.service.js';
import Tabs from '../../components/documents/Tabs.jsx';
import ChatInterface from '../../components/tabs/ChatInterface.jsx';
import AIActions from '../../components/tabs/AIActions.jsx';
import FlashcardManager from '../../components/flashcards/FlashcardManager.jsx';
import QuizManager from '../../components/quizzes/QuizManager.jsx';

function DocDetailPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Content');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDocument = async () => {
      try {
        const result = await documentServices.getDocumentById(id);
        setDocument(result.data);
      } catch (error) {
        toast.error(error?.error || 'Failed to fetch document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const getPDFUrl = () => {
    if (!document?.filePath) return null;

    if (document.filePath.startsWith('http')) {
      return document.filePath;
    }

    const baseURL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '');
    return `${baseURL}/${document.filePath.replace(/^\/+/, '')}`;
  };

  const renderContent = () => {
    if (!document?.filePath) {
      return (
        <div className="text-center p-12 text-muted rounded-2xl border border-dashed border-white/12 bg-fill">
          PDF not available
        </div>
      );
    }

    const pdfUrl = getPDFUrl();

    return (
      <div className="surface overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText size={16} className="text-accent" />
            Document Viewer
          </span>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            <ExternalLink size={14} />
            Open
          </a>
        </div>

        {/* PDF */}
        <div className="p-3 bg-obsidian/60">
          <iframe
            src={pdfUrl}
            className="w-full h-[70vh] rounded-xl border border-hairline bg-white/95"
            title="PDF Viewer"
          />
        </div>
      </div>
    );
  };

  const tabs = [
    { name: 'Content', label: 'Content', content: renderContent() },
    { name: 'Chat', label: 'Chat', content: <ChatInterface /> },
    { name: 'AI Actions', label: 'AI Actions', content: <AIActions /> },
    { name: 'Flashcards', label: 'Flashcards', content: <FlashcardManager documentId={id} /> },
    { name: 'Quizzes', label: 'Quizzes', content: <QuizManager documentId={id} /> },
  ];

  if (loading) return <Spinner label="Loading document" />;

  if (!document) {
    return (
      <div className="surface p-12 text-center text-muted">Document not found</div>
    );
  }

  return (
    <div>
      {/* Back */}
      <div className="mb-5">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm link-accent hover:no-underline"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>

      {/* Title */}
      <div className="mb-7">
        <p className="eyebrow mb-2">Document</p>
        <h1 className="page-title flex items-center gap-3">
          <span className="icon-tile">
            <FileText size={20} />
          </span>
          {document.title}
        </h1>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default DocDetailPage;
