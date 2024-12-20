"use client";
import { signInActionWithGithub } from "@/app/actions";

const LogInWithGithub = () => {
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <button
        type="submit"
        formAction={signInActionWithGithub}
        className="flex items-center justify-center w-full gap-3 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="w-5 h-5"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.53 2.29 6.5 5.47 7.57.4.07.54-.17.54-.38 0-.19-.01-.69-.01-1.36-2.22.38-2.69-.98-2.69-.98-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.81.06 1.24.84 1.24.84.72 1.22 1.88.86 2.34.65.07-.52.28-.86.51-1.06-1.78-.2-3.63-.89-3.63-3.95 0-.87.31-1.58.82-2.13-.08-.2-.35-1.02.07-2.13 0 0 .66-.21 2.16.82C5.27 3.72 6.13 3.5 7 3.5c.87 0 1.73.22 2.44.62 1.5-1.03 2.16-.82 2.16-.82.42 1.11.15 1.93.07 2.13.51.55.82 1.26.82 2.13 0 3.07-1.85 3.75-3.64 3.95.31.27.58.79.58 1.58 0 1.14-.01 2.06-.01 2.34 0 .21.14.46.55.38C13.71 14.5 16 11.03 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span>Log in with GitHub </span>
      </button>
    </form>
  );
};

export default LogInWithGithub;
