
import React, { useState, useCallback } from 'react';
import { identifyFoodInImage } from '../services/geminiService';
import { Spinner } from './Spinner';
import { CameraIcon, CheckCircleIcon, PlusIcon, XIcon, ArrowUpTrayIcon } from './IconComponents';

interface ItemToAdd {
    name: string;
    expirationDate?: Date;
}

interface ScannerProps {
  onAddItems: (items: ItemToAdd[]) => void;
  onCancel: () => void;
}

interface IdentifiedItem {
    name: string;
    expirationDate: string; // Stored as string from input type='date'
}

export const Scanner: React.FC<ScannerProps> = ({ onAddItems, onCancel }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [identifiedItems, setIdentifiedItems] = useState<IdentifiedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const minDate = new Date().toISOString().split("T")[0];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setIdentifiedItems([]);
      setError(null);
    }
  };

  const handleScan = useCallback(async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);
    try {
      const items = await identifyFoodInImage(imageFile);
      setIdentifiedItems(items.map(name => ({ name, expirationDate: '' })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);
  
  const handleConfirm = () => {
    const itemsToAdd = identifiedItems.map(item => ({
        name: item.name,
        expirationDate: item.expirationDate ? new Date(`${item.expirationDate}T00:00:00`) : undefined,
    }));
    onAddItems(itemsToAdd);
  };

  const handleDateChange = (itemName: string, date: string) => {
    setIdentifiedItems(prevItems =>
        prevItems.map(item =>
            item.name === itemName ? { ...item, expirationDate: date } : item
        )
    );
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setIdentifiedItems(items => items.filter(item => item.name !== itemToRemove));
  };
  
  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setIdentifiedItems([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white/30 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center"><CameraIcon className="w-7 h-7 mr-3 text-[#007bff]"/> Inventaire Visuel</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-800"><XIcon className="w-6 h-6"/></button>
      </div>

      {!imageUrl && (
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#6d9e7d]/50 rounded-lg cursor-pointer bg-white/20 hover:bg-white/40 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ArrowUpTrayIcon className="w-10 h-10 mb-3 text-[#6d9e7d]"/>
            <p className="mb-2 text-sm text-gray-600"><span className="font-semibold">Cliquez pour choisir une photo</span></p>
            <p className="text-xs text-gray-500">ou prenez une photo de votre frigo</p>
          </div>
          <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      )}

      {imageUrl && (
        <div className="mt-4 space-y-4">
          <div className="relative">
            <img src={imageUrl} alt="Aliments à scanner" className="rounded-lg w-full max-h-80 object-cover" />
            <button onClick={handleReset} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70">
                <XIcon className="w-5 h-5"/>
            </button>
          </div>
          
          {identifiedItems.length === 0 && !isLoading && (
            <button onClick={handleScan} disabled={isLoading} className="w-full flex items-center justify-center px-6 py-3 bg-[#007bff] text-white font-semibold rounded-full shadow-lg hover:bg-[#006ae0] transition-all duration-300 ease-in-out transform hover:scale-105">
                <CameraIcon className="w-6 h-6 mr-2"/>
                Scanner les aliments
            </button>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-24">
          <Spinner />
          <p className="ml-3 text-gray-600">Identification des aliments...</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      {identifiedItems.length > 0 && !isLoading && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg flex items-center mb-3"><CheckCircleIcon className="w-6 h-6 mr-2 text-green-600"/> Aliments détectés :</h3>
          <p className="text-sm text-gray-500 mb-4">Vérifiez la liste, ajoutez une date de péremption (optionnel) et ajoutez-les à votre frigo.</p>
          <ul className="space-y-3">
            {identifiedItems.map(item => (
              <li key={item.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/50 rounded-lg p-3 shadow-sm gap-2">
                <span className="font-medium text-gray-800 capitalize">{item.name}</span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor={`date-${item.name}`} className="text-sm text-gray-600">Exp:</label>
                    <input
                        id={`date-${item.name}`}
                        type="date"
                        value={item.expirationDate}
                        min={minDate}
                        onChange={(e) => handleDateChange(item.name, e.target.value)}
                        className="w-full sm:w-auto text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button onClick={() => handleRemoveItem(item.name)} className="text-gray-400 hover:text-red-500 p-1">
                        <XIcon className="w-5 h-5"/>
                    </button>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={handleConfirm} className="w-full mt-6 flex items-center justify-center px-6 py-3 bg-[#6d9e7d] text-white font-semibold rounded-full shadow-lg hover:bg-[#5a8a69] transition-all duration-300 ease-in-out transform hover:scale-105">
            <PlusIcon className="w-6 h-6 mr-2"/>
            Ajouter au frigo
          </button>
        </div>
      )}
    </div>
  );
};