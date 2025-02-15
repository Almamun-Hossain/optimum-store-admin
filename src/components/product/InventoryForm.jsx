import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalModal from "../GlobalModal";
import { useCreateOrUpdateInventoryMutation } from "../../store/apis/productApi";
import { toast } from "react-hot-toast";

const inventorySchema = z.object({
  quantityAvailable: z.number().min(0, "Quantity must be 0 or greater"),
  quantityReserved: z.number().min(0, "Reserved quantity must be 0 or greater"),
  reorderPoint: z.number().min(0, "Reorder point must be 0 or greater"),
});

const InventoryForm = ({ isOpen, onClose, variant, inventory }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  console.log("inventory", inventory);
  console.log("variant", variant);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      quantityAvailable: 0,
      quantityReserved: 0,
      reorderPoint: 0,
    },
  });

  const [createOrUpdateInventory, { isLoading }] =
    useCreateOrUpdateInventoryMutation();

  // Reset form values when inventory changes or edit mode is toggled
  useEffect(() => {
    if (inventory && isEditMode && variant.isActive) {
      reset({
        quantityAvailable: inventory.quantityAvailable,
        quantityReserved: inventory.quantityReserved,
        reorderPoint: inventory.reorderPoint,
      });
    }
  }, [inventory, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      await createOrUpdateInventory({
        id: variant.productId,
        variantId: variant.id,
        ...data,
      }).unwrap();
      handleCloseModal();
    } catch (error) {
      toast.error(
        error.data?.message ||
          `Failed to ${inventory ? "update" : "create"} inventory`
      );
    }
  };

  const onSubmitError = (error) => {
    console.log(error);
  };

  const handleCloseModal = () => {
    reset();
    setIsEditMode(false);
    onClose();
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={`Inventory - ${variant?.sku}`}
      className="w-full max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Inventory Details</h3>

          {variant.isActive && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="text-violet-600 hover:text-violet-700"
            >
              {isEditMode ? "View Mode" : "Edit Mode"}
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onSubmitError)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Available Quantity
              </label>
              {isEditMode ? (
                <div>
                  <input
                    type="number"
                    {...register("quantityAvailable", {
                      valueAsNumber: true,
                    })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                  />
                  {errors.quantityAvailable && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.quantityAvailable.message}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-gray-900">
                  {inventory?.quantityAvailable || 0}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reserved Quantity
              </label>
              {isEditMode ? (
                <div>
                  <input
                    type="number"
                    {...register("quantityReserved", { valueAsNumber: true })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                  />
                  {errors.quantityReserved && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.quantityReserved.message}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-gray-900">
                  {inventory?.quantityReserved || 0}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reorder Point
            </label>
            {isEditMode ? (
              <div>
                <input
                  type="number"
                  {...register("reorderPoint", { valueAsNumber: true })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                />
                {errors.reorderPoint && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.reorderPoint.message}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-1 text-gray-900">
                {inventory?.reorderPoint || 0}
              </p>
            )}
          </div>

          {inventory && (
            <div className="text-sm text-gray-500">
              Last Restock Date:{" "}
              {inventory.lastRestockDate
                ? new Date(inventory.lastRestockDate).toLocaleDateString()
                : "N/A"}
            </div>
          )}

          {isEditMode && (
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700"
                disabled={isLoading}
              >
                {inventory ? "Update" : "Create"} Inventory
              </button>
            </div>
          )}
        </form>
      </div>
    </GlobalModal>
  );
};

export default InventoryForm;
