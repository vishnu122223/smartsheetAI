import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      {/* Tab Header */}
      <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl border border-hairline bg-fill mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
              activeTab === tab.name
                ? 'text-white bg-gradient-to-r from-primary to-accent shadow-[0_10px_22px_-12px_rgba(139,92,246,0.95)]'
                : 'text-muted hover:text-foreground hover:bg-fill-strong'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-2">
        {tabs.map((tab) =>
          tab.name === activeTab ? (
            <div key={tab.name} style={{ animation: 'fade-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
              {tab.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Tabs;
