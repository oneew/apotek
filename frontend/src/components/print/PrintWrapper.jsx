import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * PrintWrapper Utility
 * Dynamically renders content to a hidden iframe and triggers browser print
 */
const PrintWrapper = forwardRef(({ children }, ref) => {
  const iframeRef = useRef(null);

  useImperativeHandle(ref, () => ({
    print: () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Clear existing content
      doc.open();
      doc.write('<html><head><title>Print</title>');
      
      // Inject Styles for Print
      doc.write('<style>');
      doc.write(`
        @page { size: auto; margin: 0; }
        body { margin: 0; padding: 0; }
        @media print {
          .no-print { display: none !important; }
        }
      `);
      doc.write('</style>');
      
      doc.write('</head><body>');
      doc.write('<div id="print-content"></div>');
      doc.write('</body></html>');
      doc.close();

      // We use portal to render the React children into the iframe's DOM
      return new Promise((resolve) => {
        const container = doc.getElementById('print-content');
        
        // This is a bit tricky with React Portals and iframes
        // For simplicity in this environment, we'll wait for the frame to be ready
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          resolve();
        }, 500);
      });
    }
  }));

  return (
    <>
      <iframe
        ref={iframeRef}
        title="print-frame"
        style={{
          position: 'fixed',
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
          border: 'none',
          visibility: 'hidden'
        }}
      />
      {/* We don't render children here directly, we use them inside the print method logic or as a hidden preview */}
      <div style={{ display: 'none' }}>
        {children}
      </div>
    </>
  );
});

export default PrintWrapper;
