import React from "react";

export default function CategoryPills({ categories, selectedCategory, onSelect }) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3 px-4">
      {categories.map((category) => {
        const active = category === selectedCategory;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`rounded-full border px-3 py-2 text-xs sm:px-4 sm:text-sm font-semibold shadow-md transition duration-200 active:scale-95 ${
              active
                ? "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "border-slate-300 bg-white text-slate-800 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}





// import React from "react";

// export default function CategoryPills({ categories, selectedCategory, onSelect }) {
//   return (
//     <div className="mt-10 flex flex-wrap gap-4">
//       {categories.map((category) => {
//         const active = category === selectedCategory;
//         return (
//           <button
//             key={category}
//             onClick={() => onSelect(category)}
//             className={`rounded-full border px-7 py-4 text-lg font-semibold shadow-md transition ${
//               active
//                 ? "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white"
//                 : "border-slate-300 bg-white text-slate-800 hover:border-blue-400"
//             }`}
//           >
//             {category}
//           </button>
//         );
//       })}
//     </div>
//   );
// }