import React from 'react';

/**
 * ThermalReceipt Component
 * Optimized for 58mm/80mm thermal printers
 */
const ThermalReceipt = ({ data, settings = { width: '58mm' } }) => {
  if (!data) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="print-receipt"
      style={{ 
        width: settings.width, 
        padding: '2mm', 
        fontFamily: 'monospace', 
        fontSize: '12px',
        color: '#000',
        lineHeight: '1.2'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4mm' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>
          {data.outlet_name || 'APOTEK LILAC'}
        </div>
        <div style={{ fontSize: '10px' }}>{data.outlet_address || 'Jl. Raya Pharmacy No. 10'}</div>
        <div style={{ fontSize: '10px' }}>Telp: {data.outlet_phone || '021-123456'}</div>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '2mm 0' }}></div>

      {/* Meta Info */}
      <div style={{ fontSize: '10px', marginBottom: '2mm' }}>
        <div>No: {data.invoice_no}</div>
        <div>Tgl: {formatDate(data.tanggal)}</div>
        <div>Kasir: {data.kasir_name}</div>
        {data.pelanggan_name && <div>Plg: {data.pelanggan_name}</div>}
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '2mm 0' }}></div>

      {/* Items Table */}
      <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Item</th>
            <th style={{ textAlign: 'right' }}>Qty</th>
            <th style={{ textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => (
            <React.Fragment key={idx}>
              <tr>
                <td colSpan="3" style={{ paddingTop: '1mm' }}>{item.nama_produk}</td>
              </tr>
              <tr>
                <td style={{ fontSize: '10px', color: '#333' }}>
                  {item.qty} x {parseFloat(item.harga_satuan).toLocaleString('id-ID')}
                </td>
                <td style={{ textAlign: 'right' }}>{item.qty}</td>
                <td style={{ textAlign: 'right' }}>
                  {(item.qty * item.harga_satuan).toLocaleString('id-ID')}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #000', margin: '3mm 0' }}></div>

      {/* Totals */}
      <div style={{ fontSize: '11px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal:</span>
          <span>{parseFloat(data.subtotal).toLocaleString('id-ID')}</span>
        </div>
        {data.diskon > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Diskon:</span>
            <span>-{parseFloat(data.diskon).toLocaleString('id-ID')}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px', marginTop: '1mm' }}>
          <span>TOTAL:</span>
          <span>{parseFloat(data.total_akhir).toLocaleString('id-ID')}</span>
        </div>
        <div style={{ borderTop: '1px dotted #000', margin: '1mm 0' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Bayar:</span>
          <span>{parseFloat(data.bayar).toLocaleString('id-ID')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Kembali:</span>
          <span>{parseFloat(data.kembali).toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '5mm', fontSize: '10px' }}>
        <div>Terima Kasih</div>
        <div style={{ fontWeight: 'bold' }}>SEMOGA LEKAS SEMBUH</div>
        <div style={{ marginTop: '2mm', fontSize: '8px' }}>Power by Apotek Digital Lilac</div>
      </div>
      
      {/* Footer margin for cutter */}
      <div style={{ height: '10mm' }}></div>
    </div>
  );
};

export default ThermalReceipt;
