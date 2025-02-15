import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import GlobalModal from "../GlobalModal";
import {
  useDeleteProductVariantImageMutation,
  useUploadProductVariantImageMutation,
  useUpdateProductionVariantPrimaryImageMutation,
} from "../../store/apis/productApi";
import { toast } from "react-hot-toast";

const ImageUpload = ({ isOpen, onClose, variant }) => {
  const oldImages = variant.images;
  const [images, setImages] = useState(oldImages);
  const [deleteProductVariantImage] = useDeleteProductVariantImageMutation();
  const [uploadProductVariantImage] = useUploadProductVariantImageMutation();
  const [updateProductionVariantPrimaryImage] =
    useUpdateProductionVariantPrimaryImageMutation();
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      file,
      imageUrl: URL.createObjectURL(file),
      isPrimary: false,
      sortOrder: images.length + index,
    }));
    setImages([...images, ...newImages]);
  };

  const handleDelete = async (index) => {
    const newImages = [...images];
    const selectedImage = newImages[index];

    try {
      if (selectedImage.id) {
        toast.loading("Deleting image...", { id: "delete-image" });
        // Delete from backend if image exists on server
        await deleteProductVariantImage({
          id: variant.productId,
          variantId: variant.id,
          imageId: selectedImage.id,
        }).unwrap();
        toast.dismiss("delete-image");
        toast.success("Image deleted successfully");
      } else {
        // Revoke object URL to prevent memory leaks for local files
        if (newImages[index].file) {
          URL.revokeObjectURL(newImages[index].imageUrl);
        }
      }

      // Remove from local state
      newImages.splice(index, 1);

      // If we deleted the primary image and there are remaining images,
      // make the first image primary
      if (selectedImage.isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }

      setImages(newImages);
    } catch (error) {
      toast.dismiss("delete-image");
      toast.error(error?.data?.error || "Failed to delete image");
    }
  };

  const handlePrimaryChange = async (index) => {
    try {
      const selectedImage = images[index];
      if (selectedImage.id) {
        toast.loading("Setting primary image...", { id: "set-primary-image" });
        await updateProductionVariantPrimaryImage({
          id: variant.productId,
          variantId: variant.id,
          imageId: selectedImage.id,
        }).unwrap();
        toast.dismiss("set-primary-image");
        toast.success("Primary image set successfully");
      }

      const newImages = images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
        sortOrder: i,
      }));
      setImages(newImages);
    } catch (error) {
      toast.dismiss("set-primary-image");
      toast.error(error?.data?.error || "Failed to set primary image");
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleSave = async () => {
    try {
      const newImages = [...images].filter((img) => !img.id).map((img) => img);
      //lets prepare the data for the backend
      if (newImages.length > 0) {
        toast.loading("Uploading images...", { id: "upload-images" });
        const formData = new FormData();
        newImages.forEach((img) => {
          formData.append("files", img.file);
          formData.append(
            "metadata",
            JSON.stringify({
              isPrimary: img.isPrimary,
              sortOrder: img.sortOrder,
            })
          );
        });

        await uploadProductVariantImage({
          id: variant.productId,
          variantId: variant.id,
          data: formData,
        }).unwrap();

        toast.dismiss("upload-images");
        toast.success("Images uploaded successfully");
        onClose();
      } else {
        toast.error("No new images to upload");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to upload images");
    }
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title="Image Upload"
      className="w-full max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer bg-violet-50 text-violet-600 px-4 py-2 rounded-md hover:bg-violet-100"
          >
            Select Images
          </label>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.imageUrl || image.file}
                alt={image.altText || `Product image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <input
                  type="checkbox"
                  checked={image.isPrimary}
                  onChange={() => handlePrimaryChange(index)}
                  className="form-checkbox"
                />
                <button
                  onClick={() => handleDelete(index)}
                  className="text-white p-2 rounded-full hover:bg-red-500"
                >
                  <FaRegTrashCan />
                </button>
              </div>
              {image.isPrimary && (
                <span className="absolute top-2 left-2 bg-violet-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className="btn btn-lg bg-violet-600 text-white hover:bg-violet-700"
            onClick={handleSave}
            disabled={images.length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </GlobalModal>
  );
};

export default ImageUpload;
