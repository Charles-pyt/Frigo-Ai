
import React, { useState, useCallback, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ItemDetailModal } from './components/ItemDetailModal';
import { generateRecipesFromIngredients } from './services/geminiService';
import type { InventoryItem, Recipe, UserCredentials } from './types';
import {
  PlusIcon,
  CheckIcon
} from './components/IconComponents';
import { LoginModal } from './components/LoginModal';

type View = 'dashboard' | 'scanner';

interface ItemToAdd {
    name: string;
    expirationDate?: Date;
}

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  useEffect(() => {
    const loggedInUserEmail = sessionStorage.getItem('currentUser');
    if (loggedInUserEmail) {
      setIsLoggedIn(true);
      setCurrentUser(loggedInUserEmail);
    }
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const triggerLogin = (action: () => void) => {
    setPendingAction(() => action);
    setShowLoginModal(true);
  };

  const handleSignUp = ({ email, password }: UserCredentials): Promise<void> => {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('frigo_ia_users') || '[]');
      const userExists = users.some((user: UserCredentials) => user.email === email);

      if (userExists) {
        reject(new Error("Cet e-mail est déjà utilisé."));
        return;
      }

      users.push({ email, password });
      localStorage.setItem('frigo_ia_users', JSON.stringify(users));
      
      setIsLoggedIn(true);
      setCurrentUser(email);
      sessionStorage.setItem('currentUser', email);
      setShowLoginModal(false);
      showNotification("Inscription réussie ! Bienvenue.");
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      resolve();
    });
  };

  const handleLogin = ({ email, password }: UserCredentials): Promise<void> => {
     return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('frigo_ia_users') || '[]');
      const user = users.find((user: UserCredentials) => user.email === email && user.password === password);

      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(email);
        sessionStorage.setItem('currentUser', email);
        setShowLoginModal(false);
        showNotification("Connexion réussie !");
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
        resolve();
      } else {
        reject(new Error("E-mail ou mot de passe incorrect."));
      }
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    showNotification("Vous avez été déconnecté.");
  };

  const handleAddItems = (items: ItemToAdd[]) => {
    const coreAddItemAction = () => {
        const newItems: InventoryItem[] = items.map(item => ({
          id: `${Date.now()}-${Math.random()}`,
          name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
          addDate: new Date(),
          expirationDate: item.expirationDate,
        }));
        setInventory(prev => [...prev, ...newItems]);
        setView('dashboard');
        showNotification(`${items.length} aliment(s) ajouté(s) au frigo !`);
    };
    
    if (inventory.length + items.length > 10 && !isLoggedIn) {
      triggerLogin(coreAddItemAction);
      return;
    }
    coreAddItemAction();
  };

  const handleRemoveItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const coreGenerateRecipesAction = useCallback(async () => {
    if (inventory.length === 0) {
      setError("Ajoutez d'abord des aliments à votre frigo.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setIsLoadingRecipes(true);
    setError(null);
    try {
      const ingredientNames = inventory.map(item => item.name);
      const generatedRecipes = await generateRecipesFromIngredients(ingredientNames);
      setRecipes(generatedRecipes);
    } catch (err) {
      setError("Une erreur est survenue lors de la génération des recettes. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsLoadingRecipes(false);
    }
  }, [inventory]);

  const handleGenerateRecipes = useCallback(() => {
    if (!isLoggedIn) {
      triggerLogin(coreGenerateRecipesAction);
      return;
    }
    coreGenerateRecipesAction();
  }, [isLoggedIn, coreGenerateRecipesAction, triggerLogin]);
  
  const handleNavigate = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen text-gray-800 flex">
      <Sidebar onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col pl-20">
        <Header 
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex-1">
          {view === 'dashboard' ? (
            <Dashboard
              inventory={inventory}
              recipes={recipes}
              onRemoveItem={handleRemoveItem}
              onGenerateRecipes={handleGenerateRecipes}
              isLoadingRecipes={isLoadingRecipes}
              error={error}
              onSelectItem={setSelectedItem}
            />
          ) : (
            <Scanner onAddItems={handleAddItems} onCancel={() => setView('dashboard')} />
          )}
        </main>
      </div>

      <ItemDetailModal 
        item={selectedItem}
        recipes={recipes}
        onClose={() => setSelectedItem(null)}
      />

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => {
            setShowLoginModal(false)
            setPendingAction(null);
        }}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />

      {view === 'dashboard' && (
         <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setView('scanner')}
            className="flex items-center justify-center w-16 h-16 bg-[#6d9e7d] text-white rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#6d9e7d]/50"
            aria-label="Ajouter des aliments"
          >
            <PlusIcon className="w-8 h-8" />
          </button>
        </div>
      )}
      
      {notification && (
        <div className="fixed top-20 right-6 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center animate-fade-in-out z-50">
          <CheckIcon className="w-5 h-5 mr-2"/>
          {notification}
        </div>
      )}
    </div>
  );
}
