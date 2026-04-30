import React from 'react';

/**
 * LetterA4 Component
 * Professional A4 Layout for Surat Pesanan (Procurement) or formal Invoices
 */
const LetterA4 = ({ data, type = 'SURAT_PESANAN' }) => {
  if (!data) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isSP = type === 'SURAT_PESANAN';

  return (
    <div 
      className="print-container"
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        padding: '20mm', 
        fontFamily: 'Arial, sans-serif', 
        fontSize: '12px',
        color: '#000',
        backgroundColor: '#fff',
        boxSizing: 'border-box'
      }}
    >
      {/* Header / Kop Surat */}
      <div style={{ display: 'flex', borderBottom: '2px solid #000', paddingBottom: '5mm', marginBottom: '5mm' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.outlet_name || 'APOTEK LILAC'}</div>
          <div>{data.outlet_address || 'Jl. Raya Pharmacy No. 10, Jakarta'}</div>
          <div>Telp: {data.outlet_phone || '021-123456'}</div>
          <div>SIA: {data.sia_number || '123/SIA/2026'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#666' }}>
            {isSP ? 'SURAT PESANAN' : 'FAKTUR PENJUALAN'}
          </div>
          <div style={{ marginTop: '2mm' }}>No: <span style={{ fontWeight: 'bold' }}>{data.invoice_no || data.sp_number}</span></div>
          <div>Tanggal: {formatDate(data.tanggal)}</div>
        </div>
      </div>

      {/* Recipient */}
      <div style={{ marginBottom: '8mm' }}>
        <div style={{ fontWeight: 'bold' }}>Kepada Yth,</div>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{data.supplier_name || data.pelanggan_name}</div>
        <div style={{ maxWidth: '300px' }}>{data.supplier_address || data.pelanggan_address || 'Alamat tujuan pengiriman'}</div>
      </div>

      {/* Statement for SP */}
      {isSP && (
        <div style={{ marginBottom: '5mm', fontStyle: 'italic' }}>
          Mohon dikirimkan item-item perbekalan farmasi berikut di bawah ini:
        </div>
      )}

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10mm' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'center', width: '40px' }}>No</th>
            <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'left' }}>Nama Barang / Deskripsi</th>
            <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'center', width: '80px' }}>Jumlah</th>
            <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'center', width: '60px' }}>Satuan</th>
            {!isSP && <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'right', width: '120px' }}>Harga Satuan</th>}
            {!isSP && <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'right', width: '120px' }}>Total</th>}
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #000', padding: '2mm', textAlign: 'center' }}>{idx + 1}</td>
              <td style={{ border: '1px solid #000', padding: '2mm' }}>
                <div style={{ fontWeight: 'bold' }}>{item.nama_produk}</div>
                {item.batch_no && <div style={{ fontSize: '10px' }}>Batch: {item.batch_no}</div>}
              </td>
              <td style={{ border: '1px solid #000', padding: '2mm', textAlign: 'center' }}>{item.qty}</td>
              <td style={{ border: '1px solid #000', padding: '2mm', textAlign: 'center' }}>{item.unit || item.nama_satuan}</td>
              {!isSP && <td style={{ border: '1px solid #000', padding: '2mm', textAlign: 'right' }}>{parseFloat(item.harga_satuan).toLocaleString('id-ID')}</td>}
              {!isSP && <td style={{ border: '1px solid #000', padding: '2mm', textAlign: 'right' }}>{(item.qty * item.harga_satuan).toLocaleString('id-ID')}</td>}
            </tr>
          ))}
        </tbody>
        {!isSP && (
          <tfoot>
            <tr>
              <td colSpan="5" style={{ textAlign: 'right', padding: '2mm', fontWeight: 'bold' }}>TOTAL</td>
              <td style={{ border: '1px solid #000', padding: '2mm', textAlign: 'right', fontWeight: 'bold' }}>
                {parseFloat(data.total_akhir).toLocaleString('id-ID')}
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Signature Section */}
      <div style={{ marginTop: '20mm', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center', width: '200px' }}>
          <div>Penerima / Pemesan</div>
          <div style={{ height: '25mm' }}></div>
          <div style={{ borderBottom: '1px solid #000', fontWeight: 'bold' }}>( ........................... )</div>
        </div>
        <div style={{ textAlign: 'center', width: '250px' }}>
          <div>Hormat Kami,</div>
          <div>Apoteker Penanggung Jawab</div>
          <div style={{ height: '20mm' }}></div>
          <div style={{ borderBottom: '1px solid #000', fontWeight: 'bold' }}>{data.apj_name || 'Apt. Nama Apoteker, S.Farm'}</div>
          <div>SIPA: {data.sipa_number || '19950101/SIPA-32.73/2023/2.1'}</div>
        </div>
      </div>

      {/* Condition / Footer */}
      <div style={{ marginTop: '15mm', fontSize: '10px', color: '#444' }}>
        {isSP ? (
          <div>
            * Barang yang dikirim harus memiliki masa kadaluarsa (ED) minimal 2 tahun. <br/>
            * Mohon sertakan Surat Jalan dan Faktur asli saat pengiriman.
          </div>
        ) : (
          <div>
            * Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan (kecuali ada perjanjian). <br/>
            * Terbilang: {data.total_terbilang || '...'} Rupiah.
          </div>
        )}
      </div>
    </div>
  );
};

export default LetterA4;
