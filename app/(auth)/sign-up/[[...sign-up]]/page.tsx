// import { SignUp } from '@clerk/nextjs'

// export default function Page() {
//   return ( <div className='flex items-center justify-center h-screen'>
//       <SignUp />
//       </div>)
// }
"use client";

import { SignUp } from "@clerk/nextjs";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Section */}

        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-700 text-white p-12 flex flex-col justify-center">

          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
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

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Create <span className="text-pink-400">Amazing</span>
            <br />
            Designs <span className="text-blue-400">With AI.</span>
          </h1>

          <p className="text-gray-300 text-lg">
            Generate beautiful responsive UI/UX designs
            instantly using AI-powered technology.
          </p>

        </div>

        {/* Right Section */}

        <div className="p-12 flex flex-col justify-center">

          

          <SignUp />
        </div>

      </div>

    </div>
  );
}