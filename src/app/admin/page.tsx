"use client";

import { useMemo, useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Trash2, Plus, Loader2, PackagePlus } from "lucide-react";
import { discountPercent, formatPrice } from "@/lib/pricing";
import {
  deprecatedStarterProductNames,
  starterCatalog
} from "@/lib/starter-catalog";

const PRIMARY_ADMIN_EMAIL = "sembenpape4@gmail.com";
const ADMIN_PRODUCTS_PAGE_SIZE = 12;
const starterCatalogNames = new Set(starterCatalog.map((product) => product.name));

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [productsPage, setProductsPage] = useState(1);
  const [productSearch, setProductSearch] = useState("");

  // Form states
  const [adminName, setAdminName] = useState("");
  const [adminWhatsapp, setAdminWhatsapp] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [category, setCategory] = useState("parfum");
  const [stock, setStock] = useState("10");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  const supabase = useMemo(
    () =>
      supabaseUrl && supabaseKey
        ? createBrowserClient(supabaseUrl, supabaseKey)
        : null,
    [supabaseUrl, supabaseKey]
  );
  const missingSupabaseVars = [
    !supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : null,
    !supabaseKey ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" : null,
  ].filter(Boolean);
  const isPrimaryAdmin =
    session?.user?.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL;
  const filteredAdminProducts = products.filter((product) => {
    const search = productSearch.trim().toLowerCase();
    if (!search) return true;

    return [product.name, product.description, product.category]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });
  const productsTotalPages = Math.max(
    1,
    Math.ceil(filteredAdminProducts.length / ADMIN_PRODUCTS_PAGE_SIZE)
  );
  const safeProductsPage = Math.min(productsPage, productsTotalPages);
  const paginatedProducts = filteredAdminProducts.slice(
    (safeProductsPage - 1) * ADMIN_PRODUCTS_PAGE_SIZE,
    safeProductsPage * ADMIN_PRODUCTS_PAGE_SIZE
  );

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session) {
          fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
          fetchProducts(session.user.id, session.user.email);
          fetchOrders(session.user.id, session.user.email);
        }
        else setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session) {
          fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
          fetchProducts(session.user.id, session.user.email);
          fetchOrders(session.user.id, session.user.email);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, [supabase]);

  const fetchProducts = async (adminId?: string, adminEmail?: string) => {
    if (!supabase) return;
    const shouldShowAll =
      adminEmail?.toLowerCase() === PRIMARY_ADMIN_EMAIL;
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (adminId && !shouldShowAll) {
      query = query.eq('admin_id', adminId);
    }

    const { data, error } = await query;
    if (!error && data) {
      setProducts(data);
      setProductsPage(1);
    }
    setLoading(false);
  };

  const fetchOrders = async (adminId?: string, adminEmail?: string) => {
    if (!supabase || !adminId) return;
    const shouldShowAll =
      adminEmail?.toLowerCase() === PRIMARY_ADMIN_EMAIL;
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!shouldShowAll) {
      query = query.eq("admin_id", adminId);
    }

    const { data } = await query;
    setOrders(data || []);
  };

  const fetchProfile = async (
    adminId: string,
    fallbackEmail?: string,
    metadata?: { display_name?: string; whatsapp?: string }
  ) => {
    if (!supabase) return;
    const { data } = await supabase
      .from("admin_profiles")
      .select("display_name, whatsapp")
      .eq("id", adminId)
      .single();

    if (data) {
      setAdminName(data.display_name || fallbackEmail || "");
      setAdminWhatsapp(data.whatsapp || "");
    } else {
      const displayName = metadata?.display_name || fallbackEmail || "";
      const whatsapp = metadata?.whatsapp || "";
      setAdminName(displayName);
      setAdminWhatsapp(whatsapp);
      if (whatsapp) {
        await saveProfile(adminId, displayName, whatsapp);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return alert("Supabase non configuré.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return alert("Supabase non configuré.");
    if (!adminWhatsapp) return alert("Ajoutez le numéro WhatsApp de l'admin.");

    setActionLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: adminName || email,
            whatsapp: adminWhatsapp.replace(/[^\d]/g, ""),
          },
        },
      });
      if (error) throw error;

      if (data.session && data.user) {
        await saveProfile(data.user.id, adminName || email, adminWhatsapp);
        alert("Compte admin créé. Vous êtes connecté.");
      } else {
        alert("Compte créé. Confirmez l'email si Supabase vous le demande, puis connectez-vous.");
        setIsSignupMode(false);
      }
    } catch (err: any) {
      alert("Erreur inscription: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const saveProfile = async (
    adminId = session?.user?.id,
    displayName = adminName,
    whatsapp = adminWhatsapp
  ) => {
    if (!supabase || !adminId) return;
    const cleanWhatsapp = whatsapp.replace(/[^\d]/g, "");
    const { error } = await supabase.from("admin_profiles").upsert({
      id: adminId,
      display_name: displayName || session?.user?.email || "Vendeur",
      whatsapp: cleanWhatsapp,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    setAdminWhatsapp(cleanWhatsapp);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await saveProfile();
      alert("Profil admin enregistré.");
    } catch (err: any) {
      alert("Erreur profil: " + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    if (!supabase) throw new Error("Supabase non configuré.");
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
    
    // Upload vers le storage
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) throw error;
    
    // Récupérer le lien public de l'image
    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!adminWhatsapp) return alert("Enregistrez d'abord le WhatsApp de cet admin.");
    setActionLoading(true);

    try {
      let imageUrl = existingImageUrl || "/images/perfume.png";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name,
        description,
        price: parseFloat(price),
        compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
        category,
        stock: parseInt(stock, 10),
        image_url: imageUrl,
        admin_id: session.user.id,
        seller_name: adminName || session.user.email || "Vendeur",
        seller_whatsapp: adminWhatsapp.replace(/[^\d]/g, "")
      };

      let saveError;

      if (editingProductId) {
        let query = supabase
          .from('products')
          .update(payload)
          .eq('id', editingProductId);

        if (!isPrimaryAdmin) {
          query = query.eq('admin_id', session.user.id);
        }

        const { error } = await query;
        saveError = error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        saveError = error;
      }

      if (saveError) throw saveError;
      
      alert(editingProductId ? "Produit modifié avec succès !" : "Produit ajouté avec succès !");
      setIsAddingMode(false);
      resetForm();
      fetchProducts(session.user.id, session.user.email);
    } catch (err: any) {
      alert("Erreur lors de l'ajout: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Êtes-vous sûr de vouloir supprimer ce produit (Ceci est irréversible) ?")) return;
    setActionLoading(true);
    try {
      const productToDelete = products.find((product) => product.id === id);

      if (productToDelete && starterCatalogNames.has(productToDelete.name)) {
        const { error: exclusionError } = await supabase
          .from("catalog_import_exclusions")
          .upsert({
            admin_id: session.user.id,
            product_name: productToDelete.name,
          });

        if (exclusionError) {
          throw new Error(
            "Impossible de mémoriser cette suppression. Ajoutez la table catalog_import_exclusions avec le script schema.sql dans Supabase, puis réessayez."
          );
        }
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts(session.user.id, session.user.email);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeatured = async (product: any) => {
    if (!supabase) return;
    setActionLoading(true);

    try {
      let query = supabase
        .from("products")
        .update({ is_featured: !product.is_featured })
        .eq("id", product.id);

      if (!isPrimaryAdmin) {
        query = query.eq("admin_id", session.user.id);
      }

      const { error } = await query;
      if (error) throw error;
      fetchProducts(session.user.id, session.user.email);
    } catch (err: any) {
      if (err.message?.includes("is_featured")) {
        alert("Ajoutez la colonne is_featured dans Supabase avec le script SQL, puis réessayez.");
      } else {
        alert("Erreur sélection accueil: " + err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleImportStarterCatalog = async () => {
    if (!supabase) return;
    if (!adminWhatsapp) return alert("Enregistrez d'abord le WhatsApp de cet admin.");
    if (!confirm(`Synchroniser ${starterCatalog.length} produits du catalogue de départ ? Les produits existants avec le même nom seront mis à jour.`)) return;

    setImportLoading(true);
    try {
      const { data: excludedProducts, error: excludedProductsError } = await supabase
        .from("catalog_import_exclusions")
        .select("product_name")
        .eq("admin_id", session.user.id);

      if (excludedProductsError) {
        throw new Error(
          "Impossible de lire les produits supprimés. Ajoutez la table catalog_import_exclusions avec le script schema.sql dans Supabase, puis réessayez."
        );
      }

      const excludedNames = new Set(
        (excludedProducts || []).map((product) => product.product_name)
      );
      let legacyDeleteQuery = supabase
        .from("products")
        .delete()
        .in("name", deprecatedStarterProductNames);

      if (!isPrimaryAdmin) {
        legacyDeleteQuery = legacyDeleteQuery.eq("admin_id", session.user.id);
      }

      const { error: legacyDeleteError } = await legacyDeleteQuery;
      if (legacyDeleteError) throw legacyDeleteError;

      const existingByName = new Map(products.map((product) => [product.name, product]));
      const sellerData = {
        admin_id: session.user.id,
        seller_name: adminName || session.user.email || "Vendeur",
        seller_whatsapp: adminWhatsapp.replace(/[^\d]/g, ""),
      };
      const productsToImport = [];
      const productsToUpdate = [];

      for (const product of starterCatalog) {
        if (excludedNames.has(product.name)) {
          continue;
        }

        const payload = {
          ...product,
          ...sellerData,
        };
        const existingProduct = existingByName.get(product.name);

        if (existingProduct) {
          productsToUpdate.push({ id: existingProduct.id, payload });
        } else {
          productsToImport.push(payload);
        }
      }

      if (productsToImport.length === 0 && productsToUpdate.length === 0) {
        alert("Aucun produit à synchroniser.");
        return;
      }

      if (productsToImport.length > 0) {
        const { error } = await supabase.from("products").insert(productsToImport);
        if (error) throw error;
      }

      for (const product of productsToUpdate) {
        const { error } = await supabase
          .from("products")
          .update(product.payload)
          .eq("id", product.id);
        if (error) throw error;
      }

      alert(`${productsToImport.length} produits ajoutés, ${productsToUpdate.length} produits mis à jour, ${excludedNames.size} suppression(s) conservée(s).`);
      fetchProducts(session.user.id, session.user.email);
    } catch (err: any) {
      if (err.message?.includes("product_category")) {
        alert(
          "Erreur catégorie Supabase: ajoutez la valeur 'brume' dans l'enum product_category depuis le SQL Editor, puis relancez la synchronisation."
        );
      } else {
        alert("Erreur synchronisation catalogue: " + err.message);
      }
    } finally {
      setImportLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    if (!supabase) return;
    let query = supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (!isPrimaryAdmin) {
      query = query.eq("admin_id", session.user.id);
    }

    const { error } = await query;
    if (error) alert(error.message);
    else fetchOrders(session.user.id, session.user.email);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCompareAtPrice("");
    setCategory("parfum");
    setStock("10");
    setImageFile(null);
    setEditingProductId(null);
    setExistingImageUrl("");
  };

  const openAddForm = () => {
    resetForm();
    setIsAddingMode(true);
  };

  const openEditForm = (product: any) => {
    setEditingProductId(product.id);
    setExistingImageUrl(product.image_url || "");
    setName(product.name || "");
    setDescription(product.description || "");
    setPrice(String(product.price || ""));
    setCompareAtPrice(product.compare_at_price ? String(product.compare_at_price) : "");
    setCategory(product.category || "parfum");
    setStock(String(product.stock ?? 0));
    setImageFile(null);
    setIsAddingMode(true);
  };

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center text-muted tracking-widest animate-pulse">CHARGEMENT...</div>;

  // --- LOGIN VIEW ---
  if (!session) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full bg-[#0A0A0E] p-10 border border-white/5">
          <h1 className="font-serif text-2xl tracking-widest text-center mb-8">
            {isSignupMode ? "CRÉER UN ADMIN" : "ADMINISTRATION"}
          </h1>
          {!supabase && (
            <div className="bg-red-500/10 text-red-500 p-4 font-light text-sm mb-8 border border-red-500/20 text-center leading-relaxed">
              La connexion à Supabase est introuvable.<br/>
              Variable manquante dans ce déploiement: {missingSupabaseVars.join(", ")}.
            </div>
          )}
          <form onSubmit={isSignupMode ? handleSignup : handleLogin} className="space-y-6">
            {isSignupMode && (
              <>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-3">Nom admin</label>
                  <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full bg-primary border text-sm font-light border-white/10 px-4 py-3 focus:border-accent focus:outline-none transition-colors text-white" required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-3">WhatsApp admin</label>
                  <input type="tel" value={adminWhatsapp} onChange={e => setAdminWhatsapp(e.target.value)} placeholder="221771234567" className="w-full bg-primary border text-sm font-light border-white/10 px-4 py-3 focus:border-accent focus:outline-none transition-colors text-white" required />
                </div>
              </>
            )}
            <div>
               <label className="block text-xs uppercase tracking-widest text-muted mb-3">Email Administrateur</label>
               <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-primary border text-sm font-light border-white/10 px-4 py-3 focus:border-accent focus:outline-none transition-colors text-white" required />
            </div>
            <div>
               <label className="block text-xs uppercase tracking-widest text-muted mb-3">Mot de passe</label>
               <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-primary border text-sm font-light border-white/10 px-4 py-3 focus:border-accent focus:outline-none transition-colors text-white" required />
            </div>
            <button type="submit" disabled={!supabase || actionLoading} className="w-full bg-accent text-primary px-4 py-4 uppercase tracking-widest font-semibold hover:bg-white transition-colors duration-300 mt-4 disabled:opacity-50">
              {actionLoading ? "Veuillez patienter..." : isSignupMode ? "Créer le compte" : "Connexion"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setIsSignupMode(!isSignupMode)}
            className="w-full mt-6 text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            {isSignupMode ? "J'ai déjà un compte" : "Créer un compte admin"}
          </button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-10 border-b border-white/5 pb-8">
        <h1 className="font-serif text-2xl sm:text-3xl tracking-widest">DASHBOARD</h1>
        <button onClick={() => supabase?.auth.signOut()} className="text-xs font-light text-muted hover:text-accent uppercase tracking-widest transition-colors">Déconnexion</button>
      </div>

      <form onSubmit={handleSaveProfile} className="bg-[#0A0A0E] border border-white/5 p-6 mb-10 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nom admin</label>
          <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none" required />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">WhatsApp commandes</label>
          <input type="tel" value={adminWhatsapp} onChange={e => setAdminWhatsapp(e.target.value)} placeholder="221771234567" className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none" required />
        </div>
        <button type="submit" disabled={profileLoading} className="bg-accent text-primary px-6 py-3 uppercase tracking-widest font-semibold hover:bg-white transition-colors disabled:opacity-50">
          {profileLoading ? "..." : "Enregistrer"}
        </button>
      </form>
      
      {isAddingMode ? (
        <div className="bg-[#0A0A0E] p-5 sm:p-8 border border-white/5 max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl tracking-wide mb-8 text-accent">
            {editingProductId ? "Modifier Produit" : "Nouveau Produit"}
          </h2>
          <form onSubmit={handleSaveProduct} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nom du produit</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none" required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Catégorie</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none text-white appearance-none">
                  <option value="parfum">Parfum</option>
                  <option value="huile">Huile Précieuse</option>
                  <option value="deodorant">Déodorant</option>
                  <option value="brume">Brume</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Prix actuel (FCFA)</label>
                <input type="number" step="1" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none" required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Prix avant réduction</label>
                <input type="number" step="1" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} placeholder="Optionnel" className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Stock disponible</label>
                <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none" required />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Description élégante</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none" required />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Photo du produit (Bucket Supabase requis)</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted file:bg-accent file:text-primary file:border-0 file:px-4 file:py-2 file:mr-4 file:hover:bg-white file:transition-colors file:cursor-pointer" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button type="submit" disabled={actionLoading} className="flex-1 bg-accent text-primary px-4 py-3 uppercase tracking-widest font-semibold hover:bg-white transition-colors disabled:opacity-50 flex justify-center items-center">
                {actionLoading ? <Loader2 className="animate-spin" size={20} /> : editingProductId ? "Enregistrer les modifications" : "Ajouter le produit"}
              </button>
              <button type="button" onClick={() => {setIsAddingMode(false); resetForm()}} className="px-6 py-3 border border-white/10 hover:border-white transition-colors uppercase tracking-widest text-sm text-muted">
                Annuler
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
            <div>
              <h2 className="font-serif text-2xl tracking-wide text-white">Catalogue en direct</h2>
              <p className="mt-2 text-sm text-muted">
                {products.length} produit{products.length > 1 ? "s" : ""} au total
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleImportStarterCatalog} disabled={importLoading} className="flex items-center justify-center space-x-2 border border-white/10 text-muted px-5 py-3 uppercase tracking-widest font-semibold hover:border-accent hover:text-accent transition-colors text-sm disabled:opacity-50">
                {importLoading ? <Loader2 className="animate-spin" size={18} /> : <PackagePlus size={18} />}
                <span>Synchroniser catalogue</span>
              </button>
              <button onClick={openAddForm} className="flex items-center justify-center space-x-2 bg-accent text-primary px-6 py-3 uppercase tracking-widest font-semibold hover:bg-white transition-colors text-sm">
                <Plus size={18} />
                <span>Nouveau</span>
              </button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <input
              type="search"
              value={productSearch}
              onChange={(event) => {
                setProductSearch(event.target.value);
                setProductsPage(1);
              }}
              placeholder="Rechercher dans le catalogue admin"
              className="w-full bg-[#0A0A0E] border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none"
            />
            <p className="text-sm text-muted">
              {filteredAdminProducts.length} résultat{filteredAdminProducts.length > 1 ? "s" : ""}
            </p>
          </div>

          {filteredAdminProducts.length === 0 ? (
            <div className="bg-[#0A0A0E] p-12 text-center border border-white/5 text-muted font-light">
              <p>Aucun produit trouvé.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-muted">
                    <th className="pb-4 pl-4">Produit</th>
                    <th className="pb-4">Catégorie</th>
                    <th className="pb-4">Prix</th>
                    <th className="pb-4">Stock</th>
                    <th className="pb-4">Accueil</th>
                    <th className="pb-4 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-16 relative bg-primary flex-shrink-0 border border-white/5">
                            {/* Suppression du Image Next.js ici pour un img standard si path externe possible, ou on garde image avec uncheck config */}
                            <img src={p.image_url || "/images/perfume.png"} alt={p.name} className="object-cover w-full h-full" />
                          </div>
                          <span className="font-serif tracking-wide truncate max-w-[200px] block">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-4 capitalize font-light text-muted text-sm">{p.category}</td>
                      <td className="py-4 tracking-widest text-sm text-accent">
                        {discountPercent(Number(p.price), Number(p.compare_at_price)) && (
                          <span className="block text-xs text-muted line-through mb-1">
                            {formatPrice(Number(p.compare_at_price))}
                          </span>
                        )}
                        {formatPrice(Number(p.price))}
                      </td>
                      <td className="py-4 font-light text-sm">
                        <span className={p.stock < 5 ? "text-red-400 font-medium" : "text-green-400"}>{p.stock}</span>
                      </td>
                      <td className="py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          disabled={actionLoading}
                          className={`border px-3 py-2 text-xs uppercase tracking-widest transition-colors ${
                            p.is_featured
                              ? "border-accent bg-accent text-primary"
                              : "border-white/10 text-muted hover:border-accent hover:text-accent"
                          } disabled:opacity-50`}
                        >
                          {p.is_featured ? "Affiché" : "Afficher"}
                        </button>
                      </td>
                      <td className="py-4 text-right pr-4">
                        <button onClick={() => openEditForm(p)} disabled={actionLoading} className="text-muted hover:text-accent transition-colors p-2 text-xs uppercase tracking-widest">
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(p.id)} disabled={actionLoading} className="text-muted hover:text-red-500 transition-colors p-2">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAdminProducts.length > ADMIN_PRODUCTS_PAGE_SIZE && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted">
                    Page {safeProductsPage} / {productsTotalPages}
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setProductsPage((page) => Math.max(1, page - 1))}
                      disabled={safeProductsPage === 1}
                      className="border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
                    >
                      Précédent
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductsPage((page) => Math.min(productsTotalPages, page + 1))}
                      disabled={safeProductsPage === productsTotalPages}
                      className="border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <section className="mt-16 border-t border-white/5 pt-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl tracking-wide text-white">Commandes</h2>
          <button onClick={() => fetchOrders(session.user.id, session.user.email)} className="text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors">
            Actualiser
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#0A0A0E] p-10 text-center border border-white/5 text-muted font-light">
            Aucune commande enregistrée pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#0A0A0E] border border-white/5 p-5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-accent tracking-widest text-sm">
                      {formatPrice(Number(order.total))}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(order.created_at).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-sm text-muted mb-2">
                    Client: {order.customer_name || "Non renseigné"} {order.customer_phone ? `- ${order.customer_phone}` : ""}
                  </p>
                  {order.customer_address && (
                    <p className="text-sm text-muted mb-3">Adresse: {order.customer_address}</p>
                  )}
                  <ul className="space-y-1 text-sm">
                    {(order.items || []).map((item: any, index: number) => (
                      <li key={`${order.id}-${index}`}>
                        {item.name} x{item.quantity} - {formatPrice(Number(item.price) * Number(item.quantity))}
                      </li>
                    ))}
                  </ul>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  className="bg-primary border border-white/10 px-4 py-3 text-sm focus:border-accent outline-none h-fit"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
