// import { SignIn } from '@clerk/nextjs'

// export default function Page() {
//   return (
//   <div className='flex items-center justify-center h-screen'>
//    <SignIn />
//     </div>
    
//   )
// }

"use client";

import { SignIn } from "@clerk/nextjs";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Section */}

        <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-700 text-white p-12 flex flex-col justify-center">

          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
              UI
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                AI UI/UX
              </h2>

              <p className="text-gray-300">
                DESIGN GENERATOR
              </p>
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Design{" "}
            <span className="text-purple-400">
              Smarter.
            </span>
            <br />

            Generate{" "}
            <span className="text-blue-400">
              Faster.
            </span>
          </h1>

          <p className="text-gray-300 text-lg leading-8 mb-10">
            Create beautiful responsive UI/UX designs using AI.
            Just describe your idea and let AI do the magic.
          </p>

          <div className="space-y-8">

            <div className="flex gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl">
                ✨
              </div>

              <div>
                <h3 className="font-bold text-xl">
                  AI Powered
                </h3>

                <p className="text-gray-300">
                  Generate designs from prompts
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl">
                📱
              </div>

              <div>
                <h3 className="font-bold text-xl">
                  Modern Components
                </h3>

                <p className="text-gray-300">
                  Responsive and clean UI elements
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl">
                ☁️
              </div>

              <div>
                <h3 className="font-bold text-xl">
                  Export & Share
                </h3>

                <p className="text-gray-300">
                  Download screenshots and code
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Section */}

        <div className="p-12 flex flex-col justify-center">

          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-4xl mx-auto mb-6">
            <SignIn/>
          </div>

          <div>
            
          </div>
        </div>

      </div>

    </div>
  );
}