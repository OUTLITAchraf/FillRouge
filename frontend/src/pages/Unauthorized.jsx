import React from 'react';
import { ShieldX, Lock } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#ECF0F1]">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header Section with Icon */}
          <div className="bg-linear-to-r from-[#E74C3C] to-[#C0392B] p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              <ShieldX size={64} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Access Denied
            </h1>
            <p className="text-white/90 text-lg">
              Error 401 - Unauthorized
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E74C3C]/10 rounded-full mb-4">
                <Lock size={32} className="text-[#E74C3C]" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-[#2C3E50]">
                You Don't Have Permission
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is a mistake, or sign in with an authorized account.
              </p>
            </div>

            {/* Possible Reasons */}
            <div className="bg-[#ECF0F1] rounded-lg p-6 text-left">
              <h3 className="font-semibold mb-3 text-[#2C3E50]">
                Possible reasons:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#E74C3C] mt-1">•</span>
                  <span>You are not logged in to the system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E74C3C] mt-1">•</span>
                  <span>Your session has expired</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E74C3C] mt-1">•</span>
                  <span>You don't have the required role or permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E74C3C] mt-1">•</span>
                  <span>This page is restricted to authorized users only</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}