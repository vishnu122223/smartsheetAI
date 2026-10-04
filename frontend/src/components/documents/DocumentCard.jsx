import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Clock, Layers, BrainCircuit } from 'lucide-react';
import moment from 'moment';

const formatFilesize = (bytes) => {
  if (bytes === undefined || bytes === null) return 'N/A';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="surface surface-hover group relative p-5 cursor-pointer flex flex-col justify-between"
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="icon-tile">
            <FileText className="w-5 h-5" />
          </div>

          <button
            onClick={handleDelete}
            aria-label="Delete document"
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg
            text-danger hover:bg-danger/15 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <h3 title={document.title} className="text-sm font-bold text-foreground truncate mb-1">
          {document.title}
        </h3>

        <p className="text-xs text-subtle mb-4">{formatFilesize(document.fileSize)}</p>

        {/* Stats */}
        <div className="flex flex-wrap gap-2">
          {document.flashcardCount !== undefined && (
            <span className="chip">
              <Layers size={12} className="text-accent" />
              {document.flashcardCount}
            </span>
          )}

          {document.quizCount !== undefined && (
            <span className="chip chip-gold">
              <BrainCircuit size={12} />
              {document.quizCount}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3.5 border-t border-hairline text-xs text-subtle flex items-center gap-1.5">
        <Clock size={13} />
        Uploaded {moment(document.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default DocumentCard;
