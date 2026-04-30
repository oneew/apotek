import React from 'react';

/**
 * ZReport Component
 * Optimized for 58mm/80mm thermal printers
 * Used for End-of-Shift / End-of-Day reconciliation
 */
const ZReport = ({ data, settings = { width: '58mm' } }) => {
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
          Z-REPORT (LAPORAN SESSION)
        </div>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{data.outlet_name || 'APOTEK LILAC'}</div>
      </div>

      <div style={{ borderTop: '1px double #000', margin: '2mm 0' }}></div>

      {/* Session Info */}
      <div style={{ fontSize: '10px', marginBottom: '2mm' }}>
        <div>ID Sesi: {data.session_id || 'SES-0000'}</div>
        <div>Shift  : {data.shift_type || 'N/A'}</div>
        <div>Staff  : {data.staff_name || 'Admin'}</div>
        <div>Mulai  : {formatDate(data.start_time)}</div>
        <div>Selesai: {formatDate(data.end_time || new Date())}</div>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '2mm 0' }}></div>

      {/* Financial Summary */}
      <div style={{ fontSize: '11px', spaceY: '1mm' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1mm' }}>
          <span>Saldo Awal:</span>
          <span>{parseFloat(data.opening_cash || 0).toLocaleString('id-ID')}</span>
        </div>
        
        <div style={{ borderTop: '1px dotted #ccc', margin: '1mm 0' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Penjualan Tunai:</span>
          <span>{parseFloat(data.total_cash_sales || 0).toLocaleString('id-ID')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Penjualan Non-Tunai:</span>
          <span>{parseFloat(data.total_non_cash_sales || 0).toLocaleString('id-ID')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Penerimaan Piutang:</span>
          <span>{parseFloat(data.total_piutang_paid || 0).toLocaleString('id-ID')}</span>
        </div>

        <div style={{ borderTop: '1px dotted #ccc', margin: '1mm 0' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>TOTAL PENDAPATAN:</span>
          <span>{parseFloat(data.grand_total_revenue || 0).toLocaleString('id-ID')}</span>
        </div>

        <div style={{ borderTop: '1px dashed #000', margin: '2mm 0' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Cash di Laci (Actual):</span>
          <span>{parseFloat(data.actual_cash || 0).toLocaleString('id-ID')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: data.discrepancy < 0 ? 'red' : 'black' }}>
          <span>Selisih:</span>
          <span>{parseFloat(data.discrepancy || 0).toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #000', margin: '3mm 0' }}></div>

      {/* Footer Branding */}
      <div style={{ textAlign: 'center', marginTop: '4mm', fontSize: '9px' }}>
        <div style={{ fontWeight: 'bold' }}>DOCUMENT AUTHORIZED</div>
        <div>{new Date().toLocaleString()}</div>
        <div style={{ marginTop: '2mm', fontSize: '8px', fontStyle: 'italic' }}>Nova Farma Reporting System</div>
      </div>
      
      <div style={{ height: '12mm' }}></div>
    </div>
  );
};

export default ZReport;
