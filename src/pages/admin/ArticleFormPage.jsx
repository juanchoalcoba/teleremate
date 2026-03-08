import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  Save,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  getArticleById,
  createArticle,
  updateArticle,
  uploadImages,
  deleteImage,
} from "../../services/api";
import { toast } from "react-hot-toast";

const CATEGORIES = [
  "Muebles",
  "Electrodomésticos",
  "Electrónica",
  "Arte",
  "Joyería",
  "Vehículos",
  "Ropa",
  "Herramientas",
  "Libros",
  "Otros",
];
const CONDITIONS = ["Excelente", "Muy bueno", "Bueno", "Regular"];

export default function ArticleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    lotNumber: "",
    title: "",
    description: "",
    category: "Muebles",
    condition: "Bueno",
    status: "depot",
    estimatedPrice: "",
    salePrice: "",
    featured: false,
    auctionDate: "",
  });

  const { data: articleData, isLoading: isLoadingArticle } = useQuery({
    queryKey: ["admin-article", id],
    queryFn: () => getArticleById(id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (articleData?.data) {
      const art = articleData.data;
      setFormData({
        lotNumber: art.lotNumber || "",
        title: art.title || "",
        description: art.description || "",
        category: art.category || "Muebles",
        condition: art.condition || "Bueno",
        status: art.status || "depot",
        estimatedPrice: art.estimatedPrice || "",
        salePrice: art.salePrice || "",
        featured: art.featured || false,
        auctionDate: art.auctionDate ? art.auctionDate.split("T")[0] : "",
      });
    }
  }, [articleData]);

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit ? updateArticle(id, data) : createArticle(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["admin-articles"]);
      toast.success(isEdit ? "Artículo actualizado" : "Artículo creado");
      if (!isEdit) {
        navigate(`/backoffice/articulos/editar/${res.data._id}`);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error al guardar");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (files) => uploadImages(id, files),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-article", id]);
      toast.success("Imágenes subidas");
    },
  });

  const deleteImgMutation = useMutation({
    mutationFn: (filename) => deleteImage(id, filename),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-article", id]);
      toast.success("Imagen eliminada");
    },
  });

  const onDrop = (acceptedFiles) => {
    if (!isEdit) {
      toast.error("Guardá el artículo primero para poder subir imágenes");
      return;
    }
    uploadMutation.mutate(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (isEdit && isLoadingArticle) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/backoffice/articulos"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-600 transition-colors text-sm font-medium"
      >
        <ChevronLeft size={16} /> Volver al inventario
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 font-display">
          {isEdit ? "Editar Artículo" : "Nuevo Artículo"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            id="article-form"
            onSubmit={handleSubmit}
            className="card-admin p-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="label-admin">Título del Artículo</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-admin text-lg font-bold"
                  placeholder="Ej: Sofá Chester 3 Cuerpos"
                />
              </div>

              <div>
                <label className="label-admin">Número de Lote</label>
                <input
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleChange}
                  required
                  className="input-admin font-mono"
                  placeholder="LOT-000"
                />
              </div>

              <div>
                <label className="label-admin">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-admin"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label-admin">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-admin resize-none"
                  placeholder="Detalles sobre el estado, dimensiones, materiales..."
                />
              </div>

              <div>
                <label className="label-admin">Precio Estimado ($)</label>
                <input
                  name="estimatedPrice"
                  type="number"
                  value={formData.estimatedPrice}
                  onChange={handleChange}
                  required
                  className="input-admin"
                />
              </div>

              <div>
                <label className="label-admin">Estado de Conservación</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="input-admin"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-brand-500 rounded border-gray-300 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-gray-700 underline decoration-brand-200 decoration-2 underline-offset-4">
                  Destacar este artículo en la portada
                </span>
              </label>
            </div>
          </form>

          {/* Image Upload Area */}
          <div className="card-admin p-8">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon size={20} className="text-gray-400" /> Imágenes del
              Lote
            </h3>

            {isEdit ? (
              <div className="space-y-6">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                    isDragActive
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-200 hover:border-brand-400 hover:bg-gray-50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-4">
                      {uploadMutation.isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Upload size={24} />
                      )}
                    </div>
                    <p className="font-bold text-gray-700">
                      Arrastrá las fotos acá
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      O hacé click para seleccionar (JPG, PNG)
                    </p>
                  </div>
                </div>

                {articleData?.data?.images?.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {articleData.data.images.map((img) => (
                      <div
                        key={img._id}
                        className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                      >
                        <img
                          src={img.url}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                        <button
                          onClick={() => deleteImgMutation.mutate(img.filename)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-center gap-4 text-amber-700">
                <AlertCircle size={24} />
                <p className="text-sm font-medium">
                  Primero tenés que guardar los datos básicos del artículo para
                  poder subir las fotos.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="card-admin p-6">
            <h3 className="font-bold text-gray-900 mb-4">Publicación</h3>
            <div className="space-y-4">
              <div>
                <label className="label-admin">Estado de Venta</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-admin text-sm"
                >
                  <option value="depot">En Depósito</option>
                  <option value="upcoming">Próximo Remate</option>
                  <option value="sold">Vendido</option>
                </select>
              </div>

              {formData.status === "upcoming" && (
                <div>
                  <label className="label-admin">Fecha del Remate</label>
                  <input
                    name="auctionDate"
                    type="date"
                    value={formData.auctionDate}
                    onChange={handleChange}
                    className="input-admin text-sm"
                  />
                </div>
              )}

              {formData.status === "sold" && (
                <div>
                  <label className="label-admin">
                    Precio Final de Venta ($)
                  </label>
                  <input
                    name="salePrice"
                    type="number"
                    value={formData.salePrice}
                    onChange={handleChange}
                    className="input-admin text-sm"
                  />
                </div>
              )}

              <hr className="border-gray-50 my-2" />

              <button
                form="article-form"
                type="submit"
                disabled={mutation.isLoading}
                className="btn-primary w-full justify-center py-3"
              >
                {mutation.isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isEdit ? "Guardar Cambios" : "Crear Artículo"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/backoffice/articulos")}
                className="btn-outline w-full justify-center"
              >
                Cancelar
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
            <AlertCircle size={20} className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              Asegurate de que las fotos sean claras y de buena calidad. El
              "Precio Estimado" es el precio base que verán los clientes en el
              sitio web.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
