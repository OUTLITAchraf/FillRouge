import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Calendar, FileText, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { reserverService } from "../features/ServiceSlice";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

// ✅ Define validation schema
const reservationSchema = yup.object().shape({
  reservation_date: yup
    .date()
    .typeError("Please enter a valid date")
    .min(new Date(), "Date must be in the future")
    .required("Reservation date is required"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
});

const ReservationForm = ({ onClose, onSuccess }) => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(reservationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const formattedDate = new Date(data.reservation_date)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const formData = {
        ...data,
        reservation_date: formattedDate,
        service_id: id,
      };

      await dispatch(reserverService(formData)).unwrap();

      toast.success("Your Reservation Submited Successfully!");
      reset();
      onSuccess?.() // close modal
    } catch (error) {
      console.log("Error from model reservation :", error);
      // toast.error()
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "#ECF0F1" }}
        >
          <h2 className="text-2xl font-bold" style={{ color: "#2C3E50" }}>
            Make a Reservation
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Date Field */}
          <div>
            <label
              className="block text-sm font-semibold mb-2 flex items-center gap-2"
              style={{ color: "#2C3E50" }}
            >
              <Calendar size={18} style={{ color: "#2ECC71" }} />
              Reservation Date
            </label>
            <input
              type="datetime-local"
              {...register("reservation_date")}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none transition-colors"
              style={{ color: "#2C3E50" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2ECC71")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
            />
            {errors.reservation_date && (
              <p className="text-sm mt-1" style={{ color: "#E74C3C" }}>
                {errors.reservation_date.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              className="block text-sm font-semibold mb-2 flex items-center gap-2"
              style={{ color: "#2C3E50" }}
            >
              <FileText size={18} style={{ color: "#2ECC71" }} />
              Description
            </label>
            <textarea
              {...register("description")}
              rows="4"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none transition-colors resize-none"
              placeholder="Describe your reservation..."
              style={{ color: "#2C3E50" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2ECC71")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
            ></textarea>
            {errors.description && (
              <p className="text-sm mt-1" style={{ color: "#E74C3C" }}>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: "#ECF0F1", color: "#2C3E50" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#BDC3C7")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#ECF0F1")
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors"
              style={{ backgroundColor: "#E67E22" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#D35400")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#E67E22")
              }
            >
              Reserve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
