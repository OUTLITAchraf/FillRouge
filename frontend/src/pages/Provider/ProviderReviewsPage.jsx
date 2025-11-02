import { Star } from "lucide-react";
import React from "react";

function ProviderReviewsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Star className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#2C3E50" }}>
          Reviews
        </h3>
        <p className="text-gray-600">
          Customer reviews will be displayed here.
        </p>
      </div>
    </div>
  );
}

export default ProviderReviewsPage;
