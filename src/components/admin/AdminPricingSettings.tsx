import React, { useEffect, useState } from 'react';
import { Save, Edit2, Trash2, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import pricingService, { PricingPackage } from '../../services/pricingService';

interface Alert {
  type: 'success' | 'error';
  message: string;
}

const AdminPricingSettings: React.FC = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedPackage, setEditedPackage] = useState<{
    id: string;
    name: string;
    price: string;
    duration: string;
    features: string[];
    popular: boolean;
  } | null>(null);

  useEffect(() => {
    fetchPricing();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchPricing = async () => {
    try {
      const result = await pricingService.getAllPackages();

      if (result.success && result.data) {
        console.log('📦 Pricing data:', result.data);
        setPackages(result.data);
      } else {
        setAlert({ type: 'error', message: result.error || 'Gagal mengambil data pricing' });
      }
    } catch (error) {
      console.error('❌ Error fetch pricing:', error);
      setAlert({ type: 'error', message: 'Terjadi kesalahan saat mengambil data' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: PricingPackage) => {
    if (!pkg.id) return;
    
    setEditingId(pkg.id);
    setEditedPackage({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      duration: pkg.duration,
      features: Array.isArray(pkg.features) ? pkg.features : [],
      popular: pkg.popular
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedPackage(null);
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!editedPackage) return;
    const updated = [...editedPackage.features];
    updated[index] = value;
    setEditedPackage({ ...editedPackage, features: updated });
  };

  const addFeature = () => {
    if (!editedPackage) return;
    setEditedPackage({
      ...editedPackage,
      features: [...editedPackage.features, ''],
    });
  };

  const removeFeature = (index: number) => {
    if (!editedPackage) return;
    const updated = editedPackage.features.filter((_, i) => i !== index);
    setEditedPackage({ ...editedPackage, features: updated });
  };

  const handleSave = async () => {
    if (!editedPackage) return;

    try {
      // Filter out empty features
      const validFeatures = editedPackage.features.filter(f => f.trim() !== '');
      
      const dataToSave = {
        name: editedPackage.name,
        price: editedPackage.price,
        duration: editedPackage.duration,
        features: validFeatures,
        popular: editedPackage.popular
      };

      console.log('💾 Saving package:', dataToSave);

      const result = await pricingService.updatePackage(editedPackage.id, dataToSave);

      if (result.success) {
        setAlert({ type: 'success', message: 'Perubahan berhasil disimpan ✅' });
        setEditingId(null);
        setEditedPackage(null);
        
        // Refresh data
        setTimeout(() => {
          fetchPricing();
        }, 500);
      } else {
        throw new Error(result.error || 'Gagal menyimpan perubahan');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      setAlert({ type: 'error', message: error.message });
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Memuat data...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {alert && (
        <div
          className={`flex items-center space-x-3 p-4 rounded-lg ${
            alert.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{alert.message}</span>
          <button 
            onClick={() => setAlert(null)}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold text-gray-800">Kelola Paket Harga</h2>
        <p className="text-sm text-gray-500 mt-1">Atur informasi paket layanan pijat</p>
      </div>

      <div className="bg-white shadow rounded-lg divide-y">
        {packages.map((pkg) => (
          <div key={pkg.id} className="p-6">
            {editingId === pkg.id && editedPackage ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Paket
                    </label>
                    <input
                      type="text"
                      value={editedPackage.name}
                      onChange={(e) => setEditedPackage({ ...editedPackage, name: e.target.value })}
                      placeholder="Contoh: Paket 60 Menit"
                      className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Harga
                    </label>
                    <input
                      type="text"
                      value={editedPackage.price}
                      onChange={(e) => setEditedPackage({ ...editedPackage, price: e.target.value })}
                      placeholder="Contoh: Rp 150.000"
                      className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durasi
                  </label>
                  <input
                    type="text"
                    value={editedPackage.duration}
                    onChange={(e) =>
                      setEditedPackage({ ...editedPackage, duration: e.target.value })
                    }
                    placeholder="Contoh: 1 Jam"
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fitur Paket
                  </label>
                  <div className="space-y-2">
                    {editedPackage.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(i, e.target.value)}
                          placeholder="Contoh: Terapis datang ke tempat"
                          className="flex-1 border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => removeFeature(i)}
                          className="text-red-600 hover:bg-red-50 p-2.5 rounded-md transition-colors"
                          title="Hapus fitur"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addFeature}
                    className="mt-3 text-green-600 text-sm hover:text-green-700 font-medium flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Tambah Fitur Baru
                  </button>
                </div>

                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id={`popular-${pkg.id}`}
                    checked={editedPackage.popular}
                    onChange={(e) =>
                      setEditedPackage({ ...editedPackage, popular: e.target.checked })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor={`popular-${pkg.id}`} className="ml-2 text-sm text-gray-700">
                    Tandai sebagai paket <span className="font-semibold">populer</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center bg-green-600 text-white px-5 py-2.5 rounded-md hover:bg-green-700 font-medium transition-colors"
                  >
                    <Save size={18} className="mr-2" /> Simpan Perubahan
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
                    {pkg.popular && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        ⭐ Populer
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Durasi:</span> {pkg.duration}
                  </p>
                  <p className="text-2xl font-bold text-green-600 mb-3">{pkg.price}</p>
                  
                  {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 font-semibold mb-2">✓ Fitur yang termasuk:</p>
                      <ul className="text-sm text-gray-600 space-y-1.5">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleEdit(pkg)}
                  className="flex items-center text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-md font-medium transition-colors"
                >
                  <Edit2 size={18} className="mr-2" /> Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">Belum ada paket yang tersedia</p>
        </div>
      )}
    </div>
  );
};

export default AdminPricingSettings;