import React, { useMemo } from 'react';

/**
 * DynamicPrinter Component
 * Renders HTML templates and replaces {{placeholder}} with data values.
 */
const DynamicPrinter = ({ templateHtml, data }) => {
  const renderedContent = useMemo(() => {
    if (!templateHtml || !data) return '';

    let html = templateHtml;

    // 1. Basic Placeholders {{key}}
    Object.keys(data).forEach(key => {
      if (typeof data[key] !== 'object') {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        html = html.replace(regex, data[key]);
      }
    });

    // 2. Handle Items Loop (Simple implementation for demonstration)
    // Expects something like <tbody>...{{items}}...</tbody>
    if (data.items && Array.isArray(data.items)) {
        let itemsHtml = '';
        data.items.forEach((item, idx) => {
            itemsHtml += `
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">${idx + 1}</td>
                    <td style="border: 1px solid #000; padding: 5px;">${item.nama_produk || item.description}</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">${item.jumlah || item.qty}</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">${(parseFloat(item.harga_satuan || item.harga_estimate || 0)).toLocaleString('id-ID')}</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: right;">${((item.jumlah || item.qty) * (item.harga_satuan || item.harga_estimate || 0)).toLocaleString('id-ID')}</td>
                </tr>
            `;
        });
        html = html.replace(/{{\\s*items\\s*}}/, itemsHtml);
    }

    return html;
  }, [templateHtml, data]);

  return (
    <div 
      className="dynamic-print-container"
      style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#fff' }}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};

export default DynamicPrinter;
