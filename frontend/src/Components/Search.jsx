
import React from "react";

export default function Search( {value , setValue } ) {

    console.log(value);
  return (
    <div className="">
    <form
      class="cstm-fixed mx-auto flex items-center"
      style={{ width: "50rem" }}
    >
      <label for="voice-search" class="sr-only">
        Search
      </label>
      <div class="relative w-full">
        <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
         
        <svg
            className="me h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
            
        </div>
        <input
          type="text"
          id="voice-search"
          class="dark:focus:ring-orange-450 dark:focus:border-orange-450 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900  focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          placeholder="Search"
          required
          onChange={(e) => setValue(e.target.value)}
          
        />
       
         
        
      </div>
    </form>
    
    </div>
  );
}
