import React, { useEffect, useState, useRef } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner.jsx';
import documentServices from '../../services/document.service.js';
import DocumentCard from '../../components/documents/DocumentCard.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

const DocListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const hasFetched = useRef(false);

  // ✅ Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await documentServices.getDocuments();
      setDocuments(res.data);
    } catch {
      toast.error('Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchDocuments();
  }, []);

  // ✅ Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile || !uploadTitle) {
      toast.error('Please fill all fields');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle);

    try {
      await documentServices.upload(formData);

      toast.success('Uploaded successfully');

      // refresh documents
      fetchDocuments();

      setUploadFile(null);
      setUploadTitle('');
      setIsUploadModalOpen(false);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete handler
  const handleDelete = async (doc) => {
    if (!window.confirm('Delete this document?')) return;

    try {
      await documentServices.deleteDoc(doc._id);
      toast.success('Deleted');

      setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
    } catch {
      toast.error('Delete failed');
    }
  };

  if (isLoading) return <Spinner label="Loading documents" />;

  return (
    <div>
      {/* ✅ HEADER */}
      <PageHeader
        title="My documents"
        subtitle="Manage and organize your learning materials"
      >
        <span className="chip mr-1">{documents.length} files</span>
        <button onClick={() => setIsUploadModalOpen(true)} className="btn btn-primary">
          <Plus size={17} />
          Upload
        </button>
      </PageHeader>

      {/* ✅ DOCUMENT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <DocumentCard key={doc._id} document={doc} onDelete={handleDelete} />
          ))
        ) : (
          <div className="col-span-full surface flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="icon-tile !w-16 !h-16 !rounded-2xl mb-6">
              <Upload size={26} />
            </div>
            <h2 className="text-xl font-bold mb-2">No documents yet</h2>
            <p className="text-sm text-muted mb-7 max-w-sm">
              Upload your first document to start learning.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn btn-primary"
            >
              <Plus size={17} />
              Upload document
            </button>
          </div>
        )}
      </div>

      {/* ✅ UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsUploadModalOpen(false)}
          />

          <div
            className="relative w-full max-w-md rounded-3xl border border-hairline bg-elevated/95
            backdrop-blur-xl p-6 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
            style={{ animation: 'fade-up 0.28s cubic-bezier(0.22, 1, 0.36, 1) both' }}
          >
            <div className="pointer-events-none absolute -top-20 -right-14 h-44 w-44 rounded-full bg-accent/25 blur-3xl" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="eyebrow mb-1.5">New material</p>
                <h2 className="text-xl font-bold tracking-tight">Upload document</h2>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl
                text-muted hover:text-foreground hover:bg-fill-strong transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpload} className="space-y-5">
              {/* Title */}
              <div>
                <label className="label" htmlFor="upload-title">
                  Document title
                </label>
                <input
                  id="upload-title"
                  type="text"
                  placeholder="Enter document title"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="field"
                />
              </div>

              {/* File */}
              <div>
                <label className="label" htmlFor="upload-file">
                  Upload PDF
                </label>

                <label
                  htmlFor="upload-file"
                  className="flex flex-col items-center justify-center border border-dashed
                  border-white/15 rounded-2xl p-7 cursor-pointer bg-fill
                  hover:border-accent/60 hover:bg-accent/8 transition"
                >
                  <Upload className="w-6 h-6 text-accent mb-3" />

                  <p className="text-sm text-foreground text-center font-medium">
                    {uploadFile ? uploadFile.name : 'Click to upload or drag & drop'}
                  </p>

                  <span className="text-xs text-subtle mt-1">PDF (max 10MB)</span>

                  <input
                    id="upload-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary flex-1"
                >
                  {uploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocListPage;
